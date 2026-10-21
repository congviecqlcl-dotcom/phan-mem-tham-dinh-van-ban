import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

dotenv.config();

const app = express();
const PORT = 3000;

// Defense in depth: cap request bodies and validate expensive inputs before parsing/AI work.
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb", parameterLimit: 1000 }));

const MAX_DOCUMENT_CHARS = 250_000;
const MAX_BASE64_CHARS = 15_000_000;
const MAX_BATCH_DOCUMENTS = 5;
const MAX_CHAT_CHARS = 10_000;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function exceedsStringLimit(value: unknown, maxLength: number): boolean {
  return typeof value === "string" && value.length > maxLength;
}

function isStrictBase64(value: string): boolean {
  // Accept standard Base64 only; reject ignored/invalid characters before Buffer's permissive decoder.
  return value.length > 0 &&
    value.length % 4 === 0 &&
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value);
}

function validateDocumentText(value: unknown): string | null {
  if (value !== undefined && value !== null && typeof value !== "string") {
    return "Trường nội dung văn bản phải là chuỗi ký tự.";
  }
  if (exceedsStringLimit(value, MAX_DOCUMENT_CHARS)) {
    return `Nội dung vượt giới hạn ${MAX_DOCUMENT_CHARS.toLocaleString("vi-VN")} ký tự cho mỗi văn bản.`;
  }
  return null;
}

// Lazy initialization of Gemini Client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const LEGAL_SYSTEM_PROMPT = `
Bạn là chuyên gia pháp lý cao cấp và thanh tra viên kỳ cựu chuyên trách thẩm định, kiểm tra văn bản hành chính, hồ sơ an toàn thực phẩm (ATTP), nhãn hàng hóa và quy chuẩn ngành Nông nghiệp & PTNT Việt Nam.

Bạn hỗ trợ phân tích các văn bản pháp luật được nêu dưới đây nhưng không được giả định rằng kiến thức luôn đầy đủ hoặc còn hiệu lực. Chỉ khẳng định nội dung pháp lý khi có căn cứ kiểm chứng được; nếu không có nguồn hoặc chưa xác định được hiệu lực/phạm vi áp dụng, phải nêu rõ “CHƯA ĐỦ CĂN CỨ ĐỂ XÁC NHẬN” và yêu cầu công chức kiểm tra văn bản gốc. Danh sách dưới đây là gợi ý phạm vi, không tự nó chứng minh điều khoản còn hiệu lực hoặc áp dụng cho vụ việc:
1. Luật An toàn thực phẩm số 55/2010/QH12.
2. Nghị định số 15/2018/NĐ-CP (Quy định chi tiết thi hành Luật ATTP: thủ tục tự công bố, đăng ký bản công bố, đối tượng miễn cấp GCN theo Điều 12, kiểm tra nhập khẩu xuất khẩu, phân công quản lý Bộ Y tế / Bộ NN&PTNT / Bộ Công Thương theo Phụ lục II, III, IV).
3. Thông tư số 17/2024/TT-BNNPTNT (Hiệu lực từ 15/01/2025: Sửa đổi toàn diện Thông tư 38/2018/TT-BNNPTNT và Thông tư 48/2013/TT-BNNPTNT; bãi bỏ xếp loại A, B, C chuyển sang 2 mức "Đạt" / "Không đạt"; bãi bỏ cấp GCN kiến thức ATTP của cơ quan nhà nước chuyển cho chủ cơ sở tự xác nhận; thời hạn khắc phục sai lỗi tối đa 30 ngày; thời hạn thẩm định cơ sở 15 ngày làm việc; cập nhật Cục Chất lượng, Chế biến và Phát triển thị trường).
4. Thông tư số 38/2018/TT-BNNPTNT (Thẩm định, chứng nhận cơ sở SXKD nông lâm thủy sản - chú ý các phần đã được sửa đổi bởi TT 17/2024).
5. Thông tư số 17/2018/TT-BNNPTNT (Quản lý cơ sở không thuộc diện cấp GCN thông qua Ký Bản cam kết ATTP 3 năm/lần, kiểm tra hàng năm).
6. Thông tư số 17/2021/TT-BNNPTNT (Truy xuất nguồn gốc theo nguyên tắc 1 bước trước - 1 bước sau, thời gian lưu hồ sơ 6 tháng/2 năm/12 tháng, quy trình thu hồi 24 giờ, 4 hình thức xử lý).
7. Thông tư số 48/2013/TT-BNNPTNT (Kiểm tra, chứng nhận ATTP thủy sản xuất khẩu, danh sách ưu tiên, cấp chứng thư).
8. Nghị định số 43/2017/NĐ-CP (Nhãn hàng hóa, ngôn ngữ tiếng Việt, kích thước chữ tối thiểu 1.2mm / 0.9mm, xuất xứ, NSX/HSD).
9. Nghị định số 111/2021/NĐ-CP (Sửa đổi Nghị định 43: cách ghi xuất xứ "sản xuất tại...", không viết tắt tên nước; cách ghi phụ gia mã INS, chất tạo ngọt/tạo màu/hương liệu; nhãn phụ khi thông quan; Phụ lục I thay thế).
10. Nghị định số 181/2013/NĐ-CP (Chi tiết Luật Quảng cáo đối với TPCN, thực phẩm dinh dưỡng, thuốc, mỹ phẩm; bắt buộc ghi/đọc khuyến cáo "Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh").
11. Nghị định số 30/2020/NĐ-CP (Thể thức và kỹ thuật trình bày văn bản hành chính):
    - **QUY TẮC CẤM VIẾT TẮT TÙY TIỆN (Phụ lục I NĐ 30)**:
      + Tuyệt đối KHÔNG viết tắt chức vụ, chức danh: "PGĐ" (phải viết "Phó Giám đốc"), "GĐ" ("Giám đốc"), "PCT" ("Phó Chủ tịch"), "CT" ("Chủ tịch"), "CCT" ("Chi cục trưởng"), "TP" ("Trưởng phòng"), "PP" ("Phó Trưởng phòng"), "BGD" ("Ban Giám đốc").
      + Tuyệt đối KHÔNG viết tắt tên cơ quan trong nội dung & viện dẫn: "Bộ NN&PTNT" / "Bộ NN và PTNT" (phải viết "Bộ Nông nghiệp và Phát triển nông thôn"), "SNN&PTNT" ("Sở Nông nghiệp và Môi trường" hoặc "Sở Nông nghiệp và Phát triển nông thôn"), "PTTT" ("Chi cục Chất lượng, Chế biến và Phát triển thị trường").
      + Tuyệt đối KHÔNG viết tắt địa danh hành chính trong câu văn: "TP.HCM" ("Thành phố Hồ Chí Minh"), "HN" ("Thành phố Hà Nội"), "TX." ("thị xã"), "TP." ("thành phố"), "H." ("huyện"), "TW" ("Trung ương").
      + CHỈ ĐƯỢC PHÉP viết tắt các từ ngữ chuẩn đã quy định: TM. (Thay mặt), KT. (Ký thay), TL. (Thừa lệnh), TUQ. (Thừa ủy quyền), Q. (Quyền), UBND, HĐND, VT trong dòng lưu nơi nhận (Lưu: VT,...), TNHH, CP trong tên doanh nghiệp, và chữ viết tắt tên loại văn bản trong số ký hiệu (QĐ, TTr, TT, NĐ).
    - **QUY TẮC VIẾT HOA CHUẨN XÁC (Phụ lục II NĐ 30)**:
      + Tên cơ quan, tổ chức: Viết hoa chữ cái đầu của từ, cụm từ chỉ loại hình và chức năng (Ví dụ: "Bộ Nông nghiệp và Phát triển nông thôn", "Sở Nông nghiệp và Môi trường", "Chi cục Chất lượng, Chế biến và Phát triển thị trường", "Ủy ban nhân dân tỉnh"). KHÔNG viết hoa các liên từ nối như "và", "của", "tại", "thuộc" (Không viết "Bộ Nông Nghiệp Và Phát Triển Nông Thôn").
      + Chức vụ, chức danh: Viết hoa khi đi liền với tên cơ quan hoặc chỉ đích danh một vị trí cụ thể ("Giám đốc Sở", "Phó Giám đốc Sở", "Chi cục trưởng", "Chủ tịch Ủy ban nhân dân tỉnh", "Thủ tướng Chính phủ"). Viết thường khi nói chung chung ("các phó giám đốc", "trưởng các phòng, ban").
      + CẤM VIẾT HOA TÙY TIỆN DANH TỪ CHUNG: Không viết hoa giữa câu các danh từ chung như: "an toàn thực phẩm" (không viết "An Toàn Thực Phẩm"), "cơ sở sản xuất" (không viết "Cơ Sở Sản Xuất"), "nông, lâm, thủy sản" (không viết "Nông Lâm Thủy Sản"), "ngày cấp" (không viết "Ngày Cấp"), "hồ sơ" (không viết "Hồ Sơ"), "chuyên viên" (không viết "Chuyên Viên").
      + Viết hoa tên loại văn bản và điều khoản khi viện dẫn cụ thể: "Điều 1", "Khoản 2", "Điểm a", "Luật An toàn thực phẩm", "Nghị định số 30/2020/NĐ-CP", "Thông tư số 17/2024/TT-BNNPTNT".
      + Bố cục 2 cột: Cột trái Cơ quan ban hành, Số ký hiệu. Cột phải Quốc hiệu (in hoa đậm), Tiêu ngữ (đậm), ngày tháng (nghiêng). Trích yếu Quyết định/Tờ trình KHÔNG dùng chữ "V/v", có gạch ngang dưới trích yếu. Căn cứ in nghiêng, kết thúc bằng dấu chấm phẩy (;), căn cứ cuối bằng dấu chấm (.). Nơi nhận: từng dòng dấu chấm phẩy (;), dòng Lưu kết thúc bằng dấu chấm (.). Quyền hạn ký (KT. GIÁM ĐỐC / PHÓ GIÁM ĐỐC) nằm ở cột bên phải.
