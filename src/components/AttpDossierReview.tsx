import React, { useEffect, useMemo, useRef, useState } from 'react';
import { authenticatedFetch, getAccessToken, getAuthConfig } from '../utils/auth';
import { FilePlus2, FolderOpen, ClipboardCheck, AlertTriangle, Trash2, Plus, Search, FileText } from 'lucide-react';

type DossierDocument = { id: string; name: string; size: number; type: string; storagePath?: string; text: string; parseStatus: 'extracted' | 'needs_ocr' | 'unsupported' | 'error'; parseMessage: string; addedAt: string };
type ChecklistItem = { id: string; label: string; group: string; required: boolean; documentIds: string[] };
type Dossier = {
  id: string; code: string; facilityName: string; representative: string; address: string;
  facilityType: string; procedure: string; createdAt: string; documents: DossierDocument[]; checklist: ChecklistItem[];
};

const DEFAULT_CHECKLIST: Omit<ChecklistItem, 'id' | 'documentIds'>[] = [
  { group: 'Thông tin và pháp lý cơ sở', label: 'Tài liệu xác định thông tin, tư cách pháp lý của cơ sở', required: true },
  { group: 'Địa điểm và mặt bằng', label: 'Tài liệu về địa điểm, mặt bằng và bố trí khu vực hoạt động', required: true },
  { group: 'Nhân sự', label: 'Tài liệu về người trực tiếp sản xuất, kinh doanh và phân công trách nhiệm', required: true },
  { group: 'Trang thiết bị', label: 'Tài liệu về máy móc, thiết bị, dụng cụ phục vụ hoạt động', required: true },
  { group: 'Quy trình hoạt động', label: 'Mô tả quy trình sản xuất, sơ chế, chế biến, bảo quản hoặc kinh doanh', required: true },
  { group: 'Kiểm soát an toàn thực phẩm', label: 'Tài liệu về kiểm soát nguyên liệu, vệ sinh, nước và phòng ngừa nguy cơ', required: true },
  { group: 'Tài liệu khác', label: 'Tài liệu khác theo yêu cầu của thủ tục và loại hình cơ sở', required: false },
];

const uid = () => crypto.randomUUID();

function getCurrentUserId(): string {
  const token = getAccessToken();
  if (!token) throw new Error('Phiên đăng nhập không hợp lệ.');
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = JSON.parse(atob(base64 + '='.repeat((4 - base64.length % 4) % 4)));
  if (typeof decoded.sub !== 'string') throw new Error('Không xác định được tài khoản đăng nhập.');
  return decoded.sub;
}

