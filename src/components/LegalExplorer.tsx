import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ChevronRight,
  Scale,
  FileText,
  CheckCircle2,
  Bookmark,
  Download,
  Copy,
  Check,
  Printer,
  X,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Eye,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { LEGAL_DOCUMENTS } from '../data/legalKnowledge';
import { LegalDocument } from '../types';
import { exportLegalDocToDocx } from '../utils/docxExport';

// Extended practical audit guidance mapping for each document
const PRACTICAL_AUDIT_NOTES: Record<string, {
  purpose: string;
  auditCheckpoints: string[];
  citationStandard: string;
  keyChanges?: string[];
}> = {
  'nd-30-2020': {
    purpose: 'Quy chuẩn bắt buộc cao nhất đối với toàn bộ thể thức và kỹ thuật soạn thảo văn bản hành chính Việt Nam.',
    auditCheckpoints: [
      'NGHIÊM CẤM viết tắt chức vụ, chức danh lãnh đạo: Không viết "PGĐ", "GĐ", "PCT", "CT", "CCT", "TP", "PP", "BGD". Bắt buộc viết đầy đủ "Phó Giám đốc", "Chi cục trưởng", v.v.',
      'Không viết tắt tên cơ quan trong nội dung/căn cứ ("Bộ NN&PTNT" -> "Bộ Nông nghiệp và Phát triển nông thôn").',
      'Đúng font Times New Roman, định lề (trên/dưới 20-25mm, trái 30-35mm, phải 15-20mm).',
      'Trích yếu Quyết định/Tờ trình/Thông báo in đậm đứng, KHÔNG có chữ "V/v" (chữ "V/v" chỉ dùng riêng cho Công văn).',
      'Căn cứ ban hành in nghiêng, cỡ 13-14, kết thúc mỗi căn cứ bằng dấu chấm phẩy (;), căn cứ cuối bằng dấu chấm (.).',
      'Nơi nhận in nghiêng đậm, các dòng cơ quan nhận gạch đầu dòng (-), kết thúc bằng dấu chấm phẩy (;), dòng cuối "Lưu: VT, [đơn vị] [số bản]." kết thúc bằng dấu chấm (.).',
      'Viết hoa chuẩn Phụ lục II: Không viết hoa giữa câu các danh từ chung ("an toàn thực phẩm", "cơ sở sản xuất", "nông, lâm, thủy sản").'
    ],
    citationStandard: 'Căn cứ Nghị định số 30/2020/NĐ-CP ngày 05 tháng 3 năm 2020 của Chính phủ về công tác văn thư;',
    keyChanges: [
      'Bãi bỏ hoàn toàn Thông tư 01/2011/TT-BNV.',
      'Bổ sung quy định chi tiết về ký số điện tử (PNG nền trong suốt, màu xanh) và quản lý văn bản điện tử.'
    ]
  },
  'tt-17-2024': {
    purpose: 'Quy chế mới nhất (hiệu lực từ 15/01/2025) về thẩm định, chứng nhận cơ sở sản xuất kinh doanh thực phẩm nông lâm thủy sản đủ điều kiện ATTP.',
    auditCheckpoints: [
      'BÃI BỎ hoàn toàn việc xếp loại A, B, C: Chỉ còn 2 mức phân loại "Đạt" hoặc "Không đạt".',
      'BÃI BỎ cấp Giấy xác nhận kiến thức ATTP của cơ quan nhà nước: Chuyển sang cơ chế Chủ cơ sở tự tổ chức tập huấn và tự xác nhận.',
      'Thời hạn khắc phục sai lỗi tối đa giảm xuống còn 30 ngày (trước đây là 3 tháng hoặc 60 ngày).',
      'Tần suất kiểm tra định kỳ không quá 01 lần/cơ sở/năm.',
      'Thời hạn thẩm định tại cơ sở là 15 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ. Thông báo thời điểm thẩm định trước 05 ngày làm việc.'
    ],
    citationStandard: 'Căn cứ Thông tư số 17/2024/TT-BNNPTNT ngày 28 tháng 11 năm 2024 của Bộ trưởng Bộ Nông nghiệp và Phát triển nông thôn sửa đổi, bổ sung một số Thông tư quy định thẩm định, chứng nhận cơ sở sản xuất, kinh doanh thực phẩm nông, lâm, thủy sản đủ điều kiện an toàn thực phẩm;',
    keyChanges: [
      'Sửa đổi toàn diện Thông tư 38/2018/TT-BNNPTNT và Thông tư 48/2013/TT-BNNPTNT.',
      'Đơn giản hóa tối đa thủ tục hành chính, chuyển mạnh từ tiền kiểm sang hậu kiểm.'
    ]
  },
  'nd-15-2018': {
    purpose: 'Quy định chi tiết thi hành Luật An toàn thực phẩm về tự công bố sản phẩm, đăng ký bản công bố và phân công trách nhiệm liên ngành.',
    auditCheckpoints: [
      'Tự công bố áp dụng cho: Thực phẩm đã qua chế biến bao gói sẵn, phụ gia thực phẩm, chất hỗ trợ chế biến, bao bì dụng cụ tiếp xúc trực tiếp.',
      'Đăng ký bản công bố bắt buộc đối với: Thực phẩm bảo vệ sức khỏe, TPDDYH, TP cho chế độ ăn đặc biệt, SP dinh dưỡng cho trẻ đến 36 tháng tuổi.',
      'Điều 12: 10 nhóm cơ sở miễn cấp Giấy chứng nhận ATTP (trong đó có cơ sở đã đạt GMP, HACCP, ISO 22000, FSSC 22000...).',
      'Kiểm tra nhà nước thực phẩm nhập khẩu gồm 3 phương thức: Giảm, Thông thường, Chặt.'
    ],
    citationStandard: 'Căn cứ Nghị định số 15/2018/NĐ-CP ngày 02 tháng 02 năm 2018 của Chính phủ quy định chi tiết thi hành một số điều của Luật An toàn thực phẩm;'
  },
  'nd-111-2021': {
    purpose: 'Quy chuẩn ghi nhãn hàng hóa sửa đổi bắt buộc áp dụng cho toàn bộ sản phẩm lưu thông và nhập khẩu.',
    auditCheckpoints: [
      'Cách ghi xuất xứ: Bắt buộc dùng "sản xuất tại", "chế tạo tại", "nước sản xuất", "xuất xứ", "sản xuất bởi", "sản phẩm của" kèm tên đầy đủ nước/vùng lãnh thổ (không viết tắt).',
      'Cách ghi phụ gia thực phẩm: Tên nhóm phụ gia + tên chất hoặc mã quốc tế INS. Ghi rõ nguồn gốc "tự nhiên", "tổng hợp" đối với chất tạo màu/ngọt.',
      'Thực phẩm bảo vệ sức khỏe bắt buộc có dòng khuyến cáo: "Thực phẩm này không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh".'
    ],
    citationStandard: 'Căn cứ Nghị định số 111/2021/NĐ-CP ngày 09 tháng 12 năm 2021 của Chính phủ sửa đổi, bổ sung một số điều Nghị định số 43/2017/NĐ-CP ngày 14 tháng 4 năm 2017 của Chính phủ về nhãn hàng hóa;'
  },
  'nq-dia-gioi-2025': {
    purpose: 'Căn cứ địa giới hành chính mới năm 2025-2026 áp dụng cho quản lý địa bàn và lập hồ sơ cấp phép.',
    auditCheckpoints: [
      'Tỉnh Phú Thọ mới được sắp xếp từ toàn bộ diện tích, dân số tỉnh Vĩnh Phúc, tỉnh Hòa Bình và tỉnh Phú Thọ.',
      'Cập nhật tên các xã, phường mới thành lập (như xã Hy Cương, xã Lâm Thao, xã Xuân Lũng, xã Phùng Nguyên, xã Bản Nguyên, xã Vĩnh An, xã Tiên Lữ, xã Trạm Thản...).',
      'Khi thẩm định địa chỉ cơ sở sản xuất hoặc cấp phép, bắt buộc đối chiếu với danh mục đơn vị hành chính mới để tránh ghi sai địa danh cũ.'
    ],
    citationStandard: 'Căn cứ Nghị quyết số 202/2025/QH15 của Quốc hội và Nghị quyết số 1676/NQ-UBTVQH15 của Ủy ban Thường vụ Quốc hội về việc sắp xếp các đơn vị hành chính cấp tỉnh và cấp xã;'
  }
};