12. Nghị quyết số 202/2025/QH15 & Nghị quyết số 1676/NQ-UBTVQH15 (Sắp xếp tỉnh Phú Thọ mới gồm Vĩnh Phúc, Hòa Bình, Phú Thọ và 148 đơn vị hành chính cấp xã mới: Vĩnh An, Tiên Lữ, Hy Cương, Lâm Thao, Phùng Nguyên, Trạm Thản, Dân Chủ, Phú Mỹ...).

KHI THẨM ĐỊNH VĂN BẢN ĐƯỢC CUNG CẤP:
Hãy phân tích tỉ mỉ từng chi tiết theo 4 trục:
1. Thể thức & Kỹ thuật trình bày (Nghị định 30/2020/NĐ-CP - đặc biệt là cấm viết tắt tùy tiện theo Phụ lục I và tuân thủ quy tắc viết hoa theo Phụ lục II).
2. Căn cứ pháp lý & Hiệu lực văn bản.
3. Nội dung chuyên môn & Thẩm quyền quản lý (ATTP, Nhãn mác, Thủ tục, Thời hạn).
4. Địa giới hành chính (Nghị quyết 202/2025 & 1676/NQ-UBTVQH15).

Hãy chỉ ra vấn đề cụ thể và nêu căn cứ Điều/Khoản/Mẫu Phụ lục chỉ khi xác minh được từ nguồn có sẵn. Phân biệt rõ dữ kiện trích từ hồ sơ, suy luận, quy tắc kiểm tra cục bộ và căn cứ pháp luật. Nếu không xác minh được, ghi rõ điều chưa xác minh thay vì tự tạo viện dẫn. Có thể cung cấp bản dự thảo chỉnh sửa (fixedDocument), nhưng phải ghi rõ đây là dự thảo AI cần công chức kiểm tra; không cam kết chính xác tuyệt đối.
`;

// Helper: Local static rule checker as instant analyzer & fallback
function runLocalRuleAudit(content: string, docType?: string) {
  const issues: any[] = [];
  const lower = content.toLowerCase();

  // 1. Thể thức NĐ 30: Kiểm tra chữ "V/v" trong Quyết định / Tờ trình
  if (
    (lower.includes("quyết định") || docType === "quyet_dinh") &&
    /quyết\s*định\s*\n+v\/v/i.test(content)
  ) {
    issues.push({
      id: "err-thethuc-vv-qd",
      category: "the_thuc",
      severity: "error",
      title: "Trích yếu Quyết định sử dụng sai cụm từ 'V/v'",
      currentContent: "QUYẾT ĐỊNH\nV/v ...",
      expectedContent:
        "QUYẾT ĐỊNH\nVề việc ... (in thường, đứng, đậm, có đường kẻ ngang 1/3-1/2 phía dưới)",
      legalBasis:
        "Điểm b Khoản 5 Mục II Phần I & Mẫu 1.2 Phụ lục III Nghị định số 30/2020/NĐ-CP",
      explanation:
        "Văn bản có tên loại (như Quyết định, Nghị quyết, Tờ trình) không dùng cụm từ viết tắt 'V/v'. Chữ 'V/v' chỉ áp dụng duy nhất cho Công văn (tại ô số 5b).",
      location: "Phần Tiêu đề và Trích yếu văn bản",
    });
  }

  // 2. Viết tắt chức vụ, chức danh sai quy định (PGĐ, GĐ, PCT, CT, CCT, TP, PP, BGD)
  if (
    /\b(pgđ|gđ|pct|cct|bgd)\b/i.test(content) ||
    /các\s+pgđ/i.test(content) ||
    /phó\s+cct/i.test(content) ||
    /phòng\s+tccb/i.test(content)
  ) {
    issues.push({
      id: "err-thethuc-viet-tat-chuc-vu",
      category: "the_thuc",
      severity: "error",
      title: "Viết tắt tùy tiện chức vụ, chức danh lãnh đạo và phòng ban",
      currentContent: "PGĐ Sở, CCT, Phó CCT, Phòng TCCB...",
      expectedContent:
        "Phó Giám đốc Sở, Chi cục trưởng, Phó Chi cục trưởng, Phòng Tổ chức cán bộ...",
      legalBasis:
        "Khoản 10 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP & Quy chuẩn văn thư nhà nước",
      explanation:
        "Trong văn bản hành chính (đặc biệt là phần Nơi nhận và nội dung), nghiêm cấm viết tắt tùy tiện các chức vụ, chức danh lãnh đạo và tên phòng ban. Chỉ được phép viết tắt các từ ngữ theo quy chuẩn pháp luật như TM., KT., TL., TUQ., Q., UBND, HĐND.",
      location: "Phần Nơi nhận hoặc nội dung văn bản",
    });
  }

  // 3. Viết hoa bừa bãi tên cơ quan (viết hoa chữ Và, Của, Tại, Thuộc)
  if (
    /Bộ\s+Nông\s+Nghiệp\s+Và\s+Phát\s+Triển\s+Nông\s+Thôn/g.test(content) ||
    /Sở\s+Nông\s+Nghiệp\s+Và\s+Môi\s+Trường/g.test(content) ||
    /Ủy\s+Ban\s+Nhân\s+Dân/g.test(content) ||
    /Chi\s+Cục\s+Chất\s+Lượng\s+Chế\s+Biến\s+Và\s+Phát\s+Triển\s+Thị\s+Trường/g.test(content)
  ) {
    issues.push({
      id: "err-thethuc-viet-hoa-co-quan",
      category: "the_thuc",
      severity: "warning",
      title: "Viết hoa sai quy tắc trong tên cơ quan, tổ chức (viết hoa liên từ 'Và', 'Nhân Dân')",
      currentContent: "Bộ Nông Nghiệp Và Phát Triển Nông Thôn / Sở Nông Nghiệp Và Môi Trường...",
      expectedContent:
        "Bộ Nông nghiệp và Phát triển nông thôn / Sở Nông nghiệp và Môi trường / Ủy ban nhân dân...",
      legalBasis: "Mục II Phụ lục II Nghị định số 30/2020/NĐ-CP (Quy tắc viết hoa tên cơ quan, tổ chức)",
      explanation:
        "Theo Phụ lục II Nghị định 30, chỉ viết hoa chữ cái đầu của các từ, cụm từ chỉ loại hình cơ quan và chức năng; không viết hoa các liên từ 'và', 'của', 'tại' hoặc viết hoa từng từ đơn lẻ theo kiểu tiếng Anh.",
      location: "Tên cơ quan ban hành hoặc trong viện dẫn",
    });
  }

  // 4. Viết hoa bừa bãi danh từ chung trong câu văn
  if (
    /\b(An\s+Toàn\s+Thực\s+Phẩm|Cơ\s+Sở\s+Sản\s+Xuất|Nông\s+Lâm\s+Thủy\s+Sản|Ngày\s+Cấp:|Mặt\s+Hàng\s+Kinh\s+Doanh:|Mã\s+Doanh\s+Nghiệp:)\b/g.test(content)
  ) {
    issues.push({
      id: "err-thethuc-viet-hoa-danh-tu-chung",
      category: "the_thuc",
      severity: "suggestion",
      title: "Viết hoa tùy tiện danh từ chung giữa câu văn",
      currentContent: "An Toàn Thực Phẩm, Cơ Sở Sản Xuất, Nông Lâm Thủy Sản, Ngày Cấp...",
      expectedContent: "an toàn thực phẩm, cơ sở sản xuất, nông, lâm, thủy sản, Ngày cấp...",
      legalBasis: "Mục IV Phụ lục II Nghị định số 30/2020/NĐ-CP (Quy tắc viết hoa trong văn bản hành chính)",
      explanation:
        "Nghiêm cấm viết hoa tùy tiện các danh từ chung, thuật ngữ kỹ thuật, ngành nghề khi đứng ở giữa câu văn hành chính.",
      location: "Phần nội dung văn bản",
    });
  }

  // 5. Kiểm tra từ "đảm bảo" thay vì "bảo đảm"
  if (lower.includes("điều kiện đảm bảo an toàn thực phẩm") || /sản\s+phẩm\s+không\s+đảm\s+bảo/i.test(content)) {
    issues.push({
      id: "err-chuyenmon-bao-dam",
      category: "chuyen_mon_attp",
      severity: "warning",
      title: "Sử dụng thuật ngữ chưa chuẩn hóa ('đảm bảo' thay vì 'bảo đảm')",
      currentContent: "điều kiện đảm bảo an toàn thực phẩm",
      expectedContent: "điều kiện bảo đảm an toàn thực phẩm",
      legalBasis: "Luật An toàn thực phẩm số 55/2010/QH12 & Thông tư 17/2024/TT-BNNPTNT",
      explanation:
        "Theo chuẩn thuật ngữ pháp lý trong Luật ATTP 2010 và các Thông tư của Bộ NN&PTNT, cụm từ chuẩn quy định là 'bảo đảm an toàn thực phẩm'.",
      location: "Trích yếu hoặc nội dung văn bản",
    });
  }

  // 6. Kiểm tra viết tắt cơ quan lần đầu trong căn cứ viện dẫn
  if (
    lower.includes("bộ nông nghiệp và ptnt") ||
    lower.includes("bộ nn&ptnt") ||
    lower.includes("sở nn&ptnt") ||
    lower.includes("sở nn&mt") ||
    lower.includes("chế biến và pttt")
  ) {
    issues.push({
      id: "err-thethuc-viet-tat-can-cu",
      category: "the_thuc",
      severity: "warning",
      title: "Viết tắt tên cơ quan ban hành ngay trong lần viện dẫn đầu tiên",
      currentContent: "Bộ Nông nghiệp và PTNT / Bộ NN&PTNT / Chế biến và PTTT",
      expectedContent: "Bộ Nông nghiệp và Phát triển nông thôn / Chế biến và Phát triển thị trường",
      legalBasis: "Điểm b Khoản 6 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP",
      explanation:
        "Khi viện dẫn lần đầu văn bản có liên quan, phải ghi đầy đủ tên loại, số, ký hiệu, thời gian ban hành và tên đầy đủ của cơ quan ban hành văn bản mà không viết tắt.",
      location: "Phần Căn cứ ban hành hoặc Nơi nhận văn bản",
    });
  }

  // 7. Kiểm tra thiếu chữ "số" ở Quyết định
  if (
    /căn cứ quyết định \d+\/\d+/i.test(content) &&
    !/căn cứ quyết định số \d+\/\d+/i.test(content)
  ) {
    issues.push({
      id: "err-thethuc-thieu-chu-so",
      category: "the_thuc",
      severity: "suggestion",
      title: "Thiếu từ 'số' trong viện dẫn văn bản hành chính",
      currentContent: "Căn cứ Quyết định 09/2025/QĐ-UBND...",
      expectedContent: "Căn cứ Quyết định số 09/2025/QĐ-UBND...",
      legalBasis: "Khoản 6 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP",
      explanation:
        "Văn bản hành chính khi viện dẫn cần ghi đầy đủ chữ 'số' trước số hiệu văn bản.",
      location: "Phần Căn cứ ban hành",
    });
  }

  // 8. Kiểm tra dấu câu trong Nơi nhận
  if (
    lower.includes("nơi nhận:") &&
    (content.includes("- Giám đốc, các PGĐ Sở.") ||
      content.includes("- Giám đốc, các PGĐ Sở") ||
      content.includes("- Văn phòng Sở.") ||
      content.includes("- Phòng TCCB Sở."))
  ) {
    issues.push({
      id: "err-thethuc-dau-cau-noi-nhan",
      category: "the_thuc",
      severity: "warning",
      title: "Dấu câu kết thúc từng dòng nơi nhận chưa chuẩn",
      currentContent: "- Giám đốc, các PGĐ Sở.",
      expectedContent: "- Giám đốc Sở, các Phó Giám đốc Sở;",
      legalBasis: "Điểm d Khoản 9 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP",
      explanation:
        "Trong phần Nơi nhận, cuối mỗi dòng của cơ quan nhận văn bản phải là dấu chấm phẩy (;), chỉ có dòng cuối cùng 'Lưu: VT...' mới kết thúc bằng dấu chấm (.).",
      location: "Phần Nơi nhận (ô số 9b)",
    });
  }

  // 9. Kiểm tra mục Lưu văn bản
  if (
    lower.includes("lưu: vt, hồ sơ.") ||
    lower.includes("lưu: vt, cbpttt.")
  ) {
    issues.push({
      id: "err-thethuc-muc-luu",
      category: "the_thuc",
      severity: "suggestion",
      title: "Mục lưu văn bản chưa ghi số lượng bản lưu hoặc sai ký hiệu đơn vị",
      currentContent: "Lưu: VT, hồ sơ. (hoặc ký hiệu chưa khớp số văn bản)",
      expectedContent: "Lưu: VT, [Ký hiệu phòng/đơn vị soạn thảo] (02 bản).",
      legalBasis: "Điểm d Khoản 9 Mục II Phần I Phụ lục I Nghị định số 30/2020/NĐ-CP",
      explanation:
        "Dòng lưu gồm chữ 'Lưu: VT', dấu phẩy, chữ viết tắt tên đơn vị soạn thảo và số lượng bản lưu (ví dụ: Lưu: VT, CLCB, 03 bản.).",
      location: "Dòng cuối cùng của Nơi nhận",
    });
  }

  // 10. Kiểm tra thông tư hết hiệu lực hoặc cập nhật TT 17/2024
  if (
    lower.includes("thông tư số 51/2014") ||
    lower.includes("thông tư số 45/2014") ||
    lower.includes("thông tư số 32/2022")
  ) {
    issues.push({
      id: "err-hieu-luc-van-ban",
      category: "can_cu_phap_ly",
      severity: "error",
      title: "Viện dẫn văn bản đã hết hiệu lực thi hành",
      currentContent: "Thông tư 51/2014 / 45/2014 / 32/2022/TT-BNNPTNT",
      expectedContent: "Thông tư số 17/2024/TT-BNNPTNT hoặc Thông tư số 17/2018/TT-BNNPTNT",
      legalBasis: "Điều 12 TT 17/2018/TT-BNNPTNT & Điều 3 TT 17/2024/TT-BNNPTNT",
      explanation:
        "Các văn bản trên đã bị bãi bỏ/thay thế bởi Thông tư số 17/2018/TT-BNNPTNT, Thông tư số 38/2018/TT-BNNPTNT và Thông tư số 17/2024/TT-BNNPTNT.",
      location: "Phần Căn cứ ban hành",
    });
  }

  // 11. Nhãn thực phẩm chức năng thiếu cảnh báo bắt buộc
  if (
    (lower.includes("thực phẩm bảo vệ sức khỏe") ||
      lower.includes("glucosamine") ||
      docType === "nhan_hang_hoa") &&
    !lower.includes("không phải là thuốc") &&
    (lower.includes("viên") || lower.includes("bổ") || lower.includes("uống"))
  ) {
    issues.push({
      id: "err-nhan-canh-bao-tpcn",
      category: "nhan_quang_cao",
      severity: "error",
      title: "Nhãn thực phẩm bảo vệ sức khỏe thiếu dòng cảnh báo bắt buộc",
      currentContent: "Không có dòng chữ khuyến cáo theo luật",
      expectedContent:
        'Cụm từ: "Thực phẩm bảo vệ sức khỏe" và dòng khuyến cáo: "Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh"',
      legalBasis:
        "Khoản 2 Điều 44 Luật ATTP, Điểm a Khoản 3 Điều 18 NĐ 15/2018/NĐ-CP & Mục 3 Phụ lục I NĐ 111/2021/NĐ-CP",
      explanation:
        "Mọi nhãn và quảng cáo thực phẩm bảo vệ sức khỏe bắt buộc phải có dòng chữ khuyến cáo rõ ràng, tương phản màu nền.",
      location: "Nội dung bắt buộc ghi nhãn",
    });
  }

  // 12. Quảng cáo TPCN gây hiểu nhầm là thuốc
  if (
    lower.includes("trị dứt điểm") ||
    lower.includes("chữa khỏi hoàn toàn") ||
    lower.includes("thay thế thuốc")
  ) {
    issues.push({
      id: "err-quang-cao-tri-benh",
      category: "nhan_quang_cao",
      severity: "error",
      title: "Nội dung quảng cáo / công dụng gây hiểu nhầm thực phẩm là thuốc chữa bệnh",
      currentContent: "Trị dứt điểm, thay thế thuốc chữa bệnh...",
      expectedContent: "Hỗ trợ giảm triệu chứng, hỗ trợ tăng cường chức năng...",
      legalBasis:
        "Khoản 4 Điều 5 Nghị định số 181/2013/NĐ-CP & Khoản 11 Điều 5 Luật ATTP số 55/2010/QH12",
      explanation:
        "Nghiêm cấm quảng cáo, ghi nhãn thực phẩm gây hiểu nhầm là thuốc chữa bệnh hoặc có tác dụng điều trị bệnh dứt điểm.",
      location: "Phần Công dụng / Tác dụng",
    });
  }

  // Legacy compatibility field only; this is not a legal or statistical score.
  const overallScore = 0;
  // A heuristic score must never be converted into a legal pass/fail status.
  // Every automated result remains pending verification by a competent human.
  const status = "CAN_XAC_MINH";

  // Safety: preserve source content; do not silently rewrite legal documents with broad regex rules.
  const fixedDoc = content;

  return {
    overallScore,
    source: "local_rule",
    sourceNotice: "Kết quả từ bộ quy tắc cục bộ theo mẫu đã lập trình; chưa phải tra cứu pháp luật trực tiếp và không chứng minh tuân thủ đầy đủ.",
    status,
    documentTypeDetected:
      docType ||
      (lower.includes("tờ trình")
        ? "Tờ trình"
        : lower.includes("quyết định")
        ? "Quyết định"
        : lower.includes("tự công bố")
        ? "Bản tự công bố"
        : "Văn bản hành chính"),
    summary:
      issues.length === 0
        ? "Bộ quy tắc cục bộ chưa phát hiện dấu hiệu thuộc các mẫu đã lập trình. Điều này không chứng minh văn bản tuân thủ đầy đủ pháp luật hoặc không có sai sót."
        : `Bộ quy tắc cục bộ ghi nhận ${issues.length} dấu hiệu cần rà soát (${issues.filter((i: any) => i.severity === "error").length} mức cao, ${issues.filter((i: any) => i.severity === "warning").length} cảnh báo). Cần đối chiếu từng dấu hiệu với văn bản gốc và căn cứ hiện hành trước khi kết luận.`,
    positivePoints: [
      "Đây là kết quả sàng lọc theo các mẫu quy tắc được lập trình; chưa xác minh đầy đủ hiệu lực và phạm vi áp dụng của mọi căn cứ pháp lý.",
      "Không phát hiện dấu hiệu theo mẫu không đồng nghĩa với xác nhận địa giới hành chính hoặc nội dung pháp lý là chính xác.",
      "Công chức cần kiểm tra hồ sơ gốc, thẩm quyền, căn cứ pháp lý và mọi đề xuất trước khi sử dụng.",
    ],
    issues,
    categoryScores: {
      the_thuc: {
        name: "Thể thức văn bản (Nghị định 30/2020)",
        totalIssues: issues.filter((i: any) => i.category === "the_thuc").length,
        severityBreakdown: {
          error: issues.filter((i: any) => i.category === "the_thuc" && i.severity === "error").length,
          warning: issues.filter((i: any) => i.category === "the_thuc" && i.severity === "warning").length,
          suggestion: issues.filter((i: any) => i.category === "the_thuc" && i.severity === "suggestion").length,
        },
      },
      can_cu_phap_ly: {
        name: "Căn cứ pháp lý & Hiệu lực",
        totalIssues: issues.filter((i: any) => i.category === "can_cu_phap_ly").length,
        severityBreakdown: {
          error: issues.filter((i: any) => i.category === "can_cu_phap_ly" && i.severity === "error").length,
          warning: issues.filter((i: any) => i.category === "can_cu_phap_ly" && i.severity === "warning").length,
          suggestion: issues.filter((i: any) => i.category === "can_cu_phap_ly" && i.severity === "suggestion").length,
        },
      },
      chuyen_mon_attp: {
        name: "Chuyên môn ATTP & Quy trình",
        totalIssues: issues.filter((i: any) => i.category === "chuyen_mon_attp").length,
        severityBreakdown: {
          error: issues.filter((i: any) => i.category === "chuyen_mon_attp" && i.severity === "error").length,
          warning: issues.filter((i: any) => i.category === "chuyen_mon_attp" && i.severity === "warning").length,
          suggestion: issues.filter((i: any) => i.category === "chuyen_mon_attp" && i.severity === "suggestion").length,
        },
      },
      nhan_quang_cao: {
        name: "Ghi nhãn & Quảng cáo",
        totalIssues: issues.filter((i: any) => i.category === "nhan_quang_cao").length,
        severityBreakdown: {
          error: issues.filter((i: any) => i.category === "nhan_quang_cao" && i.severity === "error").length,
          warning: issues.filter((i: any) => i.category === "nhan_quang_cao" && i.severity === "warning").length,
          suggestion: issues.filter((i: any) => i.category === "nhan_quang_cao" && i.severity === "suggestion").length,
        },
      },
      dia_gioi_hanh_chinh: {
        name: "Địa giới hành chính 2025-2026",
        totalIssues: 0,
        severityBreakdown: { error: 0, warning: 0, suggestion: 0 },
      },
    },
    fixedDocument: fixedDoc,
    auditDate: new Date().toLocaleDateString("vi-VN"),
  };
}

// API: Universal Document Parser (/api/parse-document)
app.post("/api/parse-document", async (req, res) => {
  try {
    const { fileName, base64Data, mimeType } = req.body ?? {};
    if (!isNonEmptyString(base64Data)) {
      return res.status(400).json({ error: "Chưa nhận được dữ liệu tệp văn bản hợp lệ." });
    }
    if (base64Data.length > MAX_BASE64_CHARS) {
      return res.status(413).json({ error: "Tệp vượt giới hạn xử lý. Hãy dùng tệp nhỏ hơn 15 MB trước khi mã hóa." });
    }

    const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, "");
    if (!isStrictBase64(cleanBase64)) {
      return res.status(400).json({ error: "Dữ liệu tệp mã hóa không hợp lệ. Hãy tải lại tệp gốc và thử lại." });
    }
    const buffer = Buffer.from(cleanBase64, "base64");
    if (buffer.length === 0 || buffer.length > 11_250_000) {
      return res.status(413).json({ error: "Kích thước tệp sau giải mã không hợp lệ hoặc vượt giới hạn xử lý." });
    }
    const lowerName = typeof fileName === "string" ? fileName.toLowerCase() : "";
    const hasExtension = /\.[a-z0-9]+$/i.test(lowerName);
    const mime = typeof mimeType === "string" ? mimeType.toLowerCase().split(";")[0].trim() : "";
    // A supplied filename extension takes precedence over the client-supplied MIME type.
    // MIME is only a fallback when no extension is present, since it is untrusted input.
    const isPdf = hasExtension ? lowerName.endsWith(".pdf") : mime === "application/pdf";
    const isDocx = hasExtension
      ? lowerName.endsWith(".docx")
      : mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const isPlainText = hasExtension
      ? /\.(txt|md|csv|log)$/i.test(lowerName)
      : ["text/plain", "text/markdown", "text/csv"].includes(mime);

    // Never decode legacy binary Word or RTF files as UTF-8: that can produce
    // garbage text which looks like extracted content. Only handle formats with
    // an explicit parser or a plain-text representation.
    if (!isPdf && !isDocx && !isPlainText) {
      return res.status(415).json({
        error: "Định dạng tệp chưa được hỗ trợ. Hiện hỗ trợ PDF, DOCX và tệp văn bản thuần TXT/MD/CSV/LOG; hãy chuyển DOC/RTF sang DOCX hoặc PDF trước khi tải lên.",
      });
    }

    let extractedText = "";

    if (isPdf) {
      try {
        const parser = new PDFParse({ data: buffer });
        const textResult = await parser.getText();
        extractedText = textResult?.text || "";
        await parser.destroy().catch(() => {});
      } catch (pdfErr: any) {
        console.warn("Lỗi đọc PDF:", pdfErr);
      }
    } else if (isDocx) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || "";
      } catch (docxErr: any) {
        console.warn("Lỗi đọc DOCX:", docxErr);
      }
    } else if (isPlainText) {
      // Decode only formats explicitly identified as plain text.
      extractedText = buffer.toString("utf-8");
      if (extractedText.includes("\u0000")) {
        extractedText = extractedText.replace(/\u0000/g, "");
      }
    }

    extractedText = (extractedText || "").trim();
    if (!extractedText) {
      return res.status(422).json({
        error: "Không trích xuất được văn bản từ tệp. Tệp có thể là bản quét ảnh, bị hỏng hoặc không chứa lớp văn bản; hãy kiểm tra tệp hoặc cung cấp bản có thể tìm kiếm văn bản.",
      });
    }

    // Auto-detect Document Type from extracted text
    let detectedType = "khac";
    const lowerText = extractedText.toLowerCase();
    if (lowerText.includes("tờ trình") || lowerName.includes("to_trinh") || lowerName.includes("totrinh")) {
      detectedType = "to_trinh";
    } else if (lowerText.includes("quyết định") || lowerName.includes("quyet_dinh") || lowerName.includes("quyetdinh")) {
      detectedType = "quyet_dinh";
    } else if (lowerText.includes("công văn") || lowerText.includes("kính gửi:") || lowerName.includes("cong_van") || lowerName.includes("congvan")) {
      detectedType = "cong_van";
    } else if (lowerText.includes("biên bản") || lowerName.includes("bien_ban") || lowerName.includes("bienban")) {
      detectedType = "bien_ban";
    } else if (lowerText.includes("bản tự công bố") || lowerName.includes("tu_cong_bo")) {
      detectedType = "tu_cong_bo";
    } else if (lowerText.includes("thực phẩm bảo vệ sức khỏe") || lowerText.includes("thành phần:") || lowerText.includes("khối lượng tịnh") || lowerName.includes("nhan")) {
      detectedType = "nhan_hang_hoa";
    } else if (lowerText.includes("bản cam kết") || lowerName.includes("cam_ket")) {
      detectedType = "ban_cam_ket";
    }

    return res.json({
      success: true,
      text: extractedText,
      fileName,
      charCount: extractedText.length,
      detectedType,
    });
  } catch (err: any) {
    console.error("Lỗi parse document:", err);
    return res.status(500).json({ error: "Không thể trích xuất văn bản do lỗi xử lý tệp. Hãy kiểm tra định dạng tệp hoặc thử lại với tệp hợp lệ." });
  }
});

// Core audit helper
async function performSingleAudit(params: {
  content?: string;
  docType?: string;
  fileName?: string;
  fileData?: string;
  mimeType?: string;
}) {
  const { content, docType, fileName, fileData, mimeType } = params;
  const ai = getAI();

  if (ai && content && content.length > 20) {
    // List of models to try in priority order
    const modelsToTry = ["gemini-3.7-flash", "gemini-3.1-flash-lite"];

    for (const modelName of modelsToTry) {
      try {
        const promptText = `
