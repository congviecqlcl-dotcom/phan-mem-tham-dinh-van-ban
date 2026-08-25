import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Info,
  Scale,
  Clipboard,
  Trash2,
  Loader2,
  FolderArchive,
  Layers,
  FileCheck,
  Plus,
  ArrowRight,
  BarChart3,
  ExternalLink,
  ChevronRight,
  CheckCheck
} from 'lucide-react';
import mammoth from 'mammoth';
import { AuditResult, DocumentType, IssueCategory, IssueSeverity, CategoryScore, DocumentFileItem } from '../types';
import { PRESET_SAMPLES } from '../data/presets';
import {
  downloadFixedAsWord,
  downloadAuditReportAsWord,
  downloadAllFixedAsZip,
  downloadConsolidatedBatchReport
} from '../utils/docxExport';

export const DocumentAuditor: React.FC = () => {
  // Initial list with preset
  const [files, setFiles] = useState<DocumentFileItem[]>([
    {
      id: 'preset-sample-1',
      name: 'To_trinh_thanh_lap_doan_tham_dinh.docx',
      size: 2450,
      content: PRESET_SAMPLES[0].content,
      docType: PRESET_SAMPLES[0].docType,
      status: 'ready',
      charCount: PRESET_SAMPLES[0].content.length,
    },
  ]);

  const [activeFileId, setActiveFileId] = useState<string>('preset-sample-1');
  const [viewMode, setViewMode] = useState<'detail' | 'batch_overview'>('detail');

  // Single file audit state
  const [isAuditingSingle, setIsAuditingSingle] = useState<boolean>(false);
  // Batch audit state
  const [isBatchAuditing, setIsBatchAuditing] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  // Export states
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);
  const [isExportingReport, setIsExportingReport] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [isExportingBatchReport, setIsExportingBatchReport] = useState<boolean>(false);

  // Extraction & UI states
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractStatus, setExtractStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeResultTab, setActiveResultTab] = useState<'issues' | 'fixed' | 'scores' | 'positives'>('issues');
  const [severityFilter, setSeverityFilter] = useState<'all' | IssueSeverity>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | IssueCategory>('all');
  const [copiedClean, setCopiedClean] = useState<boolean>(false);
  const [copiedIssueId, setCopiedIssueId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get active file
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Extract text from a single file object
  const extractTextFromFile = async (file: File): Promise<{ text: string; detectedType: DocumentType }> => {
    const lowerName = file.name.toLowerCase();
    let text = '';
    let detectedType: DocumentType = 'khac';

    // 1. Client-side Mammoth for DOCX
    if (lowerName.endsWith('.docx')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const mammothResult = await mammoth.extractRawText({ arrayBuffer });
        if (mammothResult.value && mammothResult.value.trim().length > 0) {
          text = mammothResult.value;
        }
      } catch (docxErr) {
        console.warn('Client-side mammoth parse failed:', docxErr);
      }
    }

    // 2. Text files
    if (!text && (lowerName.endsWith('.txt') || lowerName.endsWith('.md') || lowerName.endsWith('.csv') || lowerName.endsWith('.log'))) {
      try {
        text = await file.text();
      } catch (txtErr) {
        console.warn('File.text() failed:', txtErr);
      }
    }

    // 3. Server-side Universal Parser for PDF, DOC, DOCX fallback
    if (!text || lowerName.endsWith('.pdf') || lowerName.endsWith('.doc') || lowerName.endsWith('.rtf')) {
      try {
        const base64Data = await fileToBase64(file);
        const response = await fetch('/api/parse-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            base64Data,
            mimeType: file.type,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.text && data.text.trim().length > 0) {
            text = data.text;
            if (data.detectedType && data.detectedType !== 'khac') {
              detectedType = data.detectedType as DocumentType;
            }
          }
        }
      } catch (serverErr) {
        console.warn('Server parser error:', serverErr);
      }
    }

    // 4. Fallback text read
    if (!text) {
      text = await file.text().catch(() => '');
    }

    // Auto-detect Document Type if not detected
    if (detectedType === 'khac' && text) {
      const lower = text.toLowerCase();
      if (lower.includes('tờ trình') || lowerName.includes('to_trinh') || lowerName.includes('totrinh')) {
        detectedType = 'to_trinh';
      } else if (lower.includes('quyết định') || lowerName.includes('quyet_dinh') || lowerName.includes('quyetdinh')) {
        detectedType = 'quyet_dinh';
      } else if (lower.includes('công văn') || lower.includes('kính gửi:') || lowerName.includes('cong_van') || lowerName.includes('congvan')) {
        detectedType = 'cong_van';
      } else if (lower.includes('biên bản') || lowerName.includes('bien_ban') || lowerName.includes('bienban')) {
        detectedType = 'bien_ban';
      } else if (lower.includes('bản tự công bố') || lowerName.includes('tu_cong_bo')) {
        detectedType = 'tu_cong_bo';
      } else if (lower.includes('thực phẩm bảo vệ sức khỏe') || lower.includes('khối lượng tịnh') || lowerName.includes('nhan')) {
        detectedType = 'nhan_hang_hoa';
      } else if (lower.includes('bản cam kết') || lowerName.includes('cam_ket')) {
        detectedType = 'ban_cam_ket';
      }
    }

    return { text: text.trim(), detectedType };
  };

  // Process multiple uploaded files in parallel
  const processUploadedFiles = async (fileList: FileList | File[]) => {
    const incomingFiles = Array.from(fileList);
    if (incomingFiles.length === 0) return;

    setIsExtracting(true);
    setExtractStatus({
      type: 'info',
      message: `Đang trích xuất nội dung ${incomingFiles.length} tệp văn bản...`,
    });

    const newItems: DocumentFileItem[] = [];

    for (const file of incomingFiles) {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const { text, detectedType } = await extractTextFromFile(file);

      newItems.push({
        id: fileId,
        name: file.name,
        size: file.size,
        content: text || '',
        docType: detectedType,
        status: text ? 'ready' : 'error',
        errorMessage: text ? undefined : 'Không thể đọc nội dung văn bản.',
        charCount: text ? text.length : 0,
      });
    }

    // Append to existing files or replace initial if initial was untouched
    setFiles((prev) => {
      const filteredPrev = prev.filter((p) => p.content.trim().length > 0);
      return [...filteredPrev, ...newItems];
    });

    if (newItems.length > 0) {
      setActiveFileId(newItems[0].id);
    }

    setIsExtracting(false);
    setExtractStatus({
      type: 'success',
      message: `Đã nạp thành công ${newItems.length} tệp văn bản. Nhấn "Thẩm định tất cả" để xử lý hàng loạt!`,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Input change
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUploadedFiles(e.target.files);
    }
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFiles(e.dataTransfer.files);
    }
  };

  // Load All Presets into Batch Queue
  const handleLoadAllPresets = () => {
    const presetItems: DocumentFileItem[] = PRESET_SAMPLES.map((preset, index) => ({
      id: `preset-all-${preset.id}-${Date.now()}-${index}`,
      name: `${preset.name}.docx`,
      size: 2048,
      content: preset.content,
      docType: preset.docType,
      status: 'ready',
      charCount: preset.content.length,
    }));

    setFiles(presetItems);
    setActiveFileId(presetItems[0].id);
    setExtractStatus({
      type: 'info',
      message: `Đã nạp toàn bộ ${presetItems.length} mẫu văn bản pháp lý vào danh sách thẩm định!`,
    });
  };

  // Paste from clipboard into active document or create new document item
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || text.trim().length === 0) {
        setExtractStatus({
          type: 'error',
          message: 'Bộ nhớ tạm không có văn bản. Hãy sao chép (Ctrl+C) văn bản rồi thử lại.',
        });
        return;
      }

      if (activeFile) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === activeFile.id
              ? { ...f, content: text, charCount: text.length, status: 'ready', auditResult: undefined }
              : f
          )
        );
      } else {
        const newId = `clipboard-${Date.now()}`;
        const newItem: DocumentFileItem = {
          id: newId,
          name: 'Van_ban_tu_clipboard.txt',
          size: text.length,
          content: text,
          docType: 'khac',
          status: 'ready',
          charCount: text.length,
        };
        setFiles([newItem]);
        setActiveFileId(newId);
      }

      setExtractStatus({
        type: 'success',
        message: `Đã dán thành công ${text.length.toLocaleString('vi-VN')} ký tự từ Clipboard.`,
      });
    } catch (err) {
      setExtractStatus({
        type: 'info',
        message: 'Bạn có thể nhấp vào khung soạn thảo và bấm Ctrl+V để dán trực tiếp.',
      });
    }
  };

  // Update active file content
  const handleActiveContentChange = (newContent: string) => {
    if (!activeFile) return;
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFile.id
          ? { ...f, content: newContent, charCount: newContent.length, status: 'ready', auditResult: undefined }
          : f
      )
    );
  };

  // Update active file docType
  const handleActiveDocTypeChange = (newDocType: DocumentType) => {
    if (!activeFile) return;
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFile.id ? { ...f, docType: newDocType, auditResult: undefined } : f
      )
    );
  };

  // Remove a document item
  const handleRemoveFile = (idToRemove: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== idToRemove);
      if (filtered.length === 0) {
        const emptyItem: DocumentFileItem = {
          id: `file-empty-${Date.now()}`,
          name: 'Van_ban_moi.docx',
          size: 0,
          content: '',
          docType: 'to_trinh',
          status: 'idle',
          charCount: 0,
        };
        setActiveFileId(emptyItem.id);
        return [emptyItem];
      }
      if (activeFileId === idToRemove) {
        setActiveFileId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Clear all files
  const handleClearAll = () => {
    const emptyItem: DocumentFileItem = {
      id: `file-empty-${Date.now()}`,
      name: 'Van_ban_moi.docx',
      size: 0,
      content: '',
      docType: 'to_trinh',
      status: 'idle',
      charCount: 0,
    };
    setFiles([emptyItem]);
    setActiveFileId(emptyItem.id);
    setExtractStatus(null);
  };

  // Audit Single Document
  const runAuditSingle = async (itemToAudit?: DocumentFileItem) => {
    const target = itemToAudit || activeFile;
    if (!target || !target.content.trim()) return;

    setIsAuditingSingle(true);
    setFiles((prev) =>
      prev.map((f) => (f.id === target.id ? { ...f, status: 'auditing' } : f))
    );

    try {
      const response = await fetch('/api/audit-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: target.content,
          docType: target.docType,
          fileName: target.name,
        }),
      });

      if (!response.ok) throw new Error('Không thể thẩm định văn bản.');
      const result: AuditResult = await response.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === target.id ? { ...f, status: 'completed', auditResult: result } : f
        )
      );
      setActiveResultTab('issues');
    } catch (err: any) {
      console.error('Lỗi thẩm định:', err);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === target.id
            ? { ...f, status: 'error', errorMessage: err.message || 'Lỗi khi thẩm định' }
            : f
        )
      );
    } finally {
      setIsAuditingSingle(false);
    }
  };

  // BATCH AUDIT ALL DOCUMENTS CONCURRENTLY
  const runBatchAuditAll = async () => {
    const pendingFiles = files.filter((f) => f.content && f.content.trim().length > 0);
    if (pendingFiles.length === 0) return;

    setIsBatchAuditing(true);
    setBatchProgress({ current: 0, total: pendingFiles.length });

    // Set all to auditing
    setFiles((prev) =>
      prev.map((f) =>
        f.content && f.content.trim().length > 0 ? { ...f, status: 'auditing' } : f
      )
    );

    // Run parallel audit with controlled concurrency (up to 3 at a time)
    const BATCH_SIZE = 3;
    let completedCount = 0;

    for (let i = 0; i < pendingFiles.length; i += BATCH_SIZE) {
      const chunk = pendingFiles.slice(i, i + BATCH_SIZE);
      await Promise.all(
        chunk.map(async (docItem) => {
          try {
            const response = await fetch('/api/audit-document', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: docItem.content,
                docType: docItem.docType,
                fileName: docItem.name,
              }),
            });

            if (response.ok) {
              const res: AuditResult = await response.json();
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === docItem.id ? { ...f, status: 'completed', auditResult: res } : f
                )
              );
            } else {
              throw new Error('Máy chủ phản hồi lỗi.');
            }
          } catch (err: any) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === docItem.id
                  ? { ...f, status: 'error', errorMessage: err.message || 'Lỗi thẩm định' }
                  : f
              )
            );
          } finally {
            completedCount++;
            setBatchProgress({ current: completedCount, total: pendingFiles.length });
          }
        })
      );
    }

    setIsBatchAuditing(false);
    setBatchProgress(null);

    // If 2 or more files were audited, switch to batch overview for great summary
    if (pendingFiles.length >= 2) {
      setViewMode('batch_overview');
    }
  };

  // Download single fixed docx
  const handleDownloadWordDoc = async () => {
    if (!activeFile?.auditResult?.fixedDocument) return;
    setIsExportingWord(true);
    try {
      const targetName = activeFile.name ? activeFile.name.replace(/\.[^/.]+$/, '') : 'Van_ban_chuan_ND30';
      await downloadFixedAsWord(activeFile.auditResult.fixedDocument, `${targetName}_chuan_ND30.docx`);
    } catch (err) {
      console.error('Lỗi xuất Word:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  // Download single audit report docx
  const handleDownloadWordReport = async () => {
    if (!activeFile?.auditResult) return;
    setIsExportingReport(true);
    try {
      const targetName = activeFile.name ? activeFile.name.replace(/\.[^/.]+$/, '') : 'Van_ban';
      await downloadAuditReportAsWord(activeFile.auditResult, `Bao_cao_tham_dinh_${targetName}.docx`);
    } catch (err) {
      console.error('Lỗi xuất báo cáo:', err);
    } finally {
      setIsExportingReport(false);
    }
  };

  // Batch Export: All fixed DOCX in ZIP
  const handleDownloadAllZip = async () => {
    setIsExportingZip(true);
    try {
      await downloadAllFixedAsZip(files, `Bo_van_ban_chuan_hoa_ND30_${Date.now()}.zip`);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tải gói tệp ZIP.');
    } finally {
      setIsExportingZip(false);
    }
  };

  // Batch Export: Consolidated Word Report
  const handleDownloadConsolidatedReport = async () => {
    setIsExportingBatchReport(true);
    try {
      await downloadConsolidatedBatchReport(files, `Bao_cao_tong_hop_tham_dinh_${Date.now()}.docx`);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tải báo cáo tổng hợp.');
    } finally {
      setIsExportingBatchReport(false);
    }
  };

  // Copy fixed text
  const copyFixedDocument = () => {
    if (!activeFile?.auditResult?.fixedDocument) return;
    navigator.clipboard.writeText(activeFile.auditResult.fixedDocument);
    setCopiedClean(true);
    setTimeout(() => setCopiedClean(false), 2000);
  };

  // Download fixed txt
  const downloadFixedDocument = () => {
    if (!activeFile?.auditResult?.fixedDocument) return;
    const element = document.createElement('a');
    const file = new Blob([activeFile.auditResult.fixedDocument], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeFile.name.replace(/\.[^/.]+$/, '')}_chuan_ND30.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filter issues for active document
  const filteredIssues = (activeFile?.auditResult?.issues || []).filter((issue) => {
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    return true;
  });

  // Aggregated Stats for Batch
  const completedDocs = files.filter((f) => f.auditResult);
  const passedDocs = completedDocs.filter((f) => f.auditResult?.status === 'DAT');
  const warningDocs = completedDocs.filter((f) => f.auditResult?.status === 'CAN_SUA_DOI');
  const failedDocs = completedDocs.filter((f) => f.auditResult?.status === 'KHONG_DAT');
  const avgScore = completedDocs.length
    ? Math.round(completedDocs.reduce((acc, curr) => acc + (curr.auditResult?.overallScore || 0), 0) / completedDocs.length)
    : 0;
  const totalIssuesAcrossAll = completedDocs.reduce(
    (acc, curr) => acc + (curr.auditResult?.issues?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Guidance */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold tracking-tight">
                Kiểm tra & Thẩm định Hàng loạt Văn bản Pháp lý ATTP
              </h2>
            </div>
            <p className="text-xs text-neutral-300 max-w-3xl leading-relaxed">
              Tải lên nhiều tệp Word (<strong>.DOCX, .DOC</strong>), <strong>PDF</strong>, hoặc Text cùng lúc. Bot sẽ thẩm định song song toàn bộ văn bản đối chiếu với <strong>Nghị định 30/2020</strong>, <strong>Thông tư 17/2024 & 38/2018</strong>, <strong>Nghị định 15/2018</strong>, <strong>Nghị định 111/2021 & 181/2013</strong> và <strong>Địa giới hành chính 2025-2026</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● Thẩm định Đa tệp & Xuất ZIP Hàng loạt
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Document Queue Management Strip */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-neutral-900">
              Danh sách văn bản cần thẩm định ({files.length} tệp)
            </h3>
            {completedDocs.length > 0 && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Đã thẩm định: {completedDocs.length}/{files.length}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle when multiple files */}
            {completedDocs.length >= 1 && (
              <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-medium">
                <button
                  onClick={() => setViewMode('detail')}
                  className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                    viewMode === 'detail'
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Chi tiết văn bản</span>
                </button>
                <button
                  onClick={() => setViewMode('batch_overview')}
                  className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                    viewMode === 'batch_overview'
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Bảng tổng hợp ({completedDocs.length})</span>
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <button
              onClick={handleLoadAllPresets}
              className="text-xs font-medium text-neutral-700 hover:text-emerald-800 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl transition border border-neutral-200 flex items-center gap-1.5"
              title="Nạp 8 mẫu văn bản pháp lý chuẩn để thử nghiệm thẩm định hàng loạt"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nạp 8 mẫu thử nghiệm</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition border border-emerald-200 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm tệp văn bản</span>
            </button>

            {files.length > 1 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition border border-rose-200 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa tất cả</span>
              </button>
            )}
          </div>
        </div>

        {/* Document Horizontal Tabs / Queue */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {files.map((file, index) => {
            const isActive = file.id === activeFileId;
            const res = file.auditResult;

            return (
              <div
                key={file.id}
                onClick={() => {
                  setActiveFileId(file.id);
                  if (viewMode === 'batch_overview') setViewMode('detail');
                }}
                className={`group shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs cursor-pointer border transition-all select-none ${
                  isActive
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                }`}
              >
                {/* Status Icon */}
                {file.status === 'auditing' ? (
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                ) : res ? (
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      res.overallScore >= 90
                        ? 'bg-emerald-500 text-white'
                        : res.overallScore >= 60
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {res.overallScore}
                  </span>
                ) : (
                  <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                )}

                <div className="flex flex-col text-left">
                  <span className="font-semibold truncate max-w-[140px] sm:max-w-[180px]">
                    {index + 1}. {file.name}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {res ? (
                      <span className={res.status === 'DAT' ? 'text-emerald-400' : res.status === 'CAN_SUA_DOI' ? 'text-amber-300' : 'text-rose-300'}>
                        {res.status === 'DAT' ? 'Đạt chuẩn' : res.status === 'CAN_SUA_DOI' ? 'Cần sửa đổi' : 'Không đạt'} • {res.issues.length} lỗi
                      </span>
                    ) : (
                      <span>{file.charCount ? `${file.charCount.toLocaleString('vi-VN')} ký tự` : 'Chờ thẩm định'}</span>
                    )}
                  </span>
                </div>

                {/* Remove button */}
                {files.length > 1 && (
                  <button
                    onClick={(e) => handleRemoveFile(file.id, e)}
                    className={`p-1 rounded-lg transition ml-1 ${
                      isActive ? 'hover:bg-neutral-800 text-neutral-400 hover:text-rose-400' : 'hover:bg-neutral-200 text-neutral-400 hover:text-rose-600'
                    }`}
                    title="Xóa tệp này khỏi danh sách"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Batch Operations Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            {/* Batch Run Button */}
            <button
              id="btn-batch-audit-all"
              disabled={isBatchAuditing || files.every((f) => !f.content.trim())}
              onClick={runBatchAuditAll}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white font-medium py-2 px-4 rounded-xl text-xs shadow-sm transition"
            >
              {isBatchAuditing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    Đang thẩm định {batchProgress?.current}/{batchProgress?.total} văn bản...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="font-semibold">
                    Thẩm định Toàn bộ {files.length} Văn bản (Batch Audit)
                  </span>
                </>
              )}
            </button>

            {/* Single Run for Active Document */}
            <button
              id="btn-audit-single"
              disabled={isAuditingSingle || isBatchAuditing || !activeFile?.content.trim()}
              onClick={() => runAuditSingle()}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-medium py-2 px-3 rounded-xl text-xs transition"
            >
              {isAuditingSingle ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang thẩm định tệp này...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chỉ thẩm định tệp đang chọn</span>
                </>
              )}
            </button>
          </div>

          {/* Batch Export Options */}
          {completedDocs.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadAllZip}
                disabled={isExportingZip}
                className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 disabled:bg-neutral-400 text-white font-medium py-2 px-3 rounded-xl text-xs transition shadow-2xs"
                title="Tải toàn bộ các văn bản đã chuẩn hóa (.docx) và báo cáo chi tiết vào file ZIP"
              >
                {isExportingZip ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FolderArchive className="w-3.5 h-3.5" />}
                <span>{isExportingZip ? 'Đang nén ZIP...' : `Tải tất cả file Word (.ZIP)`}</span>
              </button>

              <button
                onClick={handleDownloadConsolidatedReport}
                disabled={isExportingBatchReport}
                className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-900 disabled:bg-neutral-400 text-white font-medium py-2 px-3 rounded-xl text-xs transition"
                title="Tải 1 báo cáo Word (.docx) tổng hợp kết quả thẩm định của toàn bộ danh sách"
              >
                {isExportingBatchReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scale className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isExportingBatchReport ? 'Đang tạo báo cáo...' : 'Tải Báo cáo Tổng hợp (.DOCX)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: BATCH OVERVIEW DASHBOARD */}
      {viewMode === 'batch_overview' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs text-center space-y-1">
              <div className="text-2xl font-bold text-neutral-900">{files.length}</div>
              <div className="text-xs text-neutral-500 font-medium">Tổng số văn bản</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-2xs text-center space-y-1">
              <div className="text-2xl font-bold text-emerald-800">{passedDocs.length}</div>
              <div className="text-xs text-emerald-700 font-medium">Đạt chuẩn (≥90đ)</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-2xs text-center space-y-1">
              <div className="text-2xl font-bold text-amber-800">{warningDocs.length}</div>
              <div className="text-xs text-amber-700 font-medium">Cần sửa đổi (60-89đ)</div>
            </div>
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 shadow-2xs text-center space-y-1">
              <div className="text-2xl font-bold text-rose-800">{failedDocs.length}</div>
              <div className="text-xs text-rose-700 font-medium">Không đạt (&lt;60đ)</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-2xs text-center space-y-1">
              <div className="text-2xl font-bold text-blue-800">{avgScore}/100</div>
              <div className="text-xs text-blue-700 font-medium">Điểm trung bình</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-2xs text-center space-y-1">
              <div className="text-2xl font-bold text-purple-800">{totalIssuesAcrossAll}</div>
              <div className="text-xs text-purple-700 font-medium">Tổng sai sót phát hiện</div>
            </div>
          </div>

          {/* Consolidated Batch Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden space-y-0">
            <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  Bảng tổng hợp kết quả thẩm định hàng loạt
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Nhấp vào từng dòng để xem chi tiết sai sót và tải về văn bản đã sửa đổi theo Nghị định 30/2020.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadAllZip}
                  disabled={isExportingZip || completedDocs.length === 0}
                  className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 disabled:bg-neutral-300 text-white font-medium py-1.5 px-3 rounded-xl text-xs transition"
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Tải ZIP tất cả tệp Word</span>
                </button>
                <button
                  onClick={handleDownloadConsolidatedReport}
                  disabled={isExportingBatchReport || completedDocs.length === 0}
                  className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-medium py-1.5 px-3 rounded-xl text-xs transition"
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tải Báo cáo Tổng hợp (.docx)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-800">
                <thead className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">STT</th>
                    <th className="py-3 px-4">Tên tệp văn bản</th>
                    <th className="py-3 px-4">Loại văn bản</th>
                    <th className="py-3 px-4 text-center">Điểm số</th>
                    <th className="py-3 px-4 text-center">Xếp loại</th>
                    <th className="py-3 px-4">Chi tiết sai sót</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {files.map((file, idx) => {
                    const res = file.auditResult;
                    const errCount = res?.issues.filter((i) => i.severity === 'error').length || 0;
                    const warnCount = res?.issues.filter((i) => i.severity === 'warning').length || 0;
                    const suggCount = res?.issues.filter((i) => i.severity === 'suggestion').length || 0;

                    return (
                      <tr
                        key={file.id}
                        onClick={() => {
                          setActiveFileId(file.id);
                          setViewMode('detail');
                        }}
                        className="hover:bg-emerald-50/40 cursor-pointer transition"
                      >
                        <td className="py-3 px-4 text-center font-mono text-neutral-500 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold text-neutral-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[220px]">{file.name}</span>
                        </td>
                        <td className="py-3 px-4 text-neutral-600">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium">
                            {res?.documentTypeDetected || file.docType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {res ? (
                            <span
                              className={`inline-block font-bold text-xs px-2.5 py-0.5 rounded-full ${
                                res.overallScore >= 90
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : res.overallScore >= 60
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {res.overallScore}/100
                            </span>
                          ) : (
                            <span className="text-neutral-400 italic">Chưa thẩm định</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {res ? (
                            <span
                              className={`font-semibold ${
                                res.status === 'DAT'
                                  ? 'text-emerald-700'
                                  : res.status === 'CAN_SUA_DOI'
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {res.status === 'DAT'
                                ? 'ĐẠT CHUẨN'
                                : res.status === 'CAN_SUA_DOI'
                                ? 'CẦN SỬA ĐỔI'
                                : 'KHÔNG ĐẠT'}
                            </span>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {res ? (
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-rose-700 font-medium">● {errCount} lỗi</span>
                              <span className="text-amber-700 font-medium">● {warnCount} cảnh báo</span>
                              <span className="text-blue-700 font-medium">● {suggCount} gợi ý</span>
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-xs">Chờ thực hiện</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setActiveFileId(file.id);
                                setViewMode('detail');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium transition text-[11px] flex items-center gap-1"
                            >
                              <span>Xem chi tiết</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                            {res && (
                              <button
                                onClick={async () => {
                                  const targetName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Van_ban';
                                  await downloadFixedAsWord(res.fixedDocument, `${targetName}_chuan_ND30.docx`);
                                }}
                                className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                                title="Tải file Word đã sửa"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: SINGLE DOCUMENT DEEP AUDIT VIEW */}
      {viewMode === 'detail' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Nội dung tệp: <span className="font-mono text-emerald-800">{activeFile?.name}</span>
                </h3>
                <span className="text-xs text-neutral-400 font-mono bg-neutral-100 px-2 py-0.5 rounded">
                  {(activeFile?.content || '').length.toLocaleString('vi-VN')} ký tự
                </span>
              </div>

              {/* Multi-file Drag & Drop Upload Zone */}
              <div
                id="document-upload-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                    : 'border-neutral-200 hover:border-emerald-500 bg-neutral-50/70 hover:bg-neutral-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="file-upload-input"
                  type="file"
                  multiple
                  accept=".docx,.doc,.pdf,.txt,.md,.rtf,.odt,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isDragging
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-emerald-600 border border-neutral-200 shadow-2xs'
                    }`}
                  >
                    {isExtracting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-neutral-800">
                      {isExtracting ? (
                        <span className="text-emerald-700">Đang đọc & trích xuất nội dung các tệp...</span>
                      ) : (
                        <>Kéo thả <strong className="text-emerald-700">một hoặc nhiều tệp</strong> vào đây (hoặc chọn từ máy)</>
                      )}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Hỗ trợ Word (<strong>.DOCX, .DOC</strong>), <strong>.PDF</strong>, Text (<strong>.TXT, .MD</strong>)
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Type Selector & Quick Clipboard Tools */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">Loại văn bản:</label>
                  <select
                    id="doc-type-selector"
                    value={activeFile?.docType || 'to_trinh'}
                    onChange={(e) => handleActiveDocTypeChange(e.target.value as DocumentType)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                  >
                    <option value="to_trinh">Tờ trình (Mẫu TTr)</option>
                    <option value="quyet_dinh">Quyết định (Mẫu QĐ)</option>
                    <option value="cong_van">Công văn (Mẫu CV)</option>
                    <option value="bien_ban">Biên bản thẩm định</option>
                    <option value="tu_cong_bo">Bản tự công bố SP</option>
                    <option value="nhan_hang_hoa">Nhãn hàng hóa / Nhãn phụ</option>
                    <option value="ban_cam_ket">Bản cam kết ATTP</option>
                    <option value="quang_cao">Nội dung quảng cáo</option>
                    <option value="khac">Khác / Tự động nhận diện</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-600">Thao tác nhanh:</label>
                  <button
                    type="button"
                    id="btn-paste-clipboard"
                    onClick={handlePasteClipboard}
                    className="w-full flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-xl text-xs font-medium transition border border-neutral-200"
                  >
                    <Clipboard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dán từ Clipboard</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              {extractStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
                    extractStatus.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : extractStatus.type === 'error'
                      ? 'bg-rose-50 border border-rose-200 text-rose-800'
                      : 'bg-neutral-50 border border-neutral-200 text-neutral-700'
                  }`}
                >
                  {extractStatus.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                  {extractStatus.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  {extractStatus.type === 'info' && <Info className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />}
                  <div className="flex-1 leading-relaxed">{extractStatus.message}</div>
                </div>
              )}

              {/* Text Editor Area */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-neutral-600">
                    Nội dung văn bản (chỉnh sửa / dán trực tiếp):
                  </label>
                </div>
                <textarea
                  id="document-content-editor"
                  value={activeFile?.content || ''}
                  onChange={(e) => handleActiveContentChange(e.target.value)}
                  placeholder="Dán hoặc nhập toàn bộ nội dung văn bản hành chính / nhãn hàng hóa / hồ sơ tự công bố vào đây..."
                  rows={13}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 text-xs text-neutral-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  id="btn-run-audit-active"
                  disabled={isAuditingSingle || !activeFile?.content.trim() || isExtracting}
                  onClick={() => runAuditSingle()}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white font-medium py-3 px-3 rounded-xl text-xs shadow-sm transition-all"
                >
                  {isAuditingSingle ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang đối chiếu pháp luật...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="font-semibold">Thẩm định tệp này</span>
                    </>
                  )}
                </button>

                <button
                  disabled={isBatchAuditing || files.every((f) => !f.content.trim())}
                  onClick={runBatchAuditAll}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-medium py-3 px-3 rounded-xl text-xs transition-all"
                >
                  {isBatchAuditing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang chạy hàng loạt...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>Thẩm định tất cả ({files.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Audit Results & Deep Report (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {!activeFile?.auditResult && !isAuditingSingle && !isBatchAuditing && (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm min-h-[460px]">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <FileSearch className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="font-semibold text-neutral-900 text-base">
                    Sẵn sàng thẩm định văn bản
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Tệp <strong>"{activeFile?.name}"</strong> đã sẵn sàng. Nhấn nút <strong>"Thẩm định tệp này"</strong> hoặc <strong>"Thẩm định tất cả"</strong> để nhận kết quả rà soát chi tiết 12 văn bản quy phạm pháp luật.
                  </p>
                </div>
              </div>
            )}

            {(isAuditingSingle || (isBatchAuditing && activeFile?.status === 'auditing')) && (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm min-h-[460px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center animate-pulse">
                    <Scale className="w-8 h-8" />
                  </div>
                  <RefreshCw className="w-6 h-6 text-emerald-700 animate-spin absolute -top-1 -right-1" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900 text-base">
                    Đang thẩm định chuyên sâu "{activeFile?.name}"...
                  </h3>
                  <div className="text-xs text-neutral-500 space-y-1 max-w-sm">
                    <div>✓ Thể thức văn bản & Cấm viết tắt tùy tiện (Nghị định 30/2020)</div>
                    <div>✓ Quy tắc viết hoa chuẩn xác (Phụ lục II NĐ 30/2020)</div>
                    <div>✓ Quy chuẩn ATTP & Xếp loại Đạt/Không đạt (Thông tư 17/2024)</div>
                    <div>✓ Nhãn hàng hóa & Cảnh báo TPCN (Nghị định 111/2021 & 181/2013)</div>
                    <div>✓ Xác thực địa giới hành chính 2025-2026</div>
                  </div>
                </div>
              </div>
            )}

            {activeFile?.auditResult && !isAuditingSingle && (
              <div className="space-y-4">
                {/* Summary Header Card */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          activeFile.auditResult.overallScore >= 90
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : activeFile.auditResult.overallScore >= 60
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {activeFile.auditResult.overallScore}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-neutral-900 text-base">
                            {activeFile.auditResult.documentTypeDetected}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              activeFile.auditResult.status === 'DAT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : activeFile.auditResult.status === 'CAN_SUA_DOI'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {activeFile.auditResult.status === 'DAT'
                              ? 'ĐẠT CHUẨN'
                              : activeFile.auditResult.status === 'CAN_SUA_DOI'
                              ? 'CẦN SỬA ĐỔI'
                              : 'KHÔNG ĐẠT'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          Ngày thẩm định: {activeFile.auditResult.auditDate} • {activeFile.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                      <button
                        id="btn-download-word-top"
                        disabled={isExportingWord}
                        onClick={handleDownloadWordDoc}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-neutral-400 text-white text-xs font-medium transition shadow-sm"
                        title="Tải văn bản đã sửa thành file Word (.docx) chuẩn Nghị định 30/2020: Lề trái 3cm, lề phải/trên/dưới 2cm"
                      >
                        {isExportingWord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                        <span>{isExportingWord ? 'Đang tạo Word...' : 'Tải file Word (.docx)'}</span>
                      </button>
                      <button
                        id="btn-copy-fixed-doc-top"
                        onClick={copyFixedDocument}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium transition"
                      >
                        {copiedClean ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedClean ? 'Đã sao chép!' : 'Chép bản sửa chuẩn'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Overall Summary Text */}
                  <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-150">
                    {activeFile.auditResult.summary}
                  </p>

                  {/* Quick KPI count pills */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                      <div className="text-lg font-bold text-rose-700">
                        {activeFile.auditResult.issues.filter((i) => i.severity === 'error').length}
                      </div>
                      <div className="text-[11px] font-medium text-rose-800">Lỗi nghiêm trọng</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="text-lg font-bold text-amber-700">
                        {activeFile.auditResult.issues.filter((i) => i.severity === 'warning').length}
                      </div>
                      <div className="text-[11px] font-medium text-amber-800">Cảnh báo / Chưa chuẩn</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="text-lg font-bold text-blue-700">
                        {activeFile.auditResult.issues.filter((i) => i.severity === 'suggestion').length}
                      </div>
                      <div className="text-[11px] font-medium text-blue-800">Gợi ý hoàn thiện</div>
                    </div>
                  </div>
                </div>

                {/* Result Navigation Tabs */}
                <div className="flex items-center justify-between bg-neutral-100 p-1.5 rounded-xl border border-neutral-200 text-xs">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    <button
                      id="tab-issues-btn"
                      onClick={() => setActiveResultTab('issues')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
                        activeResultTab === 'issues'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Chi tiết lỗi ({activeFile.auditResult.issues.length})
                    </button>
                    <button
                      id="tab-fixed-btn"
                      onClick={() => setActiveResultTab('fixed')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 shrink-0 ${
                        activeResultTab === 'fixed'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Văn bản chuẩn hóa 100%
                    </button>
                    <button
                      id="tab-scores-btn"
                      onClick={() => setActiveResultTab('scores')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
                        activeResultTab === 'scores'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Đánh giá 5 tiêu chí
                    </button>
                    <button
                      id="tab-positives-btn"
                      onClick={() => setActiveResultTab('positives')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
                        activeResultTab === 'positives'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Điểm làm tốt ({activeFile.auditResult.positivePoints.length})
                    </button>
                  </div>
                </div>

                {/* TAB 1: Detailed Issues */}
                {activeResultTab === 'issues' && (
                  <div className="space-y-3">
                    {/* Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-neutral-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-medium flex items-center gap-1">
                          <SlidersHorizontal className="w-3.5 h-3.5" /> Lọc mức độ:
                        </span>
                        <select
                          value={severityFilter}
                          onChange={(e) => setSeverityFilter(e.target.value as any)}
                          className="bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 text-xs text-neutral-800"
                        >
                          <option value="all">Tất cả mức độ</option>
                          <option value="error">Chỉ lỗi nghiêm trọng</option>
                          <option value="warning">Chỉ cảnh báo</option>
                          <option value="suggestion">Chỉ gợi ý</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-medium">Nhóm:</span>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value as any)}
                          className="bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 text-xs text-neutral-800"
                        >
                          <option value="all">Tất cả nhóm tiêu chí</option>
                          <option value="the_thuc">Thể thức NĐ 30/2020</option>
                          <option value="can_cu_phap_ly">Căn cứ pháp lý & Hiệu lực</option>
                          <option value="chuyen_mon_attp">Chuyên môn ATTP & TT 17/2024</option>
                          <option value="nhan_quang_cao">Nhãn hàng hóa & Quảng cáo</option>
                          <option value="dia_gioi_hanh_chinh">Địa giới hành chính</option>
                        </select>
                      </div>
                    </div>

                    {/* Issues List */}
                    {filteredIssues.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-xs text-neutral-500">
                        Không có lỗi nào phù hợp với bộ lọc hiện tại.
                      </div>
                    ) : (
                      filteredIssues.map((issue, idx) => (
                        <div
                          key={issue.id || idx}
                          className={`bg-white rounded-2xl border p-4.5 space-y-3 shadow-sm transition ${
                            issue.severity === 'error'
                              ? 'border-rose-200 bg-rose-50/20'
                              : issue.severity === 'warning'
                              ? 'border-amber-200 bg-amber-50/20'
                              : 'border-blue-200 bg-blue-50/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              {issue.severity === 'error' ? (
                                <XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                              ) : issue.severity === 'warning' ? (
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                              ) : (
                                <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                              )}
                              <div>
                                <div className="font-semibold text-neutral-900 text-xs sm:text-sm">
                                  {issue.title}
                                </div>
                                {issue.location && (
                                  <div className="text-[11px] text-neutral-500 mt-0.5">
                                    Vị trí: {issue.location}
                                  </div>
                                )}
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                issue.severity === 'error'
                                  ? 'bg-rose-100 text-rose-800'
                                  : issue.severity === 'warning'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {issue.severity === 'error'
                                ? 'Lỗi nghiêm trọng'
                                : issue.severity === 'warning'
                                ? 'Cảnh báo'
                                : 'Gợi ý'}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-700 leading-relaxed">
                            {issue.explanation}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 font-medium">
                            <Scale className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                            <span>Căn cứ: {issue.legalBasis}</span>
                          </div>

                          {/* Diff Snippet */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                            {issue.currentContent && (
                              <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 space-y-1">
                                <div className="font-semibold text-neutral-500 text-[11px]">
                                  Nội dung hiện tại (Chưa đúng):
                                </div>
                                <div className="font-mono text-neutral-800 whitespace-pre-wrap line-through text-[11px]">
                                  {issue.currentContent}
                                </div>
                              </div>
                            )}

                            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-emerald-900 text-[11px]">
                                  Phương án sửa đổi chuẩn:
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(issue.expectedContent);
                                    setCopiedIssueId(issue.id);
                                    setTimeout(() => setCopiedIssueId(null), 1500);
                                  }}
                                  className="text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium"
                                >
                                  {copiedIssueId === issue.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  {copiedIssueId === issue.id ? 'Đã sao chép' : 'Sao chép'}
                                </button>
                              </div>
                              <div className="font-mono text-emerald-950 whitespace-pre-wrap font-medium text-[11px]">
                                {issue.expectedContent}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 2: Clean Fixed Document */}
                {activeResultTab === 'fixed' && (
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Văn bản đã được chỉnh sửa chuẩn hóa 100%
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Đã khắc phục toàn bộ lỗi thể thức theo NĐ 30/2020 và chuẩn hóa thuật ngữ chuyên ngành.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          id="btn-download-word-fixed-tab"
                          disabled={isExportingWord}
                          onClick={handleDownloadWordDoc}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-neutral-400 text-white text-xs font-semibold transition shadow-sm"
                          title="Tải văn bản hoàn chỉnh dạng file Microsoft Word (.docx) chuẩn Nghị định 30/2020: Lề trái 3cm, lề phải 2cm, trên 2cm, dưới 2cm, Times New Roman"
                        >
                          {isExportingWord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                          <span>{isExportingWord ? 'Đang tạo Word...' : 'Tải file Word (.DOCX) chuẩn NĐ 30'}</span>
                        </button>
                        <button
                          id="btn-download-report-fixed-tab"
                          disabled={isExportingReport}
                          onClick={handleDownloadWordReport}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-medium transition"
                          title="Tải báo cáo phân tích thẩm định chi tiết dưới dạng file Word (.docx)"
                        >
                          {isExportingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scale className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{isExportingReport ? 'Đang tạo Báo cáo...' : 'Tải Báo cáo Thẩm định (.DOCX)'}</span>
                        </button>
                        <button
                          id="btn-copy-fixed-tab"
                          onClick={copyFixedDocument}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition"
                        >
                          {copiedClean ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedClean ? 'Đã sao chép!' : 'Sao chép'}</span>
                        </button>
                        <button
                          id="btn-download-fixed-tab"
                          onClick={downloadFixedDocument}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium transition border border-neutral-200"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>File .txt</span>
                        </button>
                      </div>
                    </div>

                    {/* NĐ 30 Parameters Callout */}
                    <div className="bg-gradient-to-r from-blue-50/70 to-emerald-50/70 rounded-xl p-3.5 border border-blue-200/80 text-xs text-neutral-800 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-blue-900">
                        <Scale className="w-4 h-4 text-blue-700" />
                        <span>Quy chuẩn định dạng Microsoft Word (.docx) theo Nghị định số 30/2020/NĐ-CP:</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded-lg bg-white/80 border border-blue-100 shadow-2xs">
                          <div className="font-semibold text-blue-950">📐 Khổ giấy & Canh lề</div>
                          <div className="text-neutral-600 mt-0.5">• A4 (210 x 297 mm)</div>
                          <div className="text-neutral-600 font-medium text-emerald-800">• <strong>Lề trái: 3.0 cm (30 mm)</strong></div>
                          <div className="text-neutral-600 font-medium text-emerald-800">• <strong>Lề phải/trên/dưới: 2.0 cm</strong></div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/80 border border-blue-100 shadow-2xs">
                          <div className="font-semibold text-blue-950">🔤 Phông chữ & Cỡ chữ</div>
                          <div className="text-neutral-600 mt-0.5">• <strong>Times New Roman</strong></div>
                          <div className="text-neutral-600">• Tên loại: 14pt in hoa đậm</div>
                          <div className="text-neutral-600">• Căn cứ & Nội dung: 13-14pt</div>
                          <div className="text-neutral-600">• Nơi nhận chi tiết: 11pt</div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/80 border border-blue-100 shadow-2xs">
                          <div className="font-semibold text-blue-950">📄 Cấu trúc & Bố cục</div>
                          <div className="text-neutral-600 mt-0.5">• Bảng 2 cột ẩn tiêu đề</div>
                          <div className="text-neutral-600">• Gạch chân tiêu ngữ & trích yếu</div>
                          <div className="text-neutral-600">• Thụt đầu dòng 1.27 cm</div>
                          <div className="text-neutral-600">• Bảng chữ ký & nơi nhận chuẩn</div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/80 border border-blue-100 shadow-2xs">
                          <div className="font-semibold text-blue-950">⚖️ Tính tương thích</div>
                          <div className="text-neutral-600 mt-0.5">• Tương thích MS Word 2016-2024</div>
                          <div className="text-neutral-600">• Office 365, WPS, LibreOffice</div>
                          <div className="text-neutral-600">• Sẵn sàng in ấn và phát hành</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 font-mono text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                      {activeFile.auditResult.fixedDocument}
                    </div>
                  </div>
                )}

                {/* TAB 3: Category Scores */}
                {activeResultTab === 'scores' && (
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-sm">
                    <h4 className="font-bold text-sm text-neutral-900">
                      Bảng đánh giá mức độ tuân thủ theo 5 nhóm quy định
                    </h4>

                    <div className="space-y-4 pt-2">
                      {Object.entries(activeFile.auditResult.categoryScores || {}).map(([key, rawCat]) => {
                        const cat = rawCat as CategoryScore;
                        const percentage = Math.round((cat.score / cat.maxScore) * 100);
                        return (
                          <div key={key} className="space-y-1.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-150">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-neutral-900">{cat.name}</span>
                              <span className="font-bold text-neutral-700">
                                {cat.score} / {cat.maxScore} điểm ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  percentage >= 80
                                    ? 'bg-emerald-600'
                                    : percentage >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                              <span>Tổng số vấn đề phát hiện: {cat.totalIssues}</span>
                              <span className="flex items-center gap-2">
                                <span className="text-rose-600">● {cat.severityBreakdown.error} lỗi</span>
                                <span className="text-amber-600">● {cat.severityBreakdown.warning} cảnh báo</span>
                                <span className="text-blue-600">● {cat.severityBreakdown.suggestion} gợi ý</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 4: Positive Points */}
                {activeResultTab === 'positives' && (
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-sm">
                    <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Các điểm đã thực hiện đúng và phù hợp quy chuẩn
                    </h4>
                    <div className="space-y-2.5">
                      {activeFile.auditResult.positivePoints.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-neutral-800"
                        >
                          <Check className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
