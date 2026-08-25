import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  convertMillimetersToTwip,
  LineRuleType,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { AuditResult, DocumentFileItem } from '../types';

/**
 * NGHỊ ĐỊNH 30/2020/NĐ-CP KỸ THUẬT TRÌNH BÀY VĂN BẢN HÀNH CHÍNH
 * 
 * 1. Khổ giấy: A4 (210 mm x 297 mm = 11906 x 16838 twips)
 * 2. Căn lề chuẩn xác:
 *    - Lề trái (Left): 30 mm = 3.0 cm (~1701 twips)
 *    - Lề phải (Right): 20 mm = 2.0 cm (~1134 twips)
 *    - Lề trên (Top): 20 mm = 2.0 cm (~1134 twips)
 *    - Lề dưới (Bottom): 20 mm = 2.0 cm (~1134 twips)
 * 3. Chiều rộng in ấn hiệu dụng: 160 mm = 9071 twips
 *    - Cột cơ quan / Nơi nhận (Trái): 3800 twips (~6.7 cm)
 *    - Cột Quốc hiệu / Chữ ký (Phải): 5271 twips (~9.3 cm)
 */

export const ND30_MARGINS = {
  top: convertMillimetersToTwip(20),     // 20 mm = 2.0 cm
  bottom: convertMillimetersToTwip(20),  // 20 mm = 2.0 cm
  left: convertMillimetersToTwip(30),    // 30 mm = 3.0 cm
  right: convertMillimetersToTwip(20),   // 20 mm = 2.0 cm
};

export const PRINTABLE_WIDTH_TWIP = 9071; // 160mm in twips
export const COL_LEFT_WIDTH_TWIP = 3800;  // ~6.7cm
export const COL_RIGHT_WIDTH_TWIP = 5271; // ~9.3cm

export const FONT_TIMES = 'Times New Roman';

// Half-points for docx (size: 24 = 12pt, 26 = 13pt, 28 = 14pt, 22 = 11pt)
export const SIZES = {
  TITLE: 28,      // 14pt (Tên loại, Lệnh ban hành, Người ký)
  BODY: 26,       // 13pt (Nội dung chính, Căn cứ, Điều khoản, Tiêu ngữ)
  SMALL: 24,      // 12pt (Cơ quan cấp trên, Quốc hiệu, Nơi nhận tiêu đề)
  CAPTION: 22,    // 11pt (Các dòng nơi nhận chi tiết theo NĐ 30)
};

// Line spacing: 1.25x (300 twips) and 3-5pt space after
const PARAGRAPH_SPACING = {
  line: 300,
  lineRule: LineRuleType.AUTO,
  after: 80, // ~4pt
};

// 1x1 black pixel PNG converted to Uint8Array for rendering solid shape lines in Word DrawingML
const BLACK_PIXEL_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function getBlackPixelData(): Uint8Array {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    const binary = window.atob(BLACK_PIXEL_BASE64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return Uint8Array.from([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0,
    0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 13, 73, 68, 65, 84, 120, 218,
    99, 100, 248, 207, 80, 15, 0, 3, 134, 1, 128, 90, 52, 125, 107, 0, 0, 0, 0, 73,
    69, 78, 68, 174, 66, 96, 130
  ]);
}

const BLACK_LINE_DATA = getBlackPixelData();

/**
 * Tạo đường kẻ ngang nét liền (solid continuous line) chuẩn theo công cụ Shapes -> Line trong Word,
 * tuân thủ 100% quy định tại Phụ lục I - Nghị định 30/2020/NĐ-CP:
 * - Dưới Tiêu ngữ: Nét liền có độ dài bằng đúng độ dài dòng chữ "Độc lập - Tự do - Hạnh phúc" (~6.5cm = 185px).
 * - Dưới Tên cơ quan: Nét liền có độ dài bằng từ 1/3 đến 1/2 độ dài dòng chữ (~2.8cm = 80px).
 * - Dưới Trích yếu: Nét liền có độ dài bằng từ 1/3 đến 1/2 độ dài trích yếu (~4.5cm = 130px).
 */
export function createND30SolidLine(
  type: 'agency' | 'motto' | 'subject' | number,
  spacingAfter = 40
): Paragraph {
  let lineWidth = 100;
  if (type === 'agency') {
    lineWidth = 80; // ~2.8 cm (1/3 đến 1/2 tên cơ quan)
  } else if (type === 'motto') {
    lineWidth = 185; // ~6.5 cm (vừa khít 100% dòng chữ "Độc lập - Tự do - Hạnh phúc")
  } else if (type === 'subject') {
    lineWidth = 130; // ~4.5 cm (1/3 đến 1/2 trích yếu văn bản)
  } else if (typeof type === 'number') {
    lineWidth = type;
  }

  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 20, after: spacingAfter },
    children: [
      new ImageRun({
        data: BLACK_LINE_DATA,
        type: 'png',
        transformation: {
          width: lineWidth,
          height: 1.2, // Nét đơn thanh mảnh chuẩn 1pt như vẽ Shapes -> Line trong Word
        },
      }),
    ],
  });
}

const INDENT_FIRST_LINE = convertMillimetersToTwip(12.7); // 1.27 cm standard indent