Hãy rà soát sơ bộ văn bản dưới đây theo các nhóm vấn đề pháp lý có liên quan. Danh sách văn bản tham chiếu bên dưới chỉ gợi ý phạm vi cần xem xét; văn bản gốc chưa được cung cấp trong yêu cầu này, vì vậy không được tuyên bố đã đối chiếu trực tiếp, xác minh hiệu lực hoặc xác nhận điều khoản nếu không có căn cứ kiểm chứng được. Mọi viện dẫn chưa kiểm chứng phải được ghi rõ là cần công chức đối chiếu với nguồn chính thức hiện hành.

Loại văn bản: ${docType || "Tự động nhận diện"}
Tên tệp: ${fileName || "Văn bản người dùng"}

NỘI DUNG VĂN BẢN:
\`\`\`
${content || ""}
\`\`\`

YÊU CẦU ĐÁNH GIÁ:
1. Đánh giá tính chính xác về Thể thức & Kỹ thuật trình bày theo Nghị định 30/2020/NĐ-CP (Quốc hiệu, Tiêu ngữ, Tên cơ quan, Số & Ký hiệu, Trích yếu có bị lỗi 'V/v' không, đường kẻ ngang dưới trích yếu, căn cứ in nghiêng và dấu chấm phẩy, quyền hạn ký TM./KT./Q./TL./TUQ., họ tên đứng đậm, nơi nhận dấu chấm phẩy và dòng Lưu, TUYỆT ĐỐI KHÔNG VIẾT TẮT PGĐ, GĐ, PCT, CT, CCT, TP, TCCB, PTTT theo Phụ lục I, TUÂN THỦ quy tắc viết hoa Phụ lục II).
2. Kiểm tra Căn cứ pháp lý & Hiệu lực (Thông tư 17/2024 có hiệu lực 15/01/2025 đã bỏ phân loại A/B/C sang Đạt/Không đạt, bãi bỏ GCN kiến thức ATTP chuyển chủ cơ sở tự xác nhận, thời hạn khắc phục 30 ngày, các văn bản hết hiệu lực như TT 51/2014, TT 45/2014, TT 32/2022...).
3. Kiểm tra Chuyên môn ATTP, Thẩm quyền quản lý, Ghi nhãn hàng hóa (NĐ 111/2021), Quảng cáo (NĐ 181/2013).
4. Kiểm tra Địa giới hành chính theo Nghị quyết 202/2025/QH15 & Nghị quyết 1676/NQ-UBTVQH15 (xã Vĩnh An, Tiên Lữ, Hy Cương, Lâm Thao... tỉnh Phú Thọ mới).
5. Không tự viết lại toàn văn trong trường fixedDocument. Máy chủ sẽ giữ nguyên nội dung đầu vào cho đến khi có quy trình so sánh từng thay đổi và người dùng duyệt rõ ràng. Chỉ nêu từng dấu hiệu cần rà soát trong issues; không tuyên bố đã sửa đúng hoặc tuân thủ đầy đủ.
`;

        const parts: any[] = [];
        if (fileData && mimeType) {
          parts.push({
            inlineData: {
              data: fileData,
              mimeType: mimeType,
            },
          });
        }
        parts.push({ text: promptText });

        const response = await ai.models.generateContent({
          model: modelName,
          contents: parts,
          config: {
            systemInstruction: LEGAL_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallScore: { type: Type.NUMBER, description: "Trường tương thích API cũ; máy chủ ghi đè bằng 0. Không phải điểm tuân thủ." },
                status: {
                  type: Type.STRING,
                  enum: ["CAN_XAC_MINH"],
                  description: "Trạng thái bắt buộc: CAN_XAC_MINH. Kết quả AI không kết luận đạt/không đạt; công chức phải xác minh từng phát hiện với hồ sơ gốc và nguồn pháp luật hiện hành.",
                },
                documentTypeDetected: { type: Type.STRING },
                summary: { type: Type.STRING, description: "Tóm tắt kết luận thẩm định súc tích" },
                positivePoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Các điểm làm tốt và đúng quy định",
                },
                issues: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        enum: ["the_thuc", "can_cu_phap_ly", "chuyen_mon_attp", "nhan_quang_cao", "dia_gioi_hanh_chinh"],
                      },
                      severity: {
                        type: Type.STRING,
                        enum: ["error", "warning", "suggestion"],
                      },
                      title: { type: Type.STRING },
                      currentContent: { type: Type.STRING },
                      expectedContent: { type: Type.STRING },
                      legalBasis: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      location: { type: Type.STRING },
                    },
                    required: ["id", "category", "severity", "title", "expectedContent", "legalBasis", "explanation"],
                  },
                },
                fixedDocument: {
                  type: Type.STRING,
                  description: "Bản dự thảo chỉnh sửa do AI đề xuất; phải được công chức kiểm tra căn cứ pháp lý và nội dung trước khi sử dụng.",
                },
              },
              required: ["status", "documentTypeDetected", "summary", "positivePoints", "issues", "fixedDocument"],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          const categoryScores: Record<string, any> = {
            the_thuc: { name: "Thể thức văn bản (Nghị định 30/2020)", totalIssues: 0, severityBreakdown: { error: 0, warning: 0, suggestion: 0 } },
            can_cu_phap_ly: { name: "Căn cứ pháp lý & Hiệu lực", totalIssues: 0, severityBreakdown: { error: 0, warning: 0, suggestion: 0 } },
            chuyen_mon_attp: { name: "Chuyên môn ATTP & Quy trình", totalIssues: 0, severityBreakdown: { error: 0, warning: 0, suggestion: 0 } },
            nhan_quang_cao: { name: "Ghi nhãn & Quảng cáo", totalIssues: 0, severityBreakdown: { error: 0, warning: 0, suggestion: 0 } },
            dia_gioi_hanh_chinh: { name: "Địa giới hành chính 2025-2026", totalIssues: 0, severityBreakdown: { error: 0, warning: 0, suggestion: 0 } },
          };

          parsed.issues?.forEach((issue: any) => {
            const cat = categoryScores[issue.category];
            if (cat) {
              cat.totalIssues += 1;
              if (issue.severity === "error") {
                cat.severityBreakdown.error += 1;
              } else if (issue.severity === "warning") {
                cat.severityBreakdown.warning += 1;
              } else {
                cat.severityBreakdown.suggestion += 1;
              }
            }
          });

          return {
            ...parsed,
            overallScore: 0, // Legacy API compatibility only; never use as a compliance score.
            // Safety: do not export model-rewritten legal text as if it were a reviewed correction.
            // Until a human-reviewed diff workflow exists, preserve the exact submitted content.
            fixedDocument: content || "",
            categoryScores,
            source: "gemini",
            sourceNotice: "Kết quả do Gemini tạo; cần kiểm tra từng phát hiện với hồ sơ gốc và văn bản pháp luật hiện hành.",
            auditDate: new Date().toLocaleDateString("vi-VN"),
          };
        }
      } catch (geminiError: any) {
        // Suppress expected quota / permission warnings and gracefully try next model or fallback
        const isQuotaOrAccess =
          geminiError?.status === "RESOURCE_EXHAUSTED" ||
          geminiError?.status === "PERMISSION_DENIED" ||
          geminiError?.message?.includes("quota") ||
          geminiError?.message?.includes("denied");

        if (!isQuotaOrAccess) {
          console.log(`[Audit fallback] Model ${modelName} unavailable, checking next options.`);
        }
      }
    }
  }

  return runLocalRuleAudit(content || "", docType);
}