async function dossierApi(table: string, method = 'GET', body?: unknown, query = '') {
  const { url, anonKey } = getAuthConfig();
  const token = getAccessToken();
  if (!url || !anonKey || !token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
  const headers: Record<string, string> = { apikey: anonKey, Authorization: 'Bearer ' + token };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (method !== 'GET') headers['Prefer'] = 'return=representation';
  const response = await fetch(url.replace(/\/$/, '') + '/rest/v1/' + table + query, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || payload?.details || 'Lỗi lưu dữ liệu hồ sơ (HTTP ' + response.status + ').');
  return payload;
}

export const AttpDossierReview: React.FC = () => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [facilityName, setFacilityName] = useState('');
  const [representative, setRepresentative] = useState('');
  const [address, setAddress] = useState('');
  const [facilityType, setFacilityType] = useState('Chưa phân loại');
  const [procedure, setProcedure] = useState('Cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP');
  const [newChecklistLabel, setNewChecklistLabel] = useState('');
  const [newChecklistGroup, setNewChecklistGroup] = useState('Tài liệu bổ sung');
  const [notice, setNotice] = useState('Đang tải hồ sơ đã lưu từ máy chủ.');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const mapped = await reloadDossiers();
        if (cancelled) return;
        setSelectedId(current => mapped.some(d => d.id === current) ? current : (mapped[0]?.id || ''));
        setNotice('Đã tải ' + mapped.length + ' hồ sơ từ cơ sở dữ liệu. Tài liệu được lưu trong kho riêng tư.');
      } catch (error) {
        if (!cancelled) setNotice(error instanceof Error ? error.message : 'Không tải được danh sách hồ sơ từ máy chủ.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = dossiers.find(d => d.id === selectedId) || dossiers[0];

  const stats = useMemo(() => {
    const items = selected?.checklist || [];
    const required = items.filter(i => i.required);
    const matched = items.filter(i => i.documentIds.length > 0);
    return { total: items.length, required: required.length, matched: matched.length, missing: required.filter(i => i.documentIds.length === 0).length };
  }, [selected]);

  const reloadDossiers = async () => {
    const [dossierRows, documentRows, checklistRows, linkRows] = await Promise.all([
      dossierApi('attp_dossiers', 'GET', undefined, '?select=*&order=created_at.desc'),
      dossierApi('attp_dossier_documents', 'GET', undefined, '?select=*&is_removed=eq.false&order=created_at.asc'),
      dossierApi('attp_dossier_checklist_items', 'GET', undefined, '?select=*&order=sort_order.asc'),
      dossierApi('attp_dossier_document_links', 'GET', undefined, '?select=*'),
    ]);
    const mapped: Dossier[] = (dossierRows || []).map((row: any) => ({
      id: row.id, code: row.code, facilityName: row.facility_name, representative: row.representative || '',
      address: row.address, facilityType: row.facility_type, procedure: row.procedure,
      createdAt: new Date(row.created_at).toLocaleString('vi-VN'),
      documents: (documentRows || []).filter((doc: any) => doc.dossier_id === row.id).map((doc: any) => ({
        id: doc.id, name: doc.file_name, size: Number(doc.size_bytes), type: doc.mime_type || 'Không xác định',
        storagePath: doc.storage_path, text: doc.extracted_text || '',
        parseStatus: doc.parse_status === 'EXTRACTED' ? 'extracted' : doc.parse_status === 'NEEDS_OCR' ? 'needs_ocr' : doc.parse_status === 'UNSUPPORTED' ? 'unsupported' : 'error',
        parseMessage: doc.parse_message || 'Tệp đã lưu.', addedAt: new Date(doc.created_at).toLocaleString('vi-VN'),
      })),
      checklist: (checklistRows || []).filter((item: any) => item.dossier_id === row.id).map((item: any) => ({
        id: item.id, group: item.group_label, label: item.requirement_label, required: item.is_required,
        documentIds: (linkRows || []).filter((link: any) => link.checklist_item_id === item.id).map((link: any) => link.document_id),
      })),
    }));
    setDossiers(mapped);
    return mapped;
  };

  const createDossier = async () => {
    if (!facilityName.trim() || !address.trim()) {
      setNotice('Cần nhập tên cơ sở và địa chỉ để tạo hồ sơ.');
      return;
    }
    const id = uid();
    const userId = getCurrentUserId();
    const checklist = DEFAULT_CHECKLIST.map((item, index) => ({ ...item, id: uid(), documentIds: [] as string[] }));
    const dossier: Dossier = {
      id, code: `ATTP-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`,
      facilityName: facilityName.trim(), representative: representative.trim(), address: address.trim(),
      facilityType, procedure, createdAt: new Date().toLocaleString('vi-VN'), documents: [], checklist,
    };
    try {
      await dossierApi('attp_dossiers', 'POST', {
        id, code: dossier.code, facility_name: dossier.facilityName,
        representative: dossier.representative || null, address: dossier.address,
        facility_type: dossier.facilityType, procedure: dossier.procedure, created_by: userId,
      });
      await dossierApi('attp_dossier_checklist_items', 'POST', checklist.map((item, index) => ({
        id: item.id, dossier_id: id, group_label: item.group, requirement_label: item.label,
        is_required: item.required, sort_order: index + 1, created_by: userId,
      })));
      setDossiers(prev => [dossier, ...prev]); setSelectedId(id); setShowCreate(false);
      setFacilityName(''); setRepresentative(''); setAddress('');
      setNotice('Đã lưu hồ sơ và danh mục kiểm soát vào cơ sở dữ liệu.');
      await reloadDossiers();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không lưu được hồ sơ. Vui lòng thử lại.');
    }
  };
  const addFiles = async (files: FileList | null) => {
    if (!selected || !files?.length) return;
    const additions: DossierDocument[] = [];
    for (const file of Array.from(files)) {
      let text = '';
      let parseStatus: DossierDocument['parseStatus'] = 'error';
      let parseMessage = 'Chưa đọc được nội dung.';
      const lower = file.name.toLowerCase().trim();
      let storagePath: string | undefined;
      try {
        const { url, anonKey } = getAuthConfig();
        const token = getAccessToken();
        if (!url || !anonKey || !token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        const isPdf = lower.endsWith('.pdf') || file.type === 'application/pdf';
        const isDocx = lower.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const isPlain = ['.txt', '.md', '.csv'].some(extension => lower.endsWith(extension));
        const isImage = /\.(png|jpe?g|webp|bmp|tif|tiff)$/i.test(lower) || ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/tiff'].includes(file.type);
        if (!isPdf && !isDocx && !isPlain && !isImage) {
          parseStatus = 'unsupported';
          parseMessage = 'Định dạng chưa được hỗ trợ trong phân hệ hồ sơ.';
        } else {
          if (file.size > 25 * 1024 * 1024) throw new Error('Tệp vượt giới hạn 25 MB của kho lưu trữ.');
          const extension = file.name.match(/\.[^.]+$/)?.[0] || '';
          const safeName = uid() + extension.toLowerCase();
          storagePath = selected.id + '/' + safeName;
          const storageBaseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
          const uploadUrl = storageBaseUrl + '/storage/v1/object/attp-dossiers-private/' + storagePath.split('/').map(encodeURIComponent).join('/');
          const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: { apikey: anonKey, Authorization: 'Bearer ' + token, 'Content-Type': file.type || (isPdf ? 'application/pdf' : isDocx ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : isImage ? ( /\.(jpe?g)$/i.test(lower) ? 'image/jpeg' : /\.webp$/i.test(lower) ? 'image/webp' : /\.bmp$/i.test(lower) ? 'image/bmp' : /\.tiff?$/i.test(lower) ? 'image/tiff' : 'image/png') : 'text/plain'), 'x-upsert': 'false' },
            body: file,
          });
          if (!uploadResponse.ok) {
            const detail = await uploadResponse.text().catch(() => '');
            throw new Error('Không tải được tệp lên kho riêng tư (HTTP ' + uploadResponse.status + '). ' + detail.slice(0, 180));
          }
          if (isPlain) {
            text = await file.text();
            parseStatus = text.trim() ? 'extracted' : 'error';
            parseMessage = text.trim() ? 'Đã lưu tệp riêng tư và đọc văn bản thuần.' : 'Đã lưu tệp nhưng không có nội dung văn bản.';
          } else if (isImage) {
            const { recognizeImageText } = await import('../utils/browserPdfOcr');
            const ocr = await recognizeImageText(file);
            if (ocr.text.length < 20) {
              parseStatus = 'needs_ocr';
              parseMessage = 'Đã lưu ảnh nhưng OCR không nhận dạng đủ chữ. Cần kiểm tra ảnh gốc hoặc chụp lại rõ hơn.';
            } else {
              const accepted = window.confirm('Đã OCR ảnh tại trình duyệt (độ tin cậy ' + Math.round(ocr.confidence) + '%).\n\n' + ocr.text.slice(0, 1800) + (ocr.text.length > 1800 ? '\n… (còn nội dung)' : '') + '\n\nBạn đã đối chiếu với ảnh gốc và xác nhận đưa nội dung nhận dạng vào hồ sơ chưa?');
              if (accepted) {
                text = ocr.text;
                parseStatus = 'extracted';
                parseMessage = 'Đã OCR ảnh tại trình duyệt (' + Math.round(ocr.confidence) + '%). Công chức phải đối chiếu toàn bộ nội dung với ảnh gốc.';
              } else {
                parseStatus = 'needs_ocr';
                parseMessage = 'Đã OCR nhưng chưa được công chức xác nhận; nội dung chưa được ghi vào hồ sơ.';
              }
            }
          } else {
            let response: Response | undefined;
            let payload: any = {};
            if (!isPdf) {
              response = await authenticatedFetch('/api/parse-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, mimeType: file.type, storagePath }),
              });
              payload = await response.json().catch(() => ({}));
            } else {
              response = await authenticatedFetch('/api/parse-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, mimeType: file.type, storagePath }),
              });
              payload = await response.json().catch(() => ({}));
            }
            if (response.ok && payload.success && typeof payload.text === 'string' && payload.text.trim().length >= 200) {
              text = payload.text;
              parseStatus = 'extracted';
              parseMessage = 'Đã lưu tệp riêng tư và trích xuất ' + Number(payload.charCount || text.length).toLocaleString('vi-VN') + ' ký tự.';
            } else if (isPdf) {
              const { recognizeScannedPdf } = await import('../utils/browserPdfOcr');
              const ocr = await recognizeScannedPdf(file);
              const failedPages = ocr.pages.filter(page => page.status !== 'dat');
              if (ocr.text.length < 20) {
                parseStatus = 'needs_ocr';
                parseMessage = 'PDF đã lưu nhưng OCR không nhận dạng đủ nội dung. Cần kiểm tra bản quét.';
              } else {
                const pageSummary = ocr.pages.map(page => 'Trang ' + page.page + ': ' + (page.status === 'dat' ? 'nhận dạng được' : page.status === 'can_kiem_tra' ? 'cần kiểm tra' : 'không đọc được') + ' (' + Math.round(page.confidence) + '%)').join('\n');
                const accepted = window.confirm('Đã OCR ' + ocr.pages.length + ' trang ngay trên trình duyệt. Tệp không được gửi đến dịch vụ OCR bên ngoài.\n\n' + pageSummary + '\n\n' + ocr.text.slice(0, 1800) + (ocr.text.length > 1800 ? '\n… (còn nội dung)' : '') + '\n\nBạn đã đối chiếu với bản quét gốc và xác nhận đưa nội dung OCR vào hồ sơ chưa?');
                if (accepted) {
                  text = ocr.text;
                  parseStatus = failedPages.length ? 'needs_ocr' : 'extracted';
                  parseMessage = 'Đã OCR ' + ocr.pages.length + ' trang. ' + (failedPages.length ? failedPages.length + ' trang cần kiểm tra thủ công: ' + failedPages.map(page => page.page).join(', ') + '. ' : '') + 'Phải đối chiếu với ảnh gốc.';
                } else {
                  parseStatus = 'needs_ocr';
                  parseMessage = 'Đã OCR nhưng chưa được công chức xác nhận; nội dung chưa được ghi vào hồ sơ.';
                }
              }
            } else {
              parseStatus = 'error';
              parseMessage = typeof payload.error === 'string' ? payload.error : 'Đã lưu tệp nhưng chưa trích xuất được nội dung (HTTP ' + response.status + ').';
            }
          }
        }
      } catch (error) {
        parseStatus = 'error';
        parseMessage = error instanceof Error ? error.message : 'Lỗi tải lên hoặc xử lý tệp.';
      }
      const documentId = uid();
      if (storagePath) {
        try {
          await dossierApi('attp_dossier_documents', 'POST', {
            id: documentId, dossier_id: selected.id, file_name: file.name, mime_type: file.type || (isPdf ? 'application/pdf' : isDocx ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : isImage ? (/\.(jpe?g)$/i.test(lower) ? 'image/jpeg' : /\.webp$/i.test(lower) ? 'image/webp' : /\.bmp$/i.test(lower) ? 'image/bmp' : /\.tiff?$/i.test(lower) ? 'image/tiff' : 'image/png') : 'text/plain'),
            size_bytes: file.size, storage_path: storagePath,
            parse_status: parseStatus === 'extracted' ? 'EXTRACTED' : parseStatus === 'needs_ocr' ? 'NEEDS_OCR' : parseStatus === 'unsupported' ? 'UNSUPPORTED' : 'ERROR',
            parse_message: parseMessage, extracted_text: text || null, created_by: getCurrentUserId(),
          });
        } catch (error) {
          parseMessage += ' Tệp đã lên kho nhưng chưa ghi nhận được vào hồ sơ: ' + (error instanceof Error ? error.message : 'lỗi cơ sở dữ liệu');
          storagePath = undefined;
        }
      }
      additions.push({ id: documentId, name: file.name, size: file.size, type: file.type || 'Không xác định', storagePath, text, parseStatus, parseMessage, addedAt: new Date().toLocaleString('vi-VN') });
    }
    await reloadDossiers().catch(error => setNotice(error instanceof Error ? error.message : 'Không tải lại được hồ sơ sau khi thêm tài liệu.'));
    const readCount = additions.filter(d => d.parseStatus === 'extracted').length;
    const ocrCount = additions.filter(d => d.parseStatus === 'needs_ocr').length;
    const uploadedCount = additions.filter(doc => Boolean(doc.storagePath)).length;
    const failedCount = additions.length - uploadedCount;
    setNotice('Kết quả tải tệp: ' + uploadedCount + ' tệp đã lưu vào kho riêng tư và hồ sơ; ' + failedCount + ' tệp tải lên hoặc ghi nhận thất bại; ' + readCount + ' tệp đọc được nội dung; ' + ocrCount + ' tệp cần OCR. Trích xuất không đồng nghĩa với thẩm định.');
    if (inputRef.current) inputRef.current.value = '';
  };

  const updateChecklist = async (itemId: string, documentIds: string[]) => {
    if (!selected) return;
    try {
      await dossierApi('attp_dossier_document_links', 'DELETE', undefined, '?checklist_item_id=eq.' + encodeURIComponent(itemId));
      if (documentIds.length) {
        await dossierApi('attp_dossier_document_links', 'POST', documentIds.map(documentId => ({
          dossier_id: selected.id, checklist_item_id: itemId, document_id: documentId, created_by: getCurrentUserId(),
        })));
      }
      await reloadDossiers();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không cập nhật được liên kết tài liệu.');
    }
  };
  const addChecklistItem = async () => {
    if (!selected || !newChecklistLabel.trim()) return;
    const userId = getCurrentUserId();
    const item = { id: uid(), dossier_id: selected.id, group_label: newChecklistGroup, requirement_label: newChecklistLabel.trim(), is_required: false, sort_order: selected.checklist.length + 1, created_by: userId };
    try {
      await dossierApi('attp_dossier_checklist_items', 'POST', item);
      await reloadDossiers();
      setNewChecklistLabel('');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không lưu được đầu mục kiểm soát.');
    }
  };
  const removeDocument = async (documentId: string) => {
    if (!selected) return;
    try {
      await dossierApi('attp_dossier_documents', 'PATCH', { is_removed: true }, '?id=eq.' + encodeURIComponent(documentId));
      await dossierApi('attp_dossier_document_links', 'DELETE', undefined, '?document_id=eq.' + encodeURIComponent(documentId));
      await reloadDossiers();
      setNotice('Đã gỡ tài liệu khỏi danh sách làm việc. Tệp gốc vẫn được giữ trong kho lưu trữ để bảo toàn dấu vết.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Không gỡ được tài liệu khỏi hồ sơ.');
    }
  };

  return <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-xl font-bold text-neutral-900">Thẩm định hồ sơ ATTP</h2>
        <p className="mt-1 text-sm text-neutral-600">Quản lý hồ sơ theo từng cơ sở; tập hợp tài liệu và kiểm soát thành phần trước khi thẩm định nội dung.</p></div>
      <button onClick={() => setShowCreate(v => !v)} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"><Plus className="mr-1 inline h-4 w-4"/> Tạo hồ sơ</button>
    </div>

    {showCreate && <section className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
      <h3 className="font-semibold">Thông tin hồ sơ mới</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">Tên cơ sở *<input value={facilityName} onChange={e=>setFacilityName(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
        <label className="text-sm">Người đại diện<input value={representative} onChange={e=>setRepresentative(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
        <label className="text-sm md:col-span-2">Địa chỉ cơ sở *<input value={address} onChange={e=>setAddress(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
        <label className="text-sm">Loại hình cơ sở<select value={facilityType} onChange={e=>setFacilityType(e.target.value)} className="mt-1 w-full rounded-lg border p-2"><option>Chưa phân loại</option><option>Sản xuất ban đầu</option><option>Sơ chế</option><option>Chế biến</option><option>Bảo quản</option><option>Kinh doanh</option><option>Dịch vụ ăn uống</option><option>Hỗn hợp nhiều công đoạn</option></select></label>
        <label className="text-sm">Thủ tục<select value={procedure} onChange={e=>setProcedure(e.target.value)} className="mt-1 w-full rounded-lg border p-2"><option>Cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP</option><option>Cấp lại Giấy chứng nhận</option><option>Kiểm tra điều kiện ATTP</option><option>Rà soát hồ sơ khác</option></select></label>
      </div>
      <div className="flex gap-2"><button onClick={createDossier} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Lưu hồ sơ làm việc</button><button onClick={()=>setShowCreate(false)} className="rounded-lg border px-4 py-2 text-sm">Hủy</button></div>
    </section>}

    {isLoading ? <div className="rounded-xl border bg-white p-10 text-center text-sm text-neutral-500">Đang tải dữ liệu hồ sơ...</div> : dossiers.length === 0 ? <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center">
      <FolderOpen className="mx-auto h-10 w-10 text-neutral-400"/><h3 className="mt-3 font-semibold">Chưa có hồ sơ ATTP</h3>
      <p className="mt-1 text-sm text-neutral-500">Tạo hồ sơ theo từng cơ sở để bắt đầu tập hợp tài liệu.</p>
    </div> : <div className="grid gap-4 lg:grid-cols-12">
      <aside className="space-y-2 lg:col-span-4">
        {dossiers.map(d=><button key={d.id} onClick={()=>setSelectedId(d.id)} className={`w-full rounded-xl border p-3 text-left ${selected?.id===d.id?'border-emerald-600 bg-emerald-50':'border-neutral-200 bg-white'}`}>
          <div className="text-xs font-semibold text-emerald-800">{d.code}</div><div className="mt-1 font-semibold">{d.facilityName}</div><div className="mt-1 text-xs text-neutral-500">{d.facilityType} · {d.documents.length} tệp</div>
        </button>)}
      </aside>
      {selected && <section className="space-y-4 lg:col-span-8">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-xs font-semibold text-emerald-800">{selected.code}</div><h3 className="text-lg font-bold">{selected.facilityName}</h3><p className="text-sm text-neutral-600">{selected.address}</p><p className="text-xs text-neutral-500">{selected.procedure} · {selected.facilityType}</p></div>
            <button onClick={()=>inputRef.current?.click()} className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white"><FilePlus2 className="mr-1 inline h-4 w-4"/> Thêm tài liệu</button>
            <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.txt,.md,.csv,.jpg,.jpeg,.png,.webp,.bmp,.tif,.tiff,application/pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={e=>void addFiles(e.target.files)}/>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-neutral-50 p-3"><div className="text-xl font-bold">{stats.total}</div><div className="text-xs text-neutral-500">Đầu mục</div></div>
            <div className="rounded-lg bg-neutral-50 p-3"><div className="text-xl font-bold">{stats.matched}</div><div className="text-xs text-neutral-500">Đã gắn tài liệu</div></div>
            <div className="rounded-lg bg-amber-50 p-3"><div className="text-xl font-bold text-amber-800">{stats.missing}</div><div className="text-xs text-amber-800">Đầu mục bắt buộc chưa có</div></div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
          <div className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-emerald-700"/><h3 className="font-semibold">Danh mục kiểm soát tài liệu</h3></div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="mr-1 inline h-4 w-4"/> Đây là danh mục khung để tổ chức công việc, không phải danh mục thành phần hồ sơ pháp lý áp dụng mặc định. Công chức phải xác định yêu cầu theo thủ tục, loại hình và văn bản hiện hành trước khi kết luận thiếu hồ sơ.</div>
          {selected.checklist.map(item=><div key={item.id} className="grid gap-2 border-b border-neutral-100 py-2 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7"><div className="text-xs text-neutral-500">{item.group} · {item.required?'Bắt buộc trong khung rà soát':'Bổ sung'}</div><div className="text-sm font-medium">{item.label}</div></div>
            <div className="md:col-span-5"><select multiple value={item.documentIds} onChange={e=>updateChecklist(item.id, Array.from(e.target.selectedOptions).map(option=>option.value))} className="w-full min-h-20 rounded-lg border border-neutral-200 p-2 text-xs">{selected.documents.map(doc=><option key={doc.id} value={doc.id}>{doc.name}</option>)}</select></div>
          </div>)}
          <div className="grid gap-2 md:grid-cols-12"><input value={newChecklistGroup} onChange={e=>setNewChecklistGroup(e.target.value)} placeholder="Nhóm tài liệu" className="rounded-lg border p-2 text-sm md:col-span-3"/><input value={newChecklistLabel} onChange={e=>setNewChecklistLabel(e.target.value)} placeholder="Thêm đầu mục cần kiểm soát" className="rounded-lg border p-2 text-sm md:col-span-7"/><button onClick={addChecklistItem} className="rounded-lg border px-3 py-2 text-sm md:col-span-2"><Plus className="mr-1 inline h-4 w-4"/> Thêm</button></div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
          <h3 className="font-semibold">Tài liệu đã tiếp nhận ({selected.documents.length})</h3>
          {selected.documents.length===0 ? <p className="text-sm text-neutral-500">Chưa có tài liệu. Chọn “Thêm tài liệu” để tải lên.</p> : selected.documents.map(doc=><div key={doc.id} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 p-3"><div className="min-w-0"><div className="truncate text-sm font-medium"><FileText className="mr-1 inline h-4 w-4"/>{doc.name}</div><div className="text-xs text-neutral-500">{Math.ceil(doc.size/1024)} KB · {doc.parseMessage}</div></div><button onClick={()=>removeDocument(doc.id)} title="Gỡ tài liệu" className="rounded p-2 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4"/></button></div>)}
        </div>
      </section>}
    </div>}

    <div role="status" className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600"><Search className="mr-1 inline h-4 w-4"/>{notice}</div>
  </div>;
};