export const LegalExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument>(LEGAL_DOCUMENTS[2]); // Default: TT 17/2024
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDoc, setModalDoc] = useState<LegalDocument>(LEGAL_DOCUMENTS[2]);
  const [activeModalTab, setActiveModalTab] = useState<'articles' | 'summary' | 'audit_guide' | 'citation'>('articles');
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const filteredDocs = LEGAL_DOCUMENTS.filter((doc) => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc =
        doc.code.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.issuer.toLowerCase().includes(q) ||
        doc.keyArticles.some(
          (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.article.toLowerCase().includes(q)
        );
      return matchDoc;
    }
    return true;
  });

  const openDocDetail = (doc: LegalDocument) => {
    setSelectedDoc(doc);
    setModalDoc(doc);
    setArticleSearch('');
    setActiveModalTab('articles');
    setIsModalOpen(true);
  };

  const handleCopyContent = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2500);
  };

  const handleDownloadDocx = async (doc: LegalDocument) => {
    try {
      setIsDownloading(true);
      await exportLegalDocToDocx(doc);
    } catch (err) {
      console.error('Lỗi tải văn bản:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentNotes = PRACTICAL_AUDIT_NOTES[modalDoc.id] || {
    purpose: modalDoc.summary,
    auditCheckpoints: [
      `Áp dụng đối chiếu quy chuẩn theo ${modalDoc.code}.`,
      `Kiểm tra tính pháp lý và hiệu lực viện dẫn từ ngày ${modalDoc.effectiveDate}.`
    ],
    citationStandard: `Căn cứ ${modalDoc.code} ngày ${modalDoc.issuedDate} của ${modalDoc.issuer} về ${modalDoc.title.toLowerCase()};`,
    keyChanges: [] as string[]
  };

  const filteredArticles = modalDoc.keyArticles.filter((art) => {
    if (!articleSearch.trim()) return true;
    const q = articleSearch.toLowerCase();
    return (
      art.article.toLowerCase().includes(q) ||
      art.title.toLowerCase().includes(q) ||
      art.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              Thư viện 12 Văn bản Quy phạm Pháp luật Tích hợp
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
            Tra cứu toàn văn, điều khoản then chốt, quy cách viện dẫn và cẩm nang kiểm tra đối chiếu văn bản hành chính & an toàn thực phẩm.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="legal-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo số hiệu, từ khóa, điều khoản..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-8 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-neutral-500 font-medium flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-neutral-400" /> Lĩnh vực:
        </span>
        {[
          { id: 'ALL', label: 'Tất cả (12)' },
          { id: 'ATTP', label: 'An toàn thực phẩm (6)' },
          { id: 'VAN_THU', label: 'Thể thức văn bản NĐ 30 (1)' },
          { id: 'NHAN_HANG_HOA', label: 'Ghi nhãn hàng hóa (2)' },
          { id: 'QUANG_CAO', label: 'Quảng cáo (1)' },
          { id: 'DIA_GIOI', label: 'Địa giới hành chính 2025 (2)' },
        ].map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 2-Column Layout for Desktop & Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Documents List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <span>Danh sách văn bản ({filteredDocs.length})</span>
            <span className="text-[11px] text-emerald-800 font-medium">Bấm vào để xem toàn văn</span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs space-y-2">
              <AlertCircle className="w-6 h-6 text-neutral-400 mx-auto" />
              <p>Không tìm thấy văn bản phù hợp với từ khóa "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="text-emerald-800 font-semibold hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  id={`doc-card-${doc.id}`}
                  onClick={() => openDocDetail(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 relative group ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-600 ring-1 ring-emerald-600/30 shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-900 transition">
                          {doc.code}
                        </span>
                        {doc.id === 'tt-17-2024' && (
                          <span className="px-1.5 py-0.2 bg-red-100 text-red-800 text-[9px] font-bold rounded-md">
                            MỚI 2025
                          </span>
                        )}
                        {doc.id === 'nd-30-2020' && (
                          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[9px] font-bold rounded-md">
                            CHUẨN QUỐC GIA
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-neutral-700 leading-snug line-clamp-2">
                        {doc.title}
                      </h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                        doc.category === 'ATTP'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.category === 'VAN_THU'
                          ? 'bg-blue-100 text-blue-800'
                          : doc.category === 'NHAN_HANG_HOA'
                          ? 'bg-amber-100 text-amber-800'
                          : doc.category === 'DIA_GIOI'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {doc.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-neutral-100">
                    <span>Cơ quan: {doc.issuer}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDocDetail(doc);
                      }}
                      className="flex items-center gap-1 text-emerald-800 font-bold group-hover:translate-x-0.5 transition-transform cursor-pointer bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                    >
                      Xem chi tiết <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Document Quick Preview on Desktop (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5 shadow-xs sticky top-4">
            {/* Doc Header */}
            <div className="space-y-3 border-b border-neutral-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-neutral-900 text-white">
                    {selectedDoc.code}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    Hiệu lực: <strong className="text-emerald-800">{selectedDoc.effectiveDate}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDocDetail(selectedDoc)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Mở toàn màn hình
                  </button>
                  <button
                    onClick={() => handleDownloadDocx(selectedDoc)}
                    disabled={isDownloading}
                    className="p-1.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
                    title="Tải tệp Word (.docx)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-neutral-900 leading-snug">
                {selectedDoc.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                <div>Cơ quan: <strong className="text-neutral-800">{selectedDoc.issuer}</strong></div>
                <div>Ban hành: <strong>{selectedDoc.issuedDate}</strong></div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 text-xs">
              <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-emerald-800" /> Tóm tắt phạm vi & giá trị pháp lý:
              </div>
              <p className="text-neutral-700 leading-relaxed">
                {selectedDoc.summary}
              </p>
            </div>

            {/* Key Articles Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-neutral-400" /> Điều khoản trọng tâm ({selectedDoc.keyArticles.length}):
                </h4>
                <button
                  onClick={() => openDocDetail(selectedDoc)}
                  className="text-xs text-emerald-800 hover:underline font-semibold flex items-center gap-0.5"
                >
                  Xem chi tiết từng điều <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {selectedDoc.keyArticles.map((art, index) => (
                  <div
                    key={index}
                    onClick={() => openDocDetail(selectedDoc)}
                    className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-emerald-300 hover:bg-neutral-50/50 transition cursor-pointer space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {art.article}
                      </span>
                      <span className="font-bold text-neutral-900 text-right">{art.title}</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed pt-1 line-clamp-3">
                      {art.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE FULL DETAIL MODAL DIALOG                                   */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            id="legal-doc-modal-content"
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden text-neutral-900 animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-200 bg-neutral-50/80 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-neutral-900 text-white shadow-2xs">
                    {modalDoc.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      modalDoc.category === 'ATTP'
                        ? 'bg-emerald-100 text-emerald-800'
                        : modalDoc.category === 'VAN_THU'
                        ? 'bg-blue-100 text-blue-800'
                        : modalDoc.category === 'NHAN_HANG_HOA'
                        ? 'bg-amber-100 text-amber-800'
                        : modalDoc.category === 'DIA_GIOI'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {modalDoc.category === 'ATTP' && 'An toàn thực phẩm'}
                    {modalDoc.category === 'VAN_THU' && 'Thể thức văn thư'}
                    {modalDoc.category === 'NHAN_HANG_HOA' && 'Ghi nhãn hàng hóa'}
                    {modalDoc.category === 'QUANG_CAO' && 'Quảng cáo'}
                    {modalDoc.category === 'DIA_GIOI' && 'Địa giới hành chính'}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    Hiệu lực từ: <strong className="text-emerald-800">{modalDoc.effectiveDate}</strong>
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                  {modalDoc.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                  <div>Cơ quan ban hành: <strong className="text-neutral-800">{modalDoc.issuer}</strong></div>
                  <div>•</div>
                  <div>Ngày ban hành: <strong className="text-neutral-800">{modalDoc.issuedDate}</strong></div>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="close-legal-modal-btn"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition cursor-pointer shrink-0"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-neutral-200 bg-white overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveModalTab('articles')}
                className={`px-4 py-2.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'articles'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Điều khoản trọng tâm ({modalDoc.keyArticles.length})
              </button>
              <button
                onClick={() => setActiveModalTab('summary')}
                className={`px-4 py-2.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'summary'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> Phạm vi & Tóm tắt
              </button>
              <button
                onClick={() => setActiveModalTab('audit_guide')}
                className={`px-4 py-2.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'audit_guide'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Tiêu chuẩn Thẩm định AI
              </button>
              <button
                onClick={() => setActiveModalTab('citation')}
                className={`px-4 py-2.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'citation'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Scale className="w-3.5 h-3.5" /> Căn cứ & Viện dẫn chuẩn
              </button>
            </div>

            {/* Modal Body with Scroll */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* TAB 1: ARTICLES */}
              {activeModalTab === 'articles' && (
                <div className="space-y-4">
                  {/* Article Search Filter */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      placeholder="Lọc nhanh điều khoản theo từ khóa, số điều..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-8 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                    />
                    {articleSearch && (
                      <button
                        onClick={() => setArticleSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Articles List */}
                  <div className="space-y-3">
                    {filteredArticles.length === 0 ? (
                      <div className="p-6 text-center text-neutral-500 text-xs">
                        Không có điều khoản nào khớp với từ khóa "{articleSearch}".
                      </div>
                    ) : (
                      filteredArticles.map((art, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2 shadow-2xs hover:border-neutral-300 transition"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                              {art.article}
                            </span>
                            <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                              {art.title}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-700 leading-relaxed pt-1 whitespace-pre-line">
                            {art.content}
                          </p>

                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleCopyContent(`${art.article}: ${art.title}\n${art.content}`)}
                              className="text-[11px] text-neutral-500 hover:text-emerald-800 flex items-center gap-1 font-medium transition cursor-pointer"
                            >
                              <Copy className="w-3 h-3" /> Sao chép điều khoản
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SUMMARY & SCOPE */}
              {activeModalTab === 'summary' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                    <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 text-emerald-800" /> Tóm tắt phạm vi điều chỉnh & Mục tiêu:
                    </h4>
                    <p className="text-neutral-800 leading-relaxed text-xs">
                      {modalDoc.summary}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                    <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-neutral-500" /> Đối tượng và Phạm vi áp dụng:
                    </h4>
                    <p className="text-neutral-700 leading-relaxed">
                      {currentNotes.purpose}
                    </p>
                  </div>

                  {currentNotes.keyChanges && currentNotes.keyChanges.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
                      <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-700" /> Các điểm cải cách & sửa đổi nổi bật:
                      </h4>
                      <ul className="space-y-1.5 text-neutral-700 pl-4 list-disc">
                        {currentNotes.keyChanges.map((change, cIdx) => (
                          <li key={cIdx}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AUDIT CHECKPOINTS & GUIDELINES */}
              {activeModalTab === 'audit_guide' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
                    <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-800" /> Quy chuẩn Thẩm định Tự động của DocuGuard AI:
                    </h4>
                    <p className="text-neutral-700 leading-relaxed">
                      Hệ thống tự động phân tích và đối soát từng dòng trong văn bản của bạn đối với văn bản pháp luật này theo các tiêu chuẩn trọng điểm dưới đây:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentNotes.auditCheckpoints.map((chk, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-start gap-2.5 text-xs shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <span className="text-neutral-800 leading-relaxed font-medium">
                          {chk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CITATION STANDARD */}
              {activeModalTab === 'citation' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-3">
                    <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-800" /> Quy cách Viện dẫn chuẩn xác trong Văn bản Hành chính (Nghị định 30/2020):
                    </h4>
                    <p className="text-neutral-600 text-xs leading-relaxed">
                      Khi viện dẫn lần đầu trong Căn cứ ban hành hoặc nội dung văn bản, bắt buộc ghi đầy đủ Tên loại, Số hiệu, Ngày tháng năm ban hành, Cơ quan ban hành và Trích yếu. Không được viết tắt tên cơ quan.
                    </p>

                    <div className="p-3 bg-white rounded-lg border border-neutral-200 font-mono text-xs text-neutral-900 italic select-all">
                      {currentNotes.citationStandard}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCopyContent(currentNotes.citationStandard)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedState ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedState ? 'Đã sao chép!' : 'Sao chép câu viện dẫn'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-neutral-500 text-[11px]">
                DocuGuard AI • Cập nhật ngày: {modalDoc.effectiveDate}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `TRÍCH LỤC: ${modalDoc.code} - ${modalDoc.title}\nCơ quan ban hành: ${modalDoc.issuer} (Hiệu lực: ${modalDoc.effectiveDate})\n\nI. TÓM TẮT:\n${modalDoc.summary}\n\nII. ĐIỀU KHOẢN TRỌNG TÂM:\n` +
                      modalDoc.keyArticles.map(a => `${a.article}: ${a.title}\n${a.content}`).join('\n\n');
                    handleCopyContent(fullText);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  {copiedState ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedState ? 'Đã sao chép toàn văn' : 'Sao chép toàn bộ'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadDocx(modalDoc)}
                  disabled={isDownloading}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isDownloading ? 'Đang xuất file...' : 'Tải trích lục Word (.docx)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