// API: Document Audit Endpoint
app.post("/api/audit-document", async (req, res) => {
  try {
    const { content, docType, fileName, fileData, mimeType } = req.body ?? {};

    if (!content && !fileData) {
      return res.status(400).json({ error: "Không tìm thấy nội dung văn bản để thẩm định." });
    }
    const contentError = validateDocumentText(content);
    if (contentError) return res.status(413).json({ error: contentError });
    // This endpoint returns a text-based audit result. Do not silently report an
    // empty local-rule analysis when a caller sends only an attachment payload.
    if (!isNonEmptyString(content)) {
      return res.status(400).json({
        error: "Chưa có nội dung văn bản đã trích xuất để thẩm định. Hãy trích xuất văn bản từ tệp trước khi gửi yêu cầu.",
      });
    }
    if (fileData !== undefined && fileData !== null && typeof fileData !== "string") {
      return res.status(400).json({ error: "Dữ liệu tệp đính kèm không hợp lệ." });
    }
    if (exceedsStringLimit(fileData, MAX_BASE64_CHARS)) {
      return res.status(413).json({ error: "Tệp vượt giới hạn xử lý. Hãy dùng tệp nhỏ hơn 15 MB trước khi mã hóa." });
    }

    const result = await performSingleAudit({ content, docType, fileName, fileData, mimeType });
    return res.json(result);
  } catch (error: any) {
    console.error("Lỗi API thẩm định văn bản.");
    return res.status(503).json({ error: "Không thể hoàn tất lượt thẩm định do lỗi hệ thống. Vui lòng thử lại sau." });
  }
});