const NO_BORDER = {
  top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

export interface ParsedAdminDocument {
  superiorAgency?: string;
  agencyName?: string;
  docNumber?: string;
  isDraft?: boolean;
  mottoNation: string;
  mottoDetail: string;
  placeDate?: string;
  docTypeTitle?: string;
  subjectTitle?: string;
  authorityPreamble?: string;
  dearRecipient?: string; // Kính gửi
  legalBases: string[];
  commandStatement?: string;
  bodyParagraphs: string[];
  recipients: string[];
  signerTitle?: string;
  signerName?: string;
}

/**
 * Strips any motto text (both HÒA and HOÀ orthography), date, doc number, draft labels
 * from a string to prevent stray motto fragments from corrupting agency names or body text.
 */
function cleanStrayMotto(text: string): string {
  if (!text) return '';
  return text
    .replace(/CỘNG\s+(?:HÒA|HOÀ)\s+XÃ\s+HỘI\s+CHỦ\s+NGHĨA\s+VIỆT\s+NAM/gi, '')
    .replace(/Độc\s+lập\s*[-–—]\s*Tự\s+do\s*[-–—]\s*Hạnh\s+phúc/gi, '')
    .replace(/ĐỘC\s+LẬP\s*[-–—]\s*TỰ\s+DO\s*[-–—]\s*HẠNH\s+PHÚC/gi, '')
    .replace(/[-=_*~─━–—+]{2,}/g, '')
    .trim();
}

/**
 * Robust, semantic parser for Vietnamese administrative documents.
 * Handles OCR artifacts, merged 2-column lines, both 'HÒA' and 'HOÀ' spellings,
 * and guarantees clean separation of header, body, bases, recipients, and signature.
 */
export function parseAdminText(rawText: string): ParsedAdminDocument {
  const normalizedText = (rawText || '').normalize('NFC');
  const initialRawLines = normalizedText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const result: ParsedAdminDocument = {
    mottoNation: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
    mottoDetail: 'Độc lập - Tự do - Hạnh phúc',
    legalBases: [],
    bodyParagraphs: [],
    recipients: [],
  };

  // Preprocess lines: Split lines if two columns were accidentally concatenated together
  const lines: string[] = [];

  for (const rawLine of initialRawLines) {
    let line = rawLine;

    // Check and extract Motto Nation
    const mottoNationMatch = line.match(/CỘNG\s+(?:HÒA|HOÀ)\s+XÃ\s+HỘI\s+CHỦ\s+NGHĨA\s+VIỆT\s+NAM/i);
    if (mottoNationMatch) {
      result.mottoNation = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
      line = line.replace(/CỘNG\s+(?:HÒA|HOÀ)\s+XÃ\s+HỘI\s+CHỦ\s+NGHĨA\s+VIỆT\s+NAM/gi, ' ').trim();
    }

    // Check and extract Motto Detail
    const mottoDetailMatch = line.match(/Độc\s+lập\s*[-–—]\s*Tự\s+do\s*[-–—]\s*Hạnh\s+phúc/i);
    if (mottoDetailMatch) {
      result.mottoDetail = 'Độc lập - Tự do - Hạnh phúc';
      line = line.replace(/Độc\s+lập\s*[-–—]\s*Tự\s+do\s*[-–—]\s*Hạnh\s+phúc/gi, ' ').trim();
    }

    // Check and extract Date line
    const dateMatch = line.match(/(?:([A-ZÀ-Ỹa-zà-ỹ\s]+),\s*)?ngày\s+(\d+|\s*)\s*tháng\s+(\d+|\s*)\s*năm\s+(\d{4}|\s*)/i);
    if (dateMatch && !result.placeDate && !line.toLowerCase().includes('căn cứ') && !line.toLowerCase().includes('theo đề nghị')) {
      result.placeDate = line;
      line = '';
    }

    // Check Draft label
    if (/\(\s*dự\s+thảo\s*\)/i.test(line)) {
      result.isDraft = true;
      line = line.replace(/\(\s*dự\s+thảo\s*\)/gi, '').trim();
    }

    // Check Document Number (Số: ...)
    if (/^số\s*:/i.test(line) || /^số\s+\d+/i.test(line)) {
      if (!result.docNumber) {
        result.docNumber = line;
        line = '';
      }
    }

    // Clean remaining line of separators
    const cleaned = line.replace(/^[-=_*~─━–—+\s]{2,}$/, '').trim();
    if (cleaned.length > 0 && !/^[-=_*~─━–—+\s]+$/.test(cleaned)) {
      lines.push(cleaned);
    }
  }

  // Find index boundaries for sections
  let docTypeIndex = -1;
  let commandIndex = -1;
  let recipientsIndex = -1;
  let finalSignerIndex = -1;

  const docTypeKeywords = [
    'QUYẾT ĐỊNH',
    'TỜ TRÌNH',
    'KẾ HOẠCH',
    'BÁO CÁO',
    'THÔNG BÁO',
    'BIÊN BẢN',
    'BẢN TỰ CÔNG BỐ SẢN PHẨM',
    'BẢN CAM KẾT',
    'CÔNG VĂN',
    'GIẤY MỜI',
    'CHỈ THỊ',
    'QUY CHẾ',
    'QUY ĐỊNH'
  ];

  // 1. Identify Key Anchors
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upper = line.toUpperCase();
    const lower = line.toLowerCase();

    // Check Document Type (only in first half of document)
    if (docTypeIndex === -1 && i < 15) {
      if (docTypeKeywords.includes(upper)) {
        docTypeIndex = i;
        result.docTypeTitle = upper;
        continue;
      }
    }

    // Check Command Statement
    if (commandIndex === -1 && (upper === 'QUYẾT ĐỊNH:' || upper === 'QUY ĐỊNH:' || upper === 'YÊU CẦU:')) {
      commandIndex = i;
      result.commandStatement = line;
      continue;
    }

    // Check Nơi nhận
    if (recipientsIndex === -1 && (lower.startsWith('nơi nhận:') || lower === 'nơi nhận')) {
      recipientsIndex = i;
      continue;
    }
  }

  // 2. Parse Header Block (all lines before docTypeIndex or first 6 lines)
  const headerEnd = docTypeIndex !== -1 ? docTypeIndex : Math.min(6, lines.length);
  const agencyLines: string[] = [];

  for (let i = 0; i < headerEnd; i++) {
    const line = lines[i];
    const cleaned = cleanStrayMotto(line);
    if (!cleaned) continue;

    const lower = cleaned.toLowerCase();

    if (lower.startsWith('số:') || lower.startsWith('số :') || lower.startsWith('số')) {
      if (!result.docNumber) result.docNumber = cleaned;
      continue;
    }

    if (lower.includes('ngày') && lower.includes('tháng') && lower.includes('năm')) {
      if (!result.placeDate) result.placeDate = cleaned;
      continue;
    }

    agencyLines.push(cleaned);
  }

  if (agencyLines.length === 1) {
    result.agencyName = cleanStrayMotto(agencyLines[0]);
  } else if (agencyLines.length === 2) {
    result.superiorAgency = cleanStrayMotto(agencyLines[0]);
    result.agencyName = cleanStrayMotto(agencyLines[1]);
  } else if (agencyLines.length >= 3) {
    result.superiorAgency = cleanStrayMotto(agencyLines[0]);
    result.agencyName = cleanStrayMotto(agencyLines.slice(1).join(' '));
  }

  // 3. Parse Subject (Lines immediately after DocTypeTitle)
  let subjectEnd = docTypeIndex !== -1 ? docTypeIndex + 1 : 0;
  if (docTypeIndex !== -1) {
    const subjectLines: string[] = [];
    for (let i = docTypeIndex + 1; i < lines.length; i++) {
      const line = cleanStrayMotto(lines[i]);
      if (!line) continue;

      const upper = line.toUpperCase();
      const lower = line.toLowerCase();

      // Check if we hit Authority Preamble or Kính gửi or Căn cứ
      if (
        upper.startsWith('GIÁM ĐỐC') ||
        upper.startsWith('CHI CỤC TRƯỞNG') ||
        upper.startsWith('BỘ TRƯỞNG') ||
        upper.startsWith('CHỦ TỊCH') ||
        lower.startsWith('kính gửi') ||
        lower.startsWith('căn cứ') ||
        upper === 'QUYẾT ĐỊNH:'
      ) {
        subjectEnd = i;
        break;
      }

      subjectLines.push(line);
      subjectEnd = i + 1;
    }

    if (subjectLines.length > 0) {
      result.subjectTitle = subjectLines.join(' ');
    }
  }

  // 4. Parse Authority Preamble / Kính gửi
  let preambleEnd = subjectEnd;
  for (let i = subjectEnd; i < lines.length; i++) {
    const line = cleanStrayMotto(lines[i]);
    if (!line) continue;

    const upper = line.toUpperCase();
    const lower = line.toLowerCase();

    if (
      upper.startsWith('GIÁM ĐỐC') ||
      upper.startsWith('CHI CỤC TRƯỞNG') ||
      upper.startsWith('BỘ TRƯỞNG') ||
      upper.startsWith('CHỦ TỊCH')
    ) {
      result.authorityPreamble = line;
      preambleEnd = i + 1;
      break;
    }

    if (lower.startsWith('kính gửi:') || lower.startsWith('kính gửi')) {
      result.dearRecipient = line;
      preambleEnd = i + 1;
      break;
    }

    if (lower.startsWith('căn cứ') || upper === 'QUYẾT ĐỊNH:') {
      preambleEnd = i;
      break;
    }
  }

  // 5. Parse Legal Bases (Căn cứ...)
  let legalBasesEnd = preambleEnd;
  for (let i = preambleEnd; i < lines.length; i++) {
    const line = cleanStrayMotto(lines[i]);
    if (!line) continue;

    const lower = line.toLowerCase();
    const upper = line.toUpperCase();

    if (upper === 'QUYẾT ĐỊNH:' || upper === 'QUY ĐỊNH:' || upper === 'YÊU CẦU:') {
      legalBasesEnd = i + 1;
      break;
    }

    if (
      lower.startsWith('căn cứ') ||
      lower.startsWith('theo đề nghị') ||
      lower.startsWith('xét đề nghị')
    ) {
      result.legalBases.push(line);
      legalBasesEnd = i + 1;
    } else if (line.startsWith('Điều ') || line.startsWith('1.') || line.startsWith('I.')) {
      legalBasesEnd = i;
      break;
    }
  }

  // 6. Find Signer & Recipients section at bottom
  let foundSigner = false;

  // Search for signer starting keyword
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 12); i--) {
    const line = cleanStrayMotto(lines[i]);
    const upper = line.toUpperCase();

    if (
      upper.startsWith('KT. GIÁM ĐỐC') ||
      upper.startsWith('KT. CHI CỤC TRƯỞNG') ||
      upper.startsWith('TM. ỦY BAN') ||
      upper.startsWith('TM. UBND') ||
      upper.startsWith('TL. GIÁM ĐỐC') ||
      upper.startsWith('TUQ. GIÁM ĐỐC') ||
      upper.startsWith('PHÓ GIÁM ĐỐC') ||
      upper.startsWith('PHÓ CHI CỤC TRƯỞNG') ||
      upper === 'GIÁM ĐỐC' ||
      upper === 'CHI CỤC TRƯỞNG' ||
      upper === 'CHỦ TỊCH' ||
      upper === 'THỦ TRƯỞNG CƠ QUAN'
    ) {
      finalSignerIndex = i;
      foundSigner = true;
      // Do not break early if we find PHÓ GIÁM ĐỐC but the previous line is KT. GIÁM ĐỐC
      if (i > 0) {
        const prevUpper = cleanStrayMotto(lines[i - 1]).toUpperCase();
        if (
          prevUpper.startsWith('KT. ') ||
          prevUpper.startsWith('TM. ') ||
          prevUpper.startsWith('TL. ') ||
          prevUpper.startsWith('TUQ. ')
        ) {
          finalSignerIndex = i - 1;
        }
      }
      break;
    }
  }

  if (foundSigner && finalSignerIndex !== -1) {
    const signerChunk = lines.slice(finalSignerIndex).map((l) => cleanStrayMotto(l)).filter((l) => l.length > 0);
    const cleanChunk = signerChunk.filter(
      (l) => !l.toLowerCase().includes('(chữ ký') && !l.toLowerCase().includes('(ký, ghi rõ') && !l.toLowerCase().includes('(ký tên')
    );
    if (cleanChunk.length >= 2) {
      result.signerTitle = cleanChunk.slice(0, cleanChunk.length - 1).join('\n');
      result.signerName = cleanChunk[cleanChunk.length - 1];
    } else if (cleanChunk.length === 1) {
      result.signerTitle = cleanChunk[0];
    }
  }

  // 7. Parse Recipients
  const bodyEndLimit = recipientsIndex !== -1 ? recipientsIndex : (finalSignerIndex !== -1 ? finalSignerIndex : lines.length);

  if (recipientsIndex !== -1) {
    const recipientLimit = finalSignerIndex !== -1 && finalSignerIndex > recipientsIndex ? finalSignerIndex : lines.length;
    for (let i = recipientsIndex + 1; i < recipientLimit; i++) {
      const line = cleanStrayMotto(lines[i]);
      if (!line) continue;

      const upper = line.toUpperCase().replace(/^[-+*\s]+/, '').trim();
      // Skip if this line is actually part of signer title (like KT. GIÁM ĐỐC or PHÓ GIÁM ĐỐC)
      if (
        upper.startsWith('KT. ') ||
        upper.startsWith('TM. ') ||
        upper.startsWith('TL. ') ||
        upper.startsWith('TUQ. ') ||
        upper === 'PHÓ GIÁM ĐỐC' ||
        upper === 'GIÁM ĐỐC'
      ) {
        continue;
      }

      // Clean and expand abbreviations according to Nghị định 30/2020/NĐ-CP
      let formattedRecipient = line
        .replace(/- Giám đốc, các PGĐ Sở[\.;]?/gi, '- Giám đốc Sở, các Phó Giám đốc Sở;')
        .replace(/- Giám đốc, các PGĐ[\.;]?/gi, '- Giám đốc Sở, các Phó Giám đốc Sở;')
        .replace(/các PGĐ Sở/gi, 'các Phó Giám đốc Sở')
        .replace(/các PGĐ\b/gi, 'các Phó Giám đốc')
        .replace(/- CCT, các Phó CCT[\.;]?/gi, '- Chi cục trưởng, các Phó Chi cục trưởng;')
        .replace(/CCT, các Phó CCT/gi, 'Chi cục trưởng, các Phó Chi cục trưởng')
        .replace(/Phó CCT\b/gi, 'Phó Chi cục trưởng')
        .replace(/CCT\b/g, 'Chi cục trưởng')
        .replace(/Phòng TCCB Sở[\.;]?/gi, 'Phòng Tổ chức cán bộ Sở;')
        .replace(/Phòng TCCB\b/gi, 'Phòng Tổ chức cán bộ')
        .replace(/Trưởng phòng TCCB/gi, 'Trưởng phòng Tổ chức cán bộ')
        .replace(/Bộ Nông nghiệp và PTNT/g, 'Bộ Nông nghiệp và Phát triển nông thôn')
        .replace(/Bộ NN&PTNT/g, 'Bộ Nông nghiệp và Phát triển nông thôn')
        .replace(/Bộ NN và PTNT/g, 'Bộ Nông nghiệp và Phát triển nông thôn')
        .replace(/chế biến và PTTT/gi, 'chế biến và Phát triển thị trường')
        .replace(/Chế biến và PTTT/gi, 'Chế biến và Phát triển thị trường');

      if (!formattedRecipient.startsWith('-') && !formattedRecipient.startsWith('+') && !formattedRecipient.startsWith('*') && !formattedRecipient.toLowerCase().startsWith('lưu:')) {
        formattedRecipient = `- ${formattedRecipient}`;
      }

      // Enforce proper punctuation: ; for agencies, . for Lưu
      if (formattedRecipient.toLowerCase().startsWith('- lưu:') || formattedRecipient.toLowerCase().startsWith('lưu:')) {
        if (!formattedRecipient.endsWith('.')) {
          formattedRecipient = formattedRecipient.replace(/;+$/, '') + '.';
        }
      } else {
        if (formattedRecipient.endsWith('.')) {
          formattedRecipient = formattedRecipient.slice(0, -1) + ';';
        } else if (!formattedRecipient.endsWith(';')) {
          formattedRecipient = `${formattedRecipient};`;
        }
      }

      result.recipients.push(formattedRecipient);
    }
  }

  // 8. Body Paragraphs (Everything between legalBasesEnd and bodyEndLimit)
  const bodyStart = Math.max(legalBasesEnd, preambleEnd);
  for (let i = bodyStart; i < bodyEndLimit; i++) {
    let line = cleanStrayMotto(lines[i]);
    if (!line) continue;

    const upper = line.toUpperCase();

    // Skip stray command statements if already recorded
    if (upper === 'QUYẾT ĐỊNH:' || upper === 'QUY ĐỊNH:') {
      if (!result.commandStatement) result.commandStatement = upper;
      continue;
    }

    // Clean common abbreviations and casing in body
    line = line
      .replace(/đảm bảo an toàn thực phẩm/gi, 'bảo đảm an toàn thực phẩm')
      .replace(/Bộ Nông nghiệp và PTNT/g, 'Bộ Nông nghiệp và Phát triển nông thôn')
      .replace(/Bộ NN&PTNT/g, 'Bộ Nông nghiệp và Phát triển nông thôn')
      .replace(/chế biến và PTTT/gi, 'chế biến và Phát triển thị trường')
      .replace(/Chi Cục Chất Lượng Chế Biến/g, 'Chi cục Chất lượng, Chế biến')
      .replace(/ An Toàn Thực Phẩm/g, ' an toàn thực phẩm')
      .replace(/ Cơ Sở Sản Xuất/g, ' cơ sở sản xuất')
      .replace(/ Nông Lâm Thủy Sản/g, ' nông, lâm, thủy sản');

    result.bodyParagraphs.push(line);
  }

  return result;
}

