import type { CompositeDocumentSegment } from '../types';

type SegmentKind = CompositeDocumentSegment['kind'];

const RULES: Array<{ kind: SegmentKind; label: string; patterns: RegExp[] }> = [
  { kind: 'hop_dong', label: 'Hợp đồng', patterns: [/\bHỢP ĐỒNG\b/i, /\bBÊN A\b/i, /\bBÊN B\b/i, /\bĐIỀU \d+\b/i] },
  { kind: 'hoa_don', label: 'Hóa đơn', patterns: [/\bHÓA ĐƠN GIÁ TRỊ GIA TĂNG\b/i, /\bHÓA ĐƠN BÁN HÀNG\b/i, /\bMÃ CỦA CƠ QUAN THUẾ\b/i, /\bTIỀN HÀNG\b/i] },
  { kind: 'giay_chung_nhan_attp', label: 'Giấy chứng nhận ATTP', patterns: [/\bGIẤY CHỨNG NHẬN\b/i, /\bĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM\b/i, /\bCƠ SỞ ĐỦ ĐIỀU KIỆN\b/i] },
  { kind: 'kiem_dich', label: 'Giấy tờ kiểm dịch', patterns: [/\bGIẤY CHỨNG NHẬN KIỂM DỊCH\b/i, /\bKIỂM DỊCH THỰC VẬT\b/i, /\bKIỂM DỊCH ĐỘNG VẬT\b/i, /\bPHYTOSANITARY\b/i] },
  { kind: 'kiem_nghiem', label: 'Phiếu kết quả kiểm nghiệm', patterns: [/\bPHIẾU KẾT QUẢ KIỂM NGHIỆM\b/i, /\bKẾT QUẢ THỬ NGHIỆM\b/i, /\bTEST REPORT\b/i] },
];

function classifyPage(text: string): { kind: SegmentKind; label: string; evidence: string[] } | null {
  const normalized = text.normalize('NFC');
  const ranked = RULES.map((rule) => ({
    ...rule,
    evidence: rule.patterns.filter((pattern) => pattern.test(normalized)).map((pattern) => pattern.source.replace(/\\b/g, '').replace(/\\/g, '')),
  })).sort((a, b) => b.evidence.length - a.evidence.length);
  const best = ranked[0];
  if (!best || best.evidence.length < 2) return null;
  if (ranked[1] && ranked[1].evidence.length === best.evidence.length) return null;
  return { kind: best.kind, label: best.label, evidence: best.evidence };
}

/**
 * Conservative page-based detection only. It never splits or rewrites source text.
 * Without explicit page boundaries it returns no segments rather than guessing.
 */
export function detectCompositeDocument(text: string): CompositeDocumentSegment[] {
  const pageMarker = /\[Trang\s+(\d+)\]\s*/gi;
  const matches = Array.from(text.matchAll(pageMarker));
  let pages: Array<{ page: number; text: string }> = [];

  if (matches.length >= 2) {
    pages = matches.map((match, index) => ({
      page: Number(match[1]),
      text: text.slice(match.index! + match[0].length, index + 1 < matches.length ? matches[index + 1].index! : text.length).trim(),
    }));
  } else if (text.includes('\\f')) {
    pages = text.split('\\f').map((pageText, index) => ({ page: index + 1, text: pageText.trim() }));
  } else {
    return [];
  }

  const classified = pages.map((page) => ({ ...page, classification: classifyPage(page.text) }));
  const knownKinds = new Set(classified.flatMap((page) => page.classification ? [page.classification.kind] : []));
  if (knownKinds.size < 2) return [];

  const segments: CompositeDocumentSegment[] = [];
  for (const page of classified) {
    const classification = page.classification;
    if (!classification) continue;
    const last = segments[segments.length - 1];
    if (last && last.kind === classification.kind && last.pageEnd + 1 === page.page) {
      last.pageEnd = page.page;
      last.evidence = Array.from(new Set([...last.evidence, ...classification.evidence])).slice(0, 6);
    } else {
      segments.push({
        kind: classification.kind,
        label: classification.label,
        pageStart: page.page,
        pageEnd: page.page,
        evidence: classification.evidence.slice(0, 6),
      });
    }
  }
  return segments;
}