// API: Batch Audit Endpoint (Thẩm định đồng thời nhiều văn bản)
app.post("/api/batch-audit-documents", async (req, res) => {
  try {
    const { documents } = req.body ?? {};
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: "Danh sách văn bản cần thẩm định không hợp lệ." });
    }
    if (documents.length > MAX_BATCH_DOCUMENTS) {
      return res.status(413).json({ error: `Mỗi lượt chỉ xử lý tối đa ${MAX_BATCH_DOCUMENTS} văn bản để kiểm soát tài nguyên.` });
    }
    for (let index = 0; index < documents.length; index += 1) {
      const item = documents[index];
      if (!item || typeof item !== "object") {
        return res.status(400).json({ error: `Văn bản thứ ${index + 1} không hợp lệ.` });
      }
      if (!isNonEmptyString(item.content)) {
        return res.status(400).json({
          error: `Văn bản thứ ${index + 1} chưa có nội dung văn bản đã trích xuất để thẩm định.`,
        });
      }
      const contentError = validateDocumentText(item.content);
      if (contentError) return res.status(413).json({ error: `Văn bản thứ ${index + 1}: ${contentError}` });
    }

    // Process documents with graceful fallback
    const results = await Promise.all(
      documents.map(async (docItem: any) => {
        try {
          const audit = await performSingleAudit({
            content: docItem.content,
            docType: docItem.docType,
            fileName: docItem.name || docItem.fileName,
          });
          return {
            id: docItem.id,
            name: docItem.name || docItem.fileName,
            success: true,
            auditResult: audit,
          };
        } catch (itemErr: any) {
          const fallback = runLocalRuleAudit(docItem.content || "", docItem.docType);
          return {
            id: docItem.id,
            name: docItem.name || docItem.fileName,
            success: true,
            auditResult: fallback,
          };
        }
      })
    );

    return res.json({
      success: true,
      total: results.length,
      results,
    });
  } catch (err: any) {
    // Do not expose internal exception details to API clients.
    console.error("Lỗi API thẩm định hàng loạt.");
    return res.status(503).json({ error: "Không thể hoàn tất lượt thẩm định hàng loạt do lỗi hệ thống. Vui lòng thử lại sau." });
  }
});