/**
 * Creates a fully compliant Microsoft Word document according to Nghị định 30/2020/NĐ-CP
 * with EXACT margins (Left 3.0cm, Right 2.0cm, Top 2.0cm, Bottom 2.0cm), Times New Roman font,
 * and perfectly calculated two-column layout tables for Header and Signature/Recipients.
 */
export async function createNghiDinh30WordDocument(
  fixedContent: string,
  docTitle: string = 'Van_ban_chuan_ND30'
): Promise<Blob> {
  const parsed = parseAdminText(fixedContent);

  // ----------------------------------------------------
  // 1. HEADER TABLE (Bảng 2 cột: Cơ quan ban hành & Quốc hiệu/Tiêu ngữ)
  // ----------------------------------------------------
  const headerLeftParagraphs: (Paragraph | Table)[] = [];

  if (parsed.superiorAgency) {
    headerLeftParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: parsed.superiorAgency.toUpperCase(),
            font: FONT_TIMES,
            size: SIZES.SMALL, // 12pt
            bold: false,
          }),
        ],
      })
    );
  }

  headerLeftParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: (parsed.agencyName || 'CƠ QUAN BAN HÀNH').toUpperCase(),
          font: FONT_TIMES,
          size: SIZES.SMALL, // 12-13pt
          bold: true,
        }),
      ],
    })
  );

  // Short horizontal solid line under agency name (1/3 - 1/2 length)
  headerLeftParagraphs.push(createND30SolidLine('agency', 30));

  headerLeftParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: parsed.docNumber || 'Số:        /QĐ-...',
          font: FONT_TIMES,
          size: SIZES.BODY, // 13pt
        }),
      ],
    })
  );

  if (parsed.isDraft) {
    headerLeftParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: '(Dự thảo)',
            font: FONT_TIMES,
            size: SIZES.SMALL,
            italics: true,
          }),
        ],
      })
    );
  }

  const headerRightParagraphs: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
          font: FONT_TIMES,
          size: SIZES.SMALL, // 12pt in hoa đậm (đảm bảo không bao giờ bị rớt dòng chữ NAM)
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: 'Độc lập - Tự do - Hạnh phúc',
          font: FONT_TIMES,
          size: SIZES.BODY, // 13pt in thường đậm
          bold: true,
        }),
      ],
    }),
    // Solid continuous line under Tiêu ngữ (độ dài bằng 100% dòng chữ)
    createND30SolidLine('motto', 40),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: parsed.placeDate || 'Phú Thọ, ngày    tháng 8 năm 2026',
          font: FONT_TIMES,
          size: SIZES.BODY, // 13-14pt in nghiêng
          italics: true,
        }),
      ],
    }),
  ];

  const headerTable = new Table({
    width: { size: PRINTABLE_WIDTH_TWIP, type: WidthType.DXA },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: COL_LEFT_WIDTH_TWIP, type: WidthType.DXA },
            borders: NO_BORDER,
            children: headerLeftParagraphs,
          }),
          new TableCell({
            width: { size: COL_RIGHT_WIDTH_TWIP, type: WidthType.DXA },
            borders: NO_BORDER,
            children: headerRightParagraphs,
          }),
        ],
      }),
    ],
  });

  const bodyChildren: (Paragraph | Table)[] = [headerTable];

  // ----------------------------------------------------
  // 2. DOCUMENT TYPE TITLE (Tên loại văn bản: QUYẾT ĐỊNH / TỜ TRÌNH...)
  // ----------------------------------------------------
  if (parsed.docTypeTitle) {
    bodyChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 60 },
        children: [
          new TextRun({
            text: parsed.docTypeTitle.toUpperCase(),
            font: FONT_TIMES,
            size: SIZES.TITLE, // 14pt in hoa đậm
            bold: true,
          }),
        ],
      })
    );
  }

  // ----------------------------------------------------
  // 3. SUBJECT TITLE (Trích yếu nội dung)
  // ----------------------------------------------------
  if (parsed.subjectTitle) {
    bodyChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 30 },
        children: [
          new TextRun({
            text: parsed.subjectTitle,
            font: FONT_TIMES,
            size: SIZES.TITLE, // 13-14pt in đậm
            bold: true,
          }),
        ],
      }),
      // Solid continuous line under subject (1/3 - 1/2 độ dài trích yếu)
      createND30SolidLine('subject', 120)
    );
  }

  // ----------------------------------------------------
  // 4. DEAR RECIPIENT (Kính gửi: ...)
  // ----------------------------------------------------
  if (parsed.dearRecipient) {
    bodyChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        indent: { firstLine: INDENT_FIRST_LINE },
        spacing: { before: 80, after: 100 },
        children: [
          new TextRun({
            text: parsed.dearRecipient,
            font: FONT_TIMES,
            size: SIZES.BODY,
            bold: true,
          }),
        ],
      })
    );
  }

  // ----------------------------------------------------
  // 5. AUTHORITY PREAMBLE (GIÁM ĐỐC SỞ... / CHI CỤC TRƯỞNG...)
  // ----------------------------------------------------
  if (parsed.authorityPreamble) {
    bodyChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 120 },
        children: [
          new TextRun({
            text: parsed.authorityPreamble.toUpperCase(),
            font: FONT_TIMES,
            size: SIZES.BODY, // 13-14pt in hoa đậm
            bold: true,
          }),
        ],
      })
    );
  }

  // ----------------------------------------------------
  // 6. LEGAL BASES (Căn cứ ban hành - In nghiêng, kết thúc ; và .)
  // ----------------------------------------------------
  if (parsed.legalBases.length > 0) {
    parsed.legalBases.forEach((basis) => {
      bodyChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: INDENT_FIRST_LINE },
          spacing: PARAGRAPH_SPACING,
          children: [
            new TextRun({
              text: basis,
              font: FONT_TIMES,
              size: SIZES.BODY, // 13-14pt
              italics: true,
            }),
          ],
        })
      );
    });
  }

  // ----------------------------------------------------
  // 7. COMMAND STATEMENT (QUYẾT ĐỊNH:, QUY ĐỊNH:)
  // ----------------------------------------------------
  if (parsed.commandStatement) {
    bodyChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 100 },
        children: [
          new TextRun({
            text: parsed.commandStatement,
            font: FONT_TIMES,
            size: SIZES.TITLE, // 14pt in hoa đậm
            bold: true,
          }),
        ],
      })
    );
  }

  // ----------------------------------------------------
  // 8. BODY PARAGRAPHS (Điều 1, Điều 2..., Khoản, Điểm)
  // ----------------------------------------------------
  parsed.bodyParagraphs.forEach((para) => {
    const isArticle = para.startsWith('Điều ') || para.startsWith('Mục ') || para.startsWith('Phần ');
    const isBullet = para.startsWith('-') || para.startsWith('+') || para.startsWith('*');

    const runs: TextRun[] = [];

    if (isArticle) {
      const match = para.match(/^(Điều \d+\.|Mục \d+\.|Phần \d+\.)(.*)$/);
      if (match) {
        runs.push(
          new TextRun({
            text: match[1],
            font: FONT_TIMES,
            size: SIZES.BODY,
            bold: true,
          }),
          new TextRun({
            text: match[2],
            font: FONT_TIMES,
            size: SIZES.BODY,
          })
        );
      } else {
        runs.push(
          new TextRun({
            text: para,
            font: FONT_TIMES,
            size: SIZES.BODY,
            bold: true,
          })
        );
      }
    } else {
      runs.push(
        new TextRun({
          text: para,
          font: FONT_TIMES,
          size: SIZES.BODY,
        })
      );
    }

    bodyChildren.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: isBullet ? { left: convertMillimetersToTwip(8) } : { firstLine: INDENT_FIRST_LINE },
        spacing: PARAGRAPH_SPACING,
        children: runs,
      })
    );
  });

  // Spacer before footer
  bodyChildren.push(new Paragraph({ spacing: { after: 160 } }));

  // ----------------------------------------------------
  // 9. FOOTER TABLE (Bảng 2 cột: Nơi nhận bên trái & Chữ ký bên phải)
  // ----------------------------------------------------
  const recipientParagraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: 'Nơi nhận:',
          font: FONT_TIMES,
          size: SIZES.SMALL, // 12pt in nghiêng đậm
          bold: true,
          italics: true,
        }),
      ],
    }),
  ];

  if (parsed.recipients.length > 0) {
    parsed.recipients.forEach((rec) => {
      recipientParagraphs.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 10 },
          indent: { left: convertMillimetersToTwip(3) },
          children: [
            new TextRun({
              text: rec,
              font: FONT_TIMES,
              size: SIZES.CAPTION, // 11pt in thường
            }),
          ],
        })
      );
    });
  } else {
    recipientParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 10 },
        indent: { left: convertMillimetersToTwip(3) },
        children: [
          new TextRun({
            text: '- Như trên;',
            font: FONT_TIMES,
            size: SIZES.CAPTION,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 10 },
        indent: { left: convertMillimetersToTwip(3) },
        children: [
          new TextRun({
            text: '- Lưu: VT, HS (03 bản).',
            font: FONT_TIMES,
            size: SIZES.CAPTION,
          }),
        ],
      })
    );
  }

  const signerParagraphs: Paragraph[] = [];
  const titles = (parsed.signerTitle || 'KT. GIÁM ĐỐC\nPHÓ GIÁM ĐỐC').split('\n');
  titles.forEach((t) => {
    signerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: t.trim().toUpperCase(),
            font: FONT_TIMES,
            size: SIZES.BODY, // 13-14pt in hoa đậm
            bold: true,
          }),
        ],
      })
    );
  });

  signerParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: '(Chữ ký, dấu)',
          font: FONT_TIMES,
          size: SIZES.SMALL,
          italics: true,
          color: '777777',
        }),
      ],
    }),
    // 3 blank lines for signature and stamp
    new Paragraph({ spacing: { after: 360 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 20 },
      children: [
        new TextRun({
          text: parsed.signerName || 'Đặng Việt Thắng',
          font: FONT_TIMES,
          size: SIZES.TITLE, // 14pt in đậm
          bold: true,
        }),
      ],
    })
  );

  const footerTable = new Table({
    width: { size: PRINTABLE_WIDTH_TWIP, type: WidthType.DXA },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: COL_LEFT_WIDTH_TWIP, type: WidthType.DXA },
            borders: NO_BORDER,
            children: recipientParagraphs,
          }),
          new TableCell({
            width: { size: COL_RIGHT_WIDTH_TWIP, type: WidthType.DXA },
            borders: NO_BORDER,
            children: signerParagraphs,
          }),
        ],
      }),
    ],
  });

  bodyChildren.push(footerTable);

  // ----------------------------------------------------
  // BUILD COMPLETE WORD DOCUMENT
  // ----------------------------------------------------
  const doc = new Document({
    title: docTitle,
    description: 'Văn bản hành chính chuẩn hóa theo Nghị định 30/2020/NĐ-CP',
    styles: {
      default: {
        document: {
          run: {
            font: FONT_TIMES,
            size: SIZES.BODY,
            color: '000000',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: ND30_MARGINS,
          },
        },
        children: bodyChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Creates a comprehensive Word Audit & Appraisal Report (Báo cáo Thẩm định Văn bản)
 */
export async function createAuditReportWordDocument(
  auditResult: AuditResult,
  originalFileName: string
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  // Header Table
  const headerTable = new Table({
    width: { size: PRINTABLE_WIDTH_TWIP, type: WidthType.DXA },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: COL_LEFT_WIDTH_TWIP, type: WidthType.DXA },
            borders: NO_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'HỆ THỐNG THẨM ĐỊNH PHÁP LÝ',
                    font: FONT_TIMES,
                    size: SIZES.SMALL,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'DOCUGUARD AI - NGHỊ ĐỊNH 30',
                    font: FONT_TIMES,
                    size: SIZES.BODY,
                    bold: true,
                  }),
                ],
              }),
              createND30SolidLine('agency', 30),
            ],
          }),
          new TableCell({
            width: { size: COL_RIGHT_WIDTH_TWIP, type: WidthType.DXA },
            borders: NO_BORDER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                    font: FONT_TIMES,
                    size: SIZES.SMALL,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Độc lập - Tự do - Hạnh phúc',
                    font: FONT_TIMES,
                    size: SIZES.TITLE,
                    bold: true,
                  }),
                ],
              }),
              createND30SolidLine('motto', 30),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Ngày thẩm định: ${auditResult.auditDate}`,
                    font: FONT_TIMES,
                    size: SIZES.BODY,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(headerTable);
  children.push(new Paragraph({ spacing: { after: 150 } }));

  // Main Report Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({
          text: 'BÁO CÁO KẾT QUẢ THẨM ĐỊNH & RÀ SOÁT VĂN BẢN',
          font: FONT_TIMES,
          size: SIZES.TITLE,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `(Đối chiếu Nghị định 30/2020, Thông tư 17/2024, Nghị định 15/2018 & Quy định ATTP)`,
          font: FONT_TIMES,
          size: SIZES.BODY,
          italics: true,
        }),
      ],
    })
  );

  // Section 1: Overview
  children.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({
          text: 'I. THÔNG TIN CHUNG & KẾT QUẢ TỔNG QUAN',
          font: FONT_TIMES,
          size: SIZES.TITLE,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      indent: { firstLine: INDENT_FIRST_LINE },
      spacing: PARAGRAPH_SPACING,
      children: [
        new TextRun({ text: '• Tên tệp văn bản kiểm tra: ', font: FONT_TIMES, bold: true }),
        new TextRun({ text: originalFileName, font: FONT_TIMES }),
      ],
    }),
    new Paragraph({
      indent: { firstLine: INDENT_FIRST_LINE },
      spacing: PARAGRAPH_SPACING,
      children: [
        new TextRun({ text: '• Loại văn bản nhận diện: ', font: FONT_TIMES, bold: true }),
        new TextRun({ text: auditResult.documentTypeDetected, font: FONT_TIMES }),
      ],
    }),
    new Paragraph({
      indent: { firstLine: INDENT_FIRST_LINE },
      spacing: PARAGRAPH_SPACING,
      children: [
        new TextRun({ text: '• Điểm số tuân thủ: ', font: FONT_TIMES, bold: true }),
        new TextRun({ text: `${auditResult.overallScore} / 100 điểm `, font: FONT_TIMES, bold: true, color: auditResult.overallScore >= 80 ? '008000' : 'C00000' }),
        new TextRun({ text: `(${auditResult.status === 'DAT' ? 'ĐẠT CHUẨN' : auditResult.status === 'CAN_SUA_DOI' ? 'CẦN SỬA ĐỔI' : 'KHÔNG ĐẠT'})`, font: FONT_TIMES, bold: true }),
      ],
    }),
    new Paragraph({
      indent: { firstLine: INDENT_FIRST_LINE },
      spacing: PARAGRAPH_SPACING,
      children: [
        new TextRun({ text: '• Nhận xét tổng kết: ', font: FONT_TIMES, bold: true }),
        new TextRun({ text: auditResult.summary, font: FONT_TIMES, italics: true }),
      ],
    })
  );

  // Section 2: Detailed Issues List
  children.push(
    new Paragraph({
      spacing: { before: 180, after: 80 },
      children: [
        new TextRun({
          text: `II. DANH MỤC CÁC ĐIỂM CẦN SỬA ĐỔI (${auditResult.issues.length} vấn đề)`,
          font: FONT_TIMES,
          size: SIZES.TITLE,
          bold: true,
        }),
      ],
    })
  );

  auditResult.issues.forEach((issue, idx) => {
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: `${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.title}`,
            font: FONT_TIMES,
            size: SIZES.BODY,
            bold: true,
            color: issue.severity === 'error' ? 'C00000' : issue.severity === 'warning' ? 'B8860B' : '0000CD',
          }),
        ],
      }),
      new Paragraph({
        indent: { firstLine: INDENT_FIRST_LINE },
        spacing: PARAGRAPH_SPACING,
        children: [
          new TextRun({ text: '• Phân tích sai sót: ', font: FONT_TIMES, bold: true }),
          new TextRun({ text: issue.explanation, font: FONT_TIMES }),
        ],
      }),
      new Paragraph({
        indent: { firstLine: INDENT_FIRST_LINE },
        spacing: PARAGRAPH_SPACING,
        children: [
          new TextRun({ text: '• Căn cứ quy định: ', font: FONT_TIMES, bold: true }),
          new TextRun({ text: issue.legalBasis, font: FONT_TIMES, italics: true }),
        ],
      })
    );

    if (issue.currentContent) {
      children.push(
        new Paragraph({
          indent: { firstLine: INDENT_FIRST_LINE },
          spacing: PARAGRAPH_SPACING,
          children: [
            new TextRun({ text: '• Nội dung chưa đúng: ', font: FONT_TIMES, color: '888888' }),
            new TextRun({ text: `"${issue.currentContent}"`, font: FONT_TIMES, strike: true, color: 'C00000' }),
          ],
        })
      );
    }

    children.push(
      new Paragraph({
        indent: { firstLine: INDENT_FIRST_LINE },
        spacing: PARAGRAPH_SPACING,
        children: [
          new TextRun({ text: '• Phương án sửa chuẩn: ', font: FONT_TIMES, bold: true, color: '006400' }),
          new TextRun({ text: `"${issue.expectedContent}"`, font: FONT_TIMES, bold: true, color: '006400' }),
        ],
      })
    );
  });

  const doc = new Document({
    title: `Bao_cao_tham_dinh_${originalFileName}`,
    sections: [
      {
        properties: {
          page: { margin: ND30_MARGINS },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Browser helper to trigger instant download of Word document
 */
export async function downloadFixedAsWord(
  fixedContent: string,
  fileName: string = 'Van_ban_chuan_hoa_ND30.docx'
) {
  const cleanName = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
  const blob = await createNghiDinh30WordDocument(fixedContent, cleanName);
  saveAs(blob, cleanName);
}

export async function downloadAuditReportAsWord(
  auditResult: AuditResult,
  originalFileName: string = 'Bao_cao_tham_dinh.docx'
) {
  const cleanName = originalFileName.endsWith('.docx') ? originalFileName : `${originalFileName}.docx`;
  const blob = await createAuditReportWordDocument(auditResult, cleanName);
  saveAs(blob, cleanName);
}

/**
 * Downloads a ZIP package containing all fixed DOCX files and their audit reports
 */
export async function downloadAllFixedAsZip(
  items: DocumentFileItem[],
  zipFileName: string = 'Van_ban_da_chuan_hoa_ND30.zip'
) {
  const zip = new JSZip();
  const completedItems = items.filter((item) => item.auditResult?.fixedDocument);

  if (completedItems.length === 0) {
    throw new Error('Không có văn bản nào đã hoàn thành thẩm định để tải về.');
  }

  // Folder for fixed documents
  const fixedFolder = zip.folder('1_Van_Ban_Da_Chuan_Hoa_ND30');
  // Folder for audit reports
  const reportsFolder = zip.folder('2_Bao_Cao_Tham_Dinh_Chi_Tiet');

  for (let i = 0; i < completedItems.length; i++) {
    const item = completedItems[i];
    const baseName = item.name.replace(/\.[^/.]+$/, '').replace(/[/\\?%*:|"<>]/g, '_');
    const docxName = `${String(i + 1).padStart(2, '0')}_${baseName}_chuan_ND30.docx`;
    const reportName = `Bao_cao_${String(i + 1).padStart(2, '0')}_${baseName}.docx`;

    // 1. Create fixed word document
    if (fixedFolder && item.auditResult?.fixedDocument) {
      const fixedBlob = await createNghiDinh30WordDocument(
        item.auditResult.fixedDocument,
        docxName
      );
      fixedFolder.file(docxName, fixedBlob);
    }

    // 2. Create individual audit report
    if (reportsFolder && item.auditResult) {
      const reportBlob = await createAuditReportWordDocument(
        item.auditResult,
        reportName
      );
      reportsFolder.file(reportName, reportBlob);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipFileName);
}

/**
 * Creates a consolidated multi-document audit report Word document
 */
export async function downloadConsolidatedBatchReport(
  items: DocumentFileItem[],
  fileName: string = 'Bao_cao_tong_hop_tham_dinh_hang_loat.docx'
) {
  const completedItems = items.filter((item) => item.auditResult);
  if (completedItems.length === 0) {
    throw new Error('Chưa có văn bản nào hoàn thành thẩm định để xuất báo cáo tổng hợp.');
  }

  const children: (Paragraph | Table)[] = [];

  // 1. Header (Agency & Nation)
  children.push(
    new Table({
      width: { size: PRINTABLE_WIDTH_TWIP, type: WidthType.DXA },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: COL_LEFT_WIDTH_TWIP, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'HỆ THỐNG TRỢ LÝ PHÁP LÝ ATTP',
                      font: FONT_TIMES,
                      size: SIZES.SMALL,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'BỘ PHẬN THẨM ĐỊNH HÀNG LOẠT',
                      font: FONT_TIMES,
                      size: SIZES.SMALL,
                    }),
                  ],
                }),
                createND30SolidLine('agency', 30),
              ],
            }),
            new TableCell({
              width: { size: COL_RIGHT_WIDTH_TWIP, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                      font: FONT_TIMES,
                      size: SIZES.SMALL,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'Độc lập - Tự do - Hạnh phúc',
                      font: FONT_TIMES,
                      size: SIZES.BODY,
                      bold: true,
                    }),
                  ],
                }),
                createND30SolidLine('motto', 30),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'BÁO CÁO TỔNG HỢP KẾT QUẢ THẨM ĐỊNH VĂN BẢN HÀNG LOẠT',
          font: FONT_TIMES,
          size: SIZES.TITLE,
          bold: true,
          color: '003366',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `(Ngày lập báo cáo: ${new Date().toLocaleDateString('vi-VN')} - Tổng số văn bản: ${completedItems.length})`,
          font: FONT_TIMES,
          size: SIZES.BODY,
          italics: true,
        }),
      ],
      spacing: { after: 240 },
    })
  );

  // 2. Summary Table of all documents
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 600, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'STT', font: FONT_TIMES, bold: true, size: SIZES.SMALL })] })],
        }),
        new TableCell({
          width: { size: 3000, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tên tệp văn bản', font: FONT_TIMES, bold: true, size: SIZES.SMALL })] })],
        }),
        new TableCell({
          width: { size: 1600, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Loại văn bản', font: FONT_TIMES, bold: true, size: SIZES.SMALL })] })],
        }),
        new TableCell({
          width: { size: 1000, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Điểm', font: FONT_TIMES, bold: true, size: SIZES.SMALL })] })],
        }),
        new TableCell({
          width: { size: 1400, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Xếp loại', font: FONT_TIMES, bold: true, size: SIZES.SMALL })] })],
        }),
        new TableCell({
          width: { size: 1471, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tổng số lỗi', font: FONT_TIMES, bold: true, size: SIZES.SMALL })] })],
        }),
      ],
    }),
  ];

  completedItems.forEach((item, idx) => {
    const res = item.auditResult!;
    const statusText = res.status === 'DAT' ? 'ĐẠT (>=90đ)' : res.status === 'CAN_SUA_DOI' ? 'CẦN SỬA ĐỔI' : 'KHÔNG ĐẠT';
    const errCount = res.issues.filter((i) => i.severity === 'error').length;
    const warnCount = res.issues.filter((i) => i.severity === 'warning').length;

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), font: FONT_TIMES, size: SIZES.CAPTION })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: item.name, font: FONT_TIMES, bold: true, size: SIZES.CAPTION })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: res.documentTypeDetected || item.docType, font: FONT_TIMES, size: SIZES.CAPTION })] })],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${res.overallScore}/100`, font: FONT_TIMES, bold: true, size: SIZES.CAPTION })] })],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: statusText, font: FONT_TIMES, bold: true, size: SIZES.CAPTION, color: res.status === 'DAT' ? '006400' : res.status === 'CAN_SUA_DOI' ? 'B8860B' : 'C00000' })] })],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${res.issues.length} (${errCount} lỗi, ${warnCount} cảnh báo)`, font: FONT_TIMES, size: SIZES.CAPTION })] })],
          }),
        ],
      })
    );
  });

  children.push(
    new Table({
      width: { size: PRINTABLE_WIDTH_TWIP, type: WidthType.DXA },
      rows: tableRows,
    }),
    new Paragraph({ spacing: { after: 240 } })
  );

  // 3. Detailed breakdown for each document
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'CHI TIẾT SAI SÓT VÀ HƯỚNG DẪN HOÀN THIỆN TỪNG VĂN BẢN',
          font: FONT_TIMES,
          size: SIZES.BODY,
          bold: true,
          color: '003366',
        }),
      ],
      spacing: { before: 180, after: 120 },
    })
  );

  completedItems.forEach((item, docIndex) => {
    const res = item.auditResult!;
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${docIndex + 1}. Văn bản: ${item.name} (${res.documentTypeDetected || item.docType}) - Điểm: ${res.overallScore}/100`,
            font: FONT_TIMES,
            size: SIZES.BODY,
            bold: true,
            underline: {},
          }),
        ],
        spacing: { before: 140, after: 60 },
      }),
      new Paragraph({
        indent: { firstLine: INDENT_FIRST_LINE },
        children: [
          new TextRun({ text: '• Tóm tắt: ', font: FONT_TIMES, bold: true }),
          new TextRun({ text: res.summary, font: FONT_TIMES, italics: true }),
        ],
        spacing: PARAGRAPH_SPACING,
      })
    );

    if (res.issues.length === 0) {
      children.push(
        new Paragraph({
          indent: { firstLine: INDENT_FIRST_LINE },
          children: [
            new TextRun({ text: '• Đánh giá: Văn bản hoàn toàn chuẩn mực, không phát hiện lỗi.', font: FONT_TIMES, color: '006400' }),
          ],
        })
      );
    } else {
      res.issues.forEach((issue, issueIdx) => {
        children.push(
          new Paragraph({
            indent: { firstLine: INDENT_FIRST_LINE },
            children: [
              new TextRun({
                text: `${docIndex + 1}.${issueIdx + 1} [${issue.severity === 'error' ? 'LỖI' : issue.severity === 'warning' ? 'CẢNH BÁO' : 'GÓP Ý'}] ${issue.title}`,
                font: FONT_TIMES,
                bold: true,
                color: issue.severity === 'error' ? 'C00000' : issue.severity === 'warning' ? 'B8860B' : '2E8B57',
              }),
            ],
            spacing: { before: 40, after: 20 },
          }),
          new Paragraph({
            indent: { firstLine: INDENT_FIRST_LINE },
            children: [
              new TextRun({ text: '  - Căn cứ pháp lý: ', font: FONT_TIMES, bold: true }),
              new TextRun({ text: issue.legalBasis, font: FONT_TIMES, italics: true }),
            ],
          }),
          new Paragraph({
            indent: { firstLine: INDENT_FIRST_LINE },
            children: [
              new TextRun({ text: '  - Phương án sửa: ', font: FONT_TIMES, bold: true, color: '006400' }),
              new TextRun({ text: `"${issue.expectedContent}"`, font: FONT_TIMES, color: '006400' }),
            ],
          })
        );
      });
    }
  });

  const doc = new Document({
    title: 'Bao_cao_tong_hop_tham_dinh_hang_loat',
    sections: [
      {
        properties: {
          page: { margin: ND30_MARGINS },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}

/**
 * Xuất trích lục điều khoản văn bản quy phạm pháp luật sang tệp Word (.docx) chuẩn thể thức NĐ 30/2020
 */
export async function exportLegalDocToDocx(
  legalDoc: import('../types').LegalDocument,
  fileName: string = `Trich_luc_${legalDoc.code.replace(/[^a-zA-Z0-9]/g, '_')}.docx`
) {
  const children: (Paragraph | Table)[] = [];

  // Header Table (Cơ quan ban hành & Quốc hiệu tiêu ngữ)
  const headerLeftParagraphs: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: legalDoc.issuer.toUpperCase(),
          font: FONT_TIMES,
          size: SIZES.SMALL,
          bold: true,
        }),
      ],
      spacing: { before: 0, after: 30 },
    }),
    createND30SolidLine('agency', 30),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Số: ${legalDoc.code}`,
          font: FONT_TIMES,
          size: SIZES.BODY,
          bold: true,
        }),
      ],
      spacing: { before: 0, after: 60 },
    }),
  ];

  const headerRightParagraphs: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
          font: FONT_TIMES,
          size: SIZES.SMALL,
          bold: true,
        }),
      ],
      spacing: { before: 0, after: 20 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Độc lập - Tự do - Hạnh phúc',
          font: FONT_TIMES,
          size: SIZES.BODY,
          bold: true,
        }),
      ],
      spacing: { before: 0, after: 30 },
    }),
    createND30SolidLine('motto', 30),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Ban hành: ${legalDoc.issuedDate} - Hiệu lực: ${legalDoc.effectiveDate}`,
          font: FONT_TIMES,
          size: SIZES.CAPTION,
          italics: true,
        }),
      ],
      spacing: { before: 0, after: 60 },
    }),
  ];

  children.push(
    new Table({
      width: { size: PRINTABLE_WIDTH_TWIP, type: WidthType.DXA },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: COL_LEFT_WIDTH_TWIP, type: WidthType.DXA },
              borders: NO_BORDER,
              children: headerLeftParagraphs,
            }),
            new TableCell({
              width: { size: COL_RIGHT_WIDTH_TWIP, type: WidthType.DXA },
              borders: NO_BORDER,
              children: headerRightParagraphs,
            }),
          ],
        }),
      ],
    })
  );

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'TRÍCH LỤC ĐIỀU KHOẢN VĂN BẢN QUY PHẠM PHÁP LUẬT',
          font: FONT_TIMES,
          size: SIZES.TITLE,
          bold: true,
          color: '003366',
        }),
      ],
      spacing: { before: 180, after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${legalDoc.title.toUpperCase()}`,
          font: FONT_TIMES,
          size: SIZES.BODY,
          bold: true,
        }),
      ],
      spacing: { before: 40, after: 140 },
    })
  );

  // Summary box
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'I. PHẠM VI ĐIỀU CHỈNH & TÓM TẮT NỘI DUNG',
          font: FONT_TIMES,
          size: SIZES.BODY,
          bold: true,
          color: '003366',
        }),
      ],
      spacing: { before: 120, after: 60 },
    }),
    new Paragraph({
      indent: { firstLine: INDENT_FIRST_LINE },
      children: [
        new TextRun({
          text: legalDoc.summary,
          font: FONT_TIMES,
          size: SIZES.BODY,
        }),
      ],
      spacing: PARAGRAPH_SPACING,
    })
  );

  // Key Articles
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'II. CÁC ĐIỀU KHOẢN & QUY ĐỊNH TRỌNG TÂM',
          font: FONT_TIMES,
          size: SIZES.BODY,
          bold: true,
          color: '003366',
        }),
      ],
      spacing: { before: 160, after: 80 },
    })
  );

  legalDoc.keyArticles.forEach((art, index) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${art.article}: ${art.title}`,
            font: FONT_TIMES,
            size: SIZES.BODY,
            bold: true,
            color: '005500',
          }),
        ],
        spacing: { before: 100, after: 40 },
      }),
      new Paragraph({
        indent: { firstLine: INDENT_FIRST_LINE },
        children: [
          new TextRun({
            text: art.content,
            font: FONT_TIMES,
            size: SIZES.BODY,
          }),
        ],
        spacing: PARAGRAPH_SPACING,
      })
    );
  });

  // Footer metadata
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: `DocuGuard AI - Cơ sở dữ liệu pháp lý & thẩm định chuyên sâu (${new Date().toLocaleDateString('vi-VN')})`,
          font: FONT_TIMES,
          size: SIZES.CAPTION,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 240, after: 0 },
    })
  );

  const doc = new Document({
    title: legalDoc.code,
    sections: [
      {
        properties: {
          page: { margin: ND30_MARGINS },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}
