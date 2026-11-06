import React, { useMemo, useRef, useState } from 'react';
import { FilePlus2, FolderOpen, ClipboardCheck, AlertTriangle, Trash2, Plus, Search, FileText } from 'lucide-react';

type DossierDocument = { id: string; name: string; size: number; type: string; text: string; addedAt: string };
type ChecklistItem = { id: string; label: string; group: string; required: boolean; documentId?: string };
type Dossier = {
  id: string; code: string; facilityName: string; representative: string; address: string;
  facilityType: string; procedure: string; createdAt: string; documents: DossierDocument[]; checklist: ChecklistItem[];
};

const DEFAULT_CHECKLIST: Omit<ChecklistItem, 'id'>[] = [
  { group: 'Thông tin và pháp lý cơ sở', label: 'Tài liệu xác định thông tin, tư cách pháp lý của cơ sở', required: true },
  { group: 'Địa điểm và mặt bằng', label: 'Tài liệu về địa điểm, mặt bằng và bố trí khu vực hoạt động', required: true },
  { group: 'Nhân sự', label: 'Tài liệu về người trực tiếp sản xuất, kinh doanh và phân công trách nhiệm', required: true },
  { group: 'Trang thiết bị', label: 'Tài liệu về máy móc, thiết bị, dụng cụ phục vụ hoạt động', required: true },
  { group: 'Quy trình hoạt động', label: 'Mô tả quy trình sản xuất, sơ chế, chế biến, bảo quản hoặc kinh doanh', required: true },
  { group: 'Kiểm soát an toàn thực phẩm', label: 'Tài liệu về kiểm soát nguyên liệu, vệ sinh, nước và phòng ngừa nguy cơ', required: true },
  { group: 'Tài liệu khác', label: 'Tài liệu khác theo yêu cầu của thủ tục và loại hình cơ sở', required: false },
];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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
  const [notice, setNotice] = useState('Dữ liệu đang lưu tạm trong phiên làm việc của trình duyệt; chưa đồng bộ lên máy chủ.');
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = dossiers.find(d => d.id === selectedId) || dossiers[0];

  const stats = useMemo(() => {
    const items = selected?.checklist || [];
    const required = items.filter(i => i.required);
    const matched = items.filter(i => i.documentId);
    return { total: items.length, required: required.length, matched: matched.length, missing: required.filter(i => !i.documentId).length };
  }, [selected]);

  const createDossier = () => {
    if (!facilityName.trim() || !address.trim()) {
      setNotice('Cần nhập tên cơ sở và địa chỉ để tạo hồ sơ.');
      return;
    }
    const id = uid();
    const dossier: Dossier = {
      id, code: `ATTP-${new Date().getFullYear()}-${String(dossiers.length + 1).padStart(4, '0')}`,
      facilityName: facilityName.trim(), representative: representative.trim(), address: address.trim(),
      facilityType, procedure, createdAt: new Date().toLocaleString('vi-VN'),
      documents: [], checklist: DEFAULT_CHECKLIST.map(item => ({ ...item, id: uid() })),
    };
    setDossiers(prev => [dossier, ...prev]);
    setSelectedId(id); setShowCreate(false);
    setFacilityName(''); setRepresentative(''); setAddress('');
    setNotice('Đã tạo hồ sơ làm việc. Danh mục tài liệu mặc định là khung rà soát nghiệp vụ, chưa thay thế danh mục pháp lý áp dụng cho từng thủ tục.');
  };

  const addFiles = async (files: FileList | null) => {
    if (!selected || !files?.length) return;
    const additions: DossierDocument[] = [];
    for (const file of Array.from(files)) {
      let text = '';
      const lower = file.name.toLowerCase();
      try {
        if (lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.csv')) text = await file.text();
        else if (lower.endsWith('.docx')) {
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
          text = result.value || '';
        }
      } catch { text = ''; }
      additions.push({ id: uid(), name: file.name, size: file.size, type: file.type || 'Không xác định', text, addedAt: new Date().toLocaleString('vi-VN') });
    }
    setDossiers(prev => prev.map(d => d.id === selected.id ? { ...d, documents: [...d.documents, ...additions] } : d));
    setNotice(`Đã tiếp nhận ${additions.length} tệp. PDF và tệp scan cần bổ sung bộ trích xuất/OCR ở bước kỹ thuật tiếp theo; hiện chưa đọc nội dung các định dạng đó trong mô-đun này.`);
    if (inputRef.current) inputRef.current.value = '';
  };

  const updateChecklist = (itemId: string, documentId: string) => {
    if (!selected) return;
    setDossiers(prev => prev.map(d => d.id === selected.id ? {
      ...d, checklist: d.checklist.map(item => item.id === itemId ? { ...item, documentId: documentId || undefined } : item)
    } : d));
  };

  const addChecklistItem = () => {
    if (!selected || !newChecklistLabel.trim()) return;
    setDossiers(prev => prev.map(d => d.id === selected.id ? {
      ...d, checklist: [...d.checklist, { id: uid(), group: newChecklistGroup, label: newChecklistLabel.trim(), required: false }]
    } : d));
    setNewChecklistLabel('');
  };

  const removeDocument = (documentId: string) => {
    if (!selected) return;
    setDossiers(prev => prev.map(d => d.id === selected.id ? {
      ...d, documents: d.documents.filter(doc => doc.id !== documentId),
      checklist: d.checklist.map(item => item.documentId === documentId ? { ...item, documentId: undefined } : item)
    } : d));
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

    {dossiers.length === 0 ? <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center">
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
            <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.doc,.txt,.md,.csv" className="hidden" onChange={e=>void addFiles(e.target.files)}/>
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
            <div className="md:col-span-5"><select value={item.documentId||''} onChange={e=>updateChecklist(item.id,e.target.value)} className="w-full rounded-lg border border-neutral-200 p-2 text-xs"><option value="">Chưa gắn tài liệu</option>{selected.documents.map(doc=><option key={doc.id} value={doc.id}>{doc.name}</option>)}</select></div>
          </div>)}
          <div className="grid gap-2 md:grid-cols-12"><input value={newChecklistGroup} onChange={e=>setNewChecklistGroup(e.target.value)} placeholder="Nhóm tài liệu" className="rounded-lg border p-2 text-sm md:col-span-3"/><input value={newChecklistLabel} onChange={e=>setNewChecklistLabel(e.target.value)} placeholder="Thêm đầu mục cần kiểm soát" className="rounded-lg border p-2 text-sm md:col-span-7"/><button onClick={addChecklistItem} className="rounded-lg border px-3 py-2 text-sm md:col-span-2"><Plus className="mr-1 inline h-4 w-4"/> Thêm</button></div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
          <h3 className="font-semibold">Tài liệu đã tiếp nhận ({selected.documents.length})</h3>
          {selected.documents.length===0 ? <p className="text-sm text-neutral-500">Chưa có tài liệu. Chọn “Thêm tài liệu” để tải lên.</p> : selected.documents.map(doc=><div key={doc.id} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 p-3"><div className="min-w-0"><div className="truncate text-sm font-medium"><FileText className="mr-1 inline h-4 w-4"/>{doc.name}</div><div className="text-xs text-neutral-500">{Math.ceil(doc.size/1024)} KB · {doc.text ? `${doc.text.length.toLocaleString('vi-VN')} ký tự đã trích xuất` : 'Chưa trích xuất nội dung trong mô-đun này'}</div></div><button onClick={()=>removeDocument(doc.id)} title="Gỡ tài liệu" className="rounded p-2 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4"/></button></div>)}
        </div>
      </section>}
    </div>}

    <div role="status" className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600"><Search className="mr-1 inline h-4 w-4"/>{notice}</div>
  </div>;
};