// Helper: Intelligent Legal Q&A Knowledge Engine
function getIntelligentLegalAnswer(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("17/2024") || (q.includes("thông tư 17") && q.includes("2024")) || q.includes("xếp loại") || q.includes("hạng a") || q.includes("hạng b") || q.includes("hạng c")) {
    return `### 📜 Các điểm sửa đổi cốt lõi của Thông tư số 17/2024/TT-BNNPTNT (Hiệu lực từ 15/01/2025):

Thông tư số 17/2024/TT-BNNPTNT sửa đổi, bổ sung toàn diện Thông tư số 38/2018/TT-BNNPTNT và Thông tư số 48/2013/TT-BNNPTNT với các cải cách lớn:

1. **Bãi bỏ phân hạng A, B, C**:
   - Chuyển sang chỉ còn **02 mức xếp loại: "Đạt" hoặc "Không đạt"** (Khoản 9 Điều 1 sửa đổi Điều 8 TT 38).
   - Cơ sở xếp loại "Đạt" được cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP có thời hạn hiệu lực **03 năm**.

2. **Chủ cơ sở tự xác nhận kiến thức ATTP**:
   - Bãi bỏ thủ tục cơ quan nhà nước tổ chức thi và cấp Giấy xác nhận kiến thức ATTP.
   - Chủ cơ sở tự tổ chức tập huấn hoặc cử nhân viên tham gia tập huấn kiến thức ATTP và **tự lập, ký Giấy xác nhận tập huấn kiến thức ATTP** cho người trực tiếp SXKD.

3. **Rút ngắn thời hạn khắc phục sai lỗi**:
   - Thời hạn tối đa để cơ sở khắc phục các điểm không phù hợp (lỗi) được rút ngắn còn **tối đa không quá 30 ngày** (trước đây là 60 ngày).

4. **Thời hạn thẩm định thực tế**:
   - Cơ quan có thẩm quyền tổ chức đoàn thẩm định thực tế tại cơ sở trong thời hạn **15 ngày làm việc** kể từ ngày nhận đủ hồ sơ hợp lệ.

5. **Cập nhật cơ quan Trung ương**:
   - Thay đổi tên gọi và thẩm quyền từ Cục Quản lý Chất lượng Nông lâm sản và Thủy sản thành **Cục Chất lượng, Chế biến và Phát triển thị trường**.`;
  }

  if (q.includes("miễn") || q.includes("điều 12") || q.includes("không thuộc diện cấp")) {
    return `### 📋 10 nhóm cơ sở được MIỄN cấp Giấy chứng nhận ATTP theo Điều 12 Nghị định số 15/2018/NĐ-CP:

1. **Sản xuất ban đầu nhỏ lẻ** (trồng trọt, chăn nuôi, đánh bắt quy mô hộ gia đình, cá nhân).
2. **Sản xuất, kinh doanh thực phẩm không có địa điểm cố định**.
3. **Sơ chế nhỏ lẻ**.
4. **Kinh doanh thực phẩm nhỏ lẻ** (hộ gia đình, cá nhân kinh doanh không thuộc diện đăng ký kinh doanh).
5. **Kinh doanh thực phẩm bao gói sẵn** (chỉ bán hàng đã đóng gói kín nguyên đai nguyên kiện).
6. **Sản xuất, kinh doanh dụng cụ, vật liệu bao gói, chứa đựng thực phẩm**.
7. **Nhà hàng trong khách sạn**.
8. **Bếp ăn tập thể** không có đăng ký ngành nghề kinh doanh thực phẩm.
9. **Kinh doanh thức ăn đường phố**.
10. **Cơ sở đã được cấp một trong các Giấy chứng nhận thực hành tốt còn hiệu lực**:
    - **GMP** (Thực hành sản xuất tốt);
    - **HACCP** (Hệ thống phân tích mối nguy và điểm kiểm soát tới hạn);
    - **ISO 22000** (Hệ thống quản lý ATTP);
    - **IFS** (Tiêu chuẩn thực phẩm quốc tế);
    - **BRC** (Tiêu chuẩn toàn cầu về an toàn thực phẩm);
    - **FSSC 22000** hoặc tương đương.

*(Lưu ý: Các cơ sở nông lâm thủy sản thuộc đối tượng 1, 2, 3, 4, 9 thực hiện ký Bản cam kết sản xuất kinh doanh thực phẩm an toàn theo Thông tư số 17/2018/TT-BNNPTNT)*.`;
  }

  if (q.includes("nghị định 30") || q.includes("30/2020") || q.includes("thể thức") || q.includes("trích yếu") || q.includes("v/v") || q.includes("dấu câu")) {
    return `### 📐 Quy định cốt lõi về Thể thức & Kỹ thuật trình bày văn bản theo Nghị định 30/2020/NĐ-CP:

1. **Quy tắc Trích yếu văn bản (Mục II Phần I Phụ lục I)**:
   - **Văn bản có tên loại** (Quyết định, Tờ trình, Kế hoạch, Thông báo...): Ghi tên loại in hoa đứng đậm, trích yếu in thường đứng đậm ngay phía dưới (bắt đầu bằng *"Về việc..."*). **TUYỆT ĐỐI KHÔNG DÙNG CHỮ VIẾT TẮT "V/v"**.
   - **Công văn**: Trích yếu đặt tại ô 5b, in thường đứng, bắt đầu bằng cụm từ **"V/v"**.
   - **Đường kẻ ngang**: Dưới trích yếu có đường kẻ nét liền mảnh, độ dài bằng **1/3 đến 1/2** độ dài của dòng chữ và đặt cân đối ở giữa.

2. **Quy tắc Căn cứ ban hành**:
   - Trình bày bằng chữ in thường, kiểu chữ nghiêng.
   - Cuối mỗi căn cứ kết thúc bằng **dấu chấm phẩy (;)**, riêng căn cứ cuối cùng kết thúc bằng **dấu chấm (.)**.
   - Viện dẫn lần đầu phải ghi đầy đủ tên loại, số, ký hiệu, ngày ban hành và tên cơ quan ban hành (không viết tắt như *Bộ NN&PTNT*).

3. **Quy tắc Nơi nhận (Ô số 9b)**:
   - Cuối mỗi dòng ghi cơ quan, đơn vị nhận kết thúc bằng **dấu chấm phẩy (;)**.
   - Dòng cuối cùng ghi: \`- Lưu: VT, [Ký hiệu đơn vị soạn thảo] (số lượng bản lưu).\` và kết thúc bằng **dấu chấm (.)**.

4. **Thẩm quyền ký & Mực ký**:
   - Ghi quyền hạn ký: TM. (Thay mặt), KT. (Ký thay), Q. (Quyền), TL. (Thừa lệnh), TUQ. (Thừa ủy quyền).
   - Chức vụ in hoa đứng đậm; họ và tên in thường đứng đậm.
   - Mực ký: Bắt buộc dùng **mực màu xanh**, không dùng mực đỏ hay các màu mực khác.`;
  }

  if (q.includes("nhãn") || q.includes("111/2021") || q.includes("43/2017") || q.includes("phụ gia") || q.includes("bảo vệ sức khỏe") || q.includes("nhãn phụ")) {
    return `### 🏷️ Quy định bắt buộc về Ghi nhãn hàng hóa (Nghị định 43/2017/NĐ-CP & Nghị định 111/2021/NĐ-CP):

1. **Nội dung bắt buộc trên nhãn thực phẩm (Phụ lục I NĐ 111/2021)**:
   - Tên hàng hóa (vị trí nổi bật, dễ đọc).
   - Tên và địa chỉ của tổ chức, cá nhân chịu trách nhiệm về hàng hóa.
   - **Xuất xứ hàng hóa**: Phải ghi rõ ràng cụm từ như *"Sản xuất tại"*, *"Chế tạo tại"*, *"Xuất xứ:"* kèm tên nước/vùng lãnh thổ (không viết tắt).
   - Định lượng (khối lượng tịnh, thể tích thực).
   - Ngày sản xuất (NSX) và Hạn sử dụng (HSD).
   - Thành phần hoặc thành phần định lượng.
   - Thông tin cảnh báo, hướng dẫn sử dụng và hướng dẫn bảo quản.

2. **Cách ghi Phụ gia thực phẩm**:
   - Phải ghi rõ: **Tên nhóm chức năng + Tên phụ gia** (hoặc mã quốc tế INS).
   - Ví dụ: *"Chất điều vị (INS 621)"* hoặc *"Chất điều vị (Mononatri glutamat)"*.
   - Với chất tạo ngọt, chất tạo màu, hương liệu phải ghi rõ loại tổng hợp hay tự nhiên.

3. **Đối với Thực phẩm bảo vệ sức khỏe (TPBVSK)**:
   - Bắt buộc ghi tên phân nhóm: **"Thực phẩm bảo vệ sức khỏe"**.
   - Bắt buộc ghi dòng khuyến cáo với kích thước dễ nhìn: **"Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh"**.`;
  }

  if (q.includes("quảng cáo") || q.includes("181/2013") || q.includes("thuốc chữa bệnh")) {
    return `### 📢 Quy định Quảng cáo Thực phẩm theo Nghị định 181/2013/NĐ-CP & Luật ATTP:

1. **Điều kiện quảng cáo thực phẩm**:
   - Phải có Giấy xác nhận nội dung quảng cáo do cơ quan y tế có thẩm quyền cấp trước khi phát hành.
   - Nội dung phải chính xác, khớp với Bản tự công bố hoặc Giấy tiếp nhận đăng ký bản công bố sản phẩm.

2. **Các hành vi nghiêm cấm**:
   - Nghiêm cấm quảng cáo thực phẩm gây hiểu nhầm có tác dụng như thuốc chữa bệnh.
   - Cấm sử dụng hình ảnh, uy tín, thư tín của cán bộ y tế, cơ sở y tế, danh hiệu bác sĩ, dược sĩ để quảng cáo thực phẩm.
   - Cấm dùng từ ngữ khẳng định tuyệt đối như *"trị dứt điểm"*, *"chữa khỏi 100%"*, *"thay thế thuốc điều trị"*.

3. **Khuyến cáo bắt buộc khi quảng cáo TPBVSK**:
   - Phải đọc hoặc hiển thị rõ ràng thông điệp: **"Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh"** (thời lượng đọc ít nhất 3-5 giây trên truyền hình/radio).`;
  }

  if (q.includes("thu hồi") || q.includes("truy xuất") || q.includes("17/2021") || q.includes("24 giờ")) {
    return `### 🔍 Quy trình Truy xuất nguồn gốc & Thu hồi thực phẩm theo Thông tư số 17/2021/TT-BNNPTNT:

1. **Nguyên tắc truy xuất**:
   - Áp dụng nguyên tắc **"Một bước trước - Một bước sau"** (nhận biết cơ sở cung cấp nguyên liệu đầu vào và cơ sở tiếp nhận sản phẩm đầu ra).

2. **Thời hạn lưu trữ hồ sơ truy xuất**:
   - Tối thiểu **06 tháng**: Đối với sản phẩm có hạn sử dụng dưới 06 tháng.
   - Tối thiểu **02 năm**: Đối với sản phẩm có hạn sử dụng từ 06 tháng trở lên.
   - Tối thiểu **12 tháng kể từ ngày thu hoạch**: Đối với sản phẩm tươi sống không ghi hạn sử dụng.

3. **Quy trình thu hồi thực phẩm không bảo đảm an toàn**:
   - Trong vòng **24 giờ** kể từ khi xác định sản phẩm không an toàn: Cơ sở phải thông báo tạm dừng lưu thông và thông báo kế hoạch thu hồi đến các bên phân phối và cơ quan thẩm quyền.
   - Báo cáo kết quả thu hồi trong thời hạn quy định.

4. **04 Hình thức xử lý sản phẩm thu hồi**:
   - **Khắc phục lỗi ghi nhãn / lỗi kỹ thuật** (nếu có thể);
   - **Chuyển mục đích sử dụng** (chế biến thức ăn chăn nuôi, làm phân bón...);
   - **Tái xuất** (đối với hàng nhập khẩu);
   - **Tiêu hủy** (đối với sản phẩm gây hại nghiêm trọng).`;
  }

  if (q.includes("địa giới") || q.includes("phú thọ") || q.includes("202/2025") || q.includes("1676/2025") || q.includes("xã") || q.includes("sáp nhập")) {
    return `### 🗺️ Địa giới hành chính mới tỉnh Phú Thọ theo Nghị quyết 202/2025/QH15 & 1676/NQ-UBTVQH15:

1. **Tổ chức cấp tỉnh**:
   - Sắp xếp và điều chỉnh đơn vị hành chính tạo nên địa bàn tỉnh Phú Thọ mới hiện đại, tích hợp không gian phát triển nông nghiệp công nghệ cao và logistics thực phẩm.

2. **148 Đơn vị hành chính cấp xã/phường sáp nhập mới**:
   - Các xã tiêu biểu: **Xã Vĩnh An, Xã Tiên Lữ, Xã Hy Cương, Xã Lâm Thao, Xã Phùng Nguyên, Xã Trạm Thản, Xã Dân Chủ, Xã Phú Mỹ...**
   
3. **Yêu cầu đối với hồ sơ pháp lý & nhãn mác**:
   - Toàn bộ hồ sơ đề nghị cấp Giấy chứng nhận ATTP, Biên bản thẩm định, Bản tự công bố và Nhãn hàng hóa phải ghi đúng tên đơn vị hành chính cấp xã, huyện, tỉnh mới theo Nghị quyết 1676/NQ-UBTVQH15, không dùng địa danh cũ đã bãi bỏ.`;
  }

  // General fallback
  return `### 📚 Phản hồi Pháp lý & Nghiệp vụ An toàn Thực phẩm:

Về câu hỏi của bạn liên quan đến: **"${question}"**

Hệ thống thẩm định DocuGuard AI tổng hợp các căn cứ pháp lý áp dụng như sau:
1. **Về Thể thức văn bản**: Tuân thủ nghiêm ngặt **Nghị định số 30/2020/NĐ-CP** (trích yếu không có "V/v" với văn bản có tên loại, căn cứ in nghiêng chấm phẩy, nơi nhận đúng dấu câu).
2. **Về Thẩm quyền & Quy trình ATTP**: Áp dụng **Thông tư số 17/2024/TT-BNNPTNT** (hiệu lực từ 15/01/2025: xếp loại Đạt/Không đạt, chủ cơ sở tự tập huấn và xác nhận kiến thức ATTP, hạn khắc phục tối đa 30 ngày) và **Nghị định số 15/2018/NĐ-CP** (10 nhóm cơ sở miễn cấp GCN).
3. **Về Nhãn hàng hóa & Quảng cáo**: Áp dụng **Nghị định số 111/2021/NĐ-CP, Nghị định 43/2017/NĐ-CP** và **Nghị định số 181/2013/NĐ-CP** (khuyến cáo bắt buộc của TPCN).
4. **Về Địa giới hành chính**: Cập nhật chuẩn xác theo **Nghị quyết số 202/2025/QH15** và **Nghị quyết số 1676/NQ-UBTVQH15**.

Bạn có thể chuyển sang tab **"Thẩm định văn bản"** để tải tệp trực tiếp hoặc đặt thêm các câu hỏi chi tiết về từng điều khoản!`;
}

