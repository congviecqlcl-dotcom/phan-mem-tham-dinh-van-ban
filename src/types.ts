export type DocumentType =
  | 'to_trinh'
  | 'quyet_dinh'
  | 'cong_van'
  | 'bien_ban'
  | 'tu_cong_bo'
  | 'nhan_hang_hoa'
  | 'ban_cam_ket'
  | 'ke_hoach_truy_xuat'
  | 'quang_cao'
  | 'khac';

export type IssueSeverity = 'error' | 'warning' | 'suggestion';

export type IssueCategory =
  | 'the_thuc' // Nghị định 30/2020/NĐ-CP
  | 'can_cu_phap_ly' // Hiệu lực văn bản, TT 17/2024, NĐ 15/2018, etc.
  | 'chuyen_mon_attp' // Luật ATTP, TT 17/2024, TT 38/2018, TT 48/2013, TT 17/2018, TT 17/2021
  | 'nhan_quang_cao' // NĐ 43/2017, NĐ 111/2021, NĐ 181/2013
  | 'dia_gioi_hanh_chinh'; // NQ 202/2025/QH15, NQ 1676/NQ-UBTVQH15

export interface AuditIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  currentContent?: string;
  expectedContent: string;
  legalBasis: string;
  explanation: string;
  location?: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  totalIssues: number;
  severityBreakdown: {
    error: number;
    warning: number;
    suggestion: number;
  };
}

export interface AuditResult {
  overallScore: number; // 0 - 100
  status: 'DAT' | 'CAN_SUA_DOI' | 'KHONG_DAT';
  documentTypeDetected: string;
  summary: string;
  positivePoints: string[];
  issues: AuditIssue[];
  categoryScores: Record<IssueCategory, CategoryScore>;
  fixedDocument: string;
  auditDate: string;
  documentTitle?: string;
}

export interface LegalDocument {
  id: string;
  code: string;
  title: string;
  issuedDate: string;
  effectiveDate: string;
  issuer: string;
  category: 'ATTP' | 'NHAN_HANG_HOA' | 'QUANG_CAO' | 'VAN_THU' | 'DIA_GIOI';
  summary: string;
  keyArticles: {
    article: string;
    title: string;
    content: string;
  }[];
  pdfDownloadName?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  legalReferences?: {
    docCode: string;
    article: string;
    excerpt: string;
  }[];
}

export interface PresetSample {
  id: string;
  name: string;
  docType: DocumentType;
  description: string;
  content: string;
}

export interface DocumentFileItem {
  id: string;
  name: string;
  size: number;
  content: string;
  docType: DocumentType;
  status: 'idle' | 'extracting' | 'ready' | 'auditing' | 'completed' | 'error';
  errorMessage?: string;
  auditResult?: AuditResult;
  charCount?: number;
}