// API: Legal Assistant Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body ?? {};
    if (message !== undefined && message !== null && typeof message !== "string") {
      return res.status(400).json({ error: "Câu hỏi phải là chuỗi ký tự." });
    }
    if (exceedsStringLimit(message, MAX_CHAT_CHARS)) {
      return res.status(413).json({ error: `Câu hỏi vượt giới hạn ${MAX_CHAT_CHARS.toLocaleString("vi-VN")} ký tự.` });
    }
    const ai = getAI();

    if (ai) {
      try {
        const chat = ai.chats.create({
          model: "gemini-3.7-flash",
          config: {
            systemInstruction: `${LEGAL_SYSTEM_PROMPT}\n\nBạn trả lời ngắn gọn, rành mạch, súc tích, luôn trích dẫn chính xác tên văn bản và Điều/Khoản tương ứng. Hãy hỗ trợ người dùng giải đáp chuyên sâu về an toàn thực phẩm, soạn thảo văn bản hành chính theo NĐ 30, nhãn mác hàng hóa theo NĐ 111, phân công quản lý và kiểm tra thẩm định.`,
          },
        });

        const response = await chat.sendMessage({ message: message || "Xin chào" });
        if (response && response.text) {
          return res.json({ reply: response.text, source: "gemini", notice: "Câu trả lời do mô hình AI tạo; cần đối chiếu văn bản pháp luật gốc, hiệu lực và phạm vi áp dụng trước khi sử dụng." });
        }
      } catch (geminiError: any) {
        // Fallback to intelligent legal Q&A engine
      }
    }

    // High quality intelligent legal knowledge engine reply
    const replyText = getIntelligentLegalAnswer(message || "Xin chào");
    return res.json({ reply: replyText, source: "local_fallback", notice: "Đây là câu trả lời từ bộ quy tắc cục bộ, không phải kết quả tra cứu pháp luật trực tiếp. Cần kiểm chứng với văn bản gốc hiện hành." });
  } catch (err: any) {
    const fallbackAnswer = getIntelligentLegalAnswer(req.body?.message || "Xin chào");
    return res.status(503).json({ error: "Trợ lý không thể xử lý câu hỏi lúc này. Vui lòng thử lại sau." });
  }
});

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Legal Document Auditor", time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
