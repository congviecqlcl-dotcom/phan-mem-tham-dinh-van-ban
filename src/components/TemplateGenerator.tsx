import React, { useState } from 'react';
import { FileCheck2, Copy, Download, Check, RefreshCw, Sparkles, Building2, Calendar, FileText, Loader2, Scale } from 'lucide-react';
import { downloadFixedAsWord } from '../utils/docxExport';

export const TemplateGenerator: React.FC = () => {
  const [templateType, setTemplateType] = useState<string>('quyet_dinh_doan_tham_dinh');
  const [agencyName, setAgencyName] = useState<string>('SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG');
  const [subAgencyName, setSubAgencyName] = useState<string>('CHI CỤC CHẤT LƯỢNG, CHẾ BIẾN VÀ PHÁT TRIỂN THỊ TRƯỜNG');
  const [province, setProvince] = useState<string>('Phú Thọ');
  const [company1, setCompany1] = useState<string>('Công ty TNHH Đào Lượng');
  const [address1, setAddress1] = useState<string>('Thôn Phú Nông, xã Vĩnh An, tỉnh Phú Thọ');
  const [taxCode1, setTaxCode1] = useState<string>('2500730505');
  const [products1, setProducts1] = useState<string>('Rau củ quả; thịt lợn, thịt bò, thịt gà, thủy sản, trứng gia cầm; đậu phụ, giò, chả; gạo');
  
  const [company2, setCompany2] = useState<string>('Công ty TNHH Thực phẩm Hoàng Duyên');
  const [address2, setAddress2] = useState<string>('Thôn Hạ Ích, xã Tiên Lữ, tỉnh Phú Thọ');
  const [taxCode2, setTaxCode2] = useState<string>('2500778666');
  const [products2, setProducts2] = useState<string>('Rau củ quả; thịt lợn, thịt gà; giò, chả; hoa quả; thủy hải sản; gạo, đỗ, lạc; trứng gia cầm; đậu phụ');

  const [leaderName, setLeaderName] = useState<string>('Nguyễn Anh Tuấn');
  const [leaderTitle, setLeaderTitle] = useState<string>('Phó Chi cục trưởng, Chi cục Chất lượng, Chế biến và Phát triển thị trường');
  const [signName, setSignName] = useState<string>('Đặng Việt Thắng');
  const [signTitle, setSignTitle] = useState<string>('KT. GIÁM ĐỐC\nPHÓ GIÁM ĐỐC');
  const [deadlineDate, setDeadlineDate] = useState<string>('08/9/2026');

  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);

  const generateOutputText = () => {
    if (templateType === 'quyet_dinh_doan_tham_dinh') {
      return `UBND TỈNH ${province.toUpperCase()}
${agencyName.toUpperCase()}
─────────────
Số:      /QĐ-SNN&MT
(Dự thảo)

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
─────────────────────────
${province}, ngày    tháng 8 năm 2026

QUYẾT ĐỊNH
Về việc thành lập Đoàn thẩm định điều kiện bảo đảm an toàn thực phẩm đối với ${company1} và ${company2}
────────────────────

GIÁM ĐỐC SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG

   Căn cứ Luật An toàn thực phẩm ngày 17 tháng 6 năm 2010;
   Căn cứ Nghị định số 15/2018/NĐ-CP ngày 02 tháng 02 năm 2018 của Chính phủ quy định chi tiết thi hành một số điều của Luật An toàn thực phẩm;
   Căn cứ Thông tư số 38/2018/TT-BNNPTNT ngày 25 tháng 12 năm 2018 của Bộ trưởng Bộ Nông nghiệp và Phát triển nông thôn; Thông tư số 17/2024/TT-BNNPTNT ngày 28 tháng 11 năm 2024 của Bộ trưởng Bộ Nông nghiệp và Phát triển nông thôn sửa đổi, bổ sung một số Thông tư quy định thẩm định, chứng nhận cơ sở sản xuất, kinh doanh thực phẩm nông, lâm, thủy sản đủ điều kiện bảo đảm an toàn thực phẩm thuộc phạm vi quản lý của Bộ Nông nghiệp và Phát triển nông thôn;
   Căn cứ Quyết định số 09/2025/QĐ-UBND ngày 01 tháng 7 năm 2025 của Ủy ban nhân dân tỉnh quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Sở Nông nghiệp và Môi trường tỉnh Phú Thọ;
   Căn cứ Quyết định số 548/QĐ-UBND ngày 06 tháng 8 năm 2025 của Ủy ban nhân dân tỉnh về việc công bố Danh mục thủ tục hành chính được sửa đổi, bổ sung lĩnh vực Quản lý chất lượng Nông lâm sản và Thủy sản; Quyết định số 1046/QĐ-UBND ngày 18 tháng 9 năm 2025 của Chủ tịch Ủy ban nhân dân tỉnh Phú Thọ về việc ủy quyền cho Giám đốc Sở Nông nghiệp và Môi trường; Chủ tịch Ủy ban nhân dân xã, phường thực hiện nhiệm vụ lĩnh vực quản lý chất lượng nông lâm sản và thủy sản thuộc thẩm quyền của Chủ tịch Ủy ban nhân dân tỉnh Phú Thọ; Quyết định số 1091/QĐ-UBND ngày 22 tháng 9 năm 2025 của Ủy ban nhân dân tỉnh về việc phê duyệt quy trình nội bộ giải quyết thủ tục hành chính lĩnh vực Quản lý chất lượng nông lâm sản và thủy sản thuộc thẩm quyền giải quyết của các cấp chính quyền trên địa bàn tỉnh Phú Thọ;
   Căn cứ Hồ sơ đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm của ${company1} và ${company2};
   Theo đề nghị của Chi cục trưởng Chi cục Chất lượng, Chế biến và Phát triển thị trường tại Tờ trình số   /TTr-CLCB ngày   tháng 8 năm 2026 và Trưởng phòng Tổ chức cán bộ.

QUYẾT ĐỊNH:

   Điều 1. Thành lập Đoàn thẩm định điều kiện bảo đảm an toàn thực phẩm (ATTP) đối với ${company1} và ${company2}, gồm các ông (bà) có tên sau:
   1. Ông ${leaderName} - ${leaderTitle} - Trưởng đoàn;
   2. Bà Nguyễn Thị Hoài Thu - Phó Trạm trưởng Trạm Quản lý chất lượng khu vực II, Chi cục Chất lượng, Chế biến và Phát triển thị trường - Thành viên;
   3. Bà Lê Thị Vinh Thành - Chuyên viên Trạm Quản lý chất lượng khu vực II, Chi cục Chất lượng, Chế biến và Phát triển thị trường - Thành viên;
   4. Bà Trần Lê Thùy Dương - Viên chức Trạm Quản lý chất lượng khu vực II, Chi cục Chất lượng, Chế biến và Phát triển thị trường - Thành viên.

   Điều 2. Nội dung và thời gian thẩm định:
   1. Hồ sơ pháp lý: Xem xét, đánh giá hồ sơ, tài liệu lưu và các giấy tờ có liên quan.
   2. Kiểm tra, đánh giá thực tế điều kiện bảo đảm an toàn thực phẩm tại cơ sở bao gồm: nhà xưởng, trang thiết bị, nguồn nhân lực tham gia sản xuất kinh doanh, chương trình quản lý an toàn thực phẩm, truy xuất nguồn gốc và thu hồi, xử lý sản phẩm không bảo đảm an toàn.
   3. Lấy mẫu phân tích đánh giá các chỉ tiêu về an toàn thực phẩm (nếu cần).
   4. Thời gian thẩm định cụ thể: Do Trưởng đoàn quyết định và thông báo trước bằng văn bản cho cơ sở ít nhất 05 ngày làm việc.

   Điều 3. Nhiệm vụ của Đoàn thẩm định:
   - Căn cứ Hồ sơ đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP, Đoàn thẩm định tiến hành thẩm định trực tiếp tại:
   + ${company1} (địa chỉ: ${address1}); Mã số doanh nghiệp: ${taxCode1}; Mặt hàng kinh doanh: ${products1}.
   + ${company2} (địa chỉ: ${address2}); Mã số doanh nghiệp: ${taxCode2}; Mặt hàng kinh doanh: ${products2}.
   - Báo cáo kết quả thẩm định trước ngày ${deadlineDate}, chịu trách nhiệm trước Giám đốc Sở và trước pháp luật về kết quả thẩm định.
   - Tham mưu Giám đốc Sở quyết định cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP cho cơ sở nếu cơ sở đáp ứng đầy đủ điều kiện (xếp loại Đạt).
   - Đoàn thẩm định tự giải tán sau khi hoàn thành nhiệm vụ.

   Điều 4. Trách nhiệm của cơ sở được thẩm định:
   - Cơ sở được thẩm định có trách nhiệm bố trí người có thẩm quyền đại diện cho cơ sở để làm việc với Đoàn thẩm định; cung cấp đầy đủ thông tin, hồ sơ, tài liệu có liên quan và mẫu sản phẩm khi có yêu cầu.
   - Khắc phục đầy đủ các chỉ tiêu, điểm không phù hợp (nếu có) và gửi báo cáo khắc phục kèm bằng chứng về cơ quan thẩm định trong thời hạn tối đa không quá 30 ngày.
   - Được quyền khiếu nại với cơ quan thẩm định theo quy định của pháp luật trong trường hợp không nhất trí với kết quả thẩm định.
   - Thông báo cho cơ quan thẩm định trong trường hợp tạm dừng sản xuất kinh doanh, giải thể, thay đổi địa điểm hoặc thay đổi chủ sở hữu.

   Điều 5. Chi cục trưởng Chi cục Chất lượng, Chế biến và Phát triển thị trường, Chánh Văn phòng Sở, các ông (bà) có tên tại Điều 1, ${company1} và ${company2} căn cứ Quyết định thi hành./.

Nơi nhận:
- Như Điều 5;
- Giám đốc, các Phó Giám đốc Sở;
- Văn phòng Sở;
- Chi cục Chất lượng, Chế biến và Phát triển thị trường;
- Lưu: VT, TCCB (03 bản).

${signTitle}
(Chữ ký, dấu)

${signName}`;
    }

    if (templateType === 'to_trinh_thanh_lap_doan') {
      return `${agencyName.toUpperCase()}
${subAgencyName.toUpperCase()}
─────────────
Số:       /TTr-CLCB

CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
─────────────────────────
${province}, ngày    tháng 8 năm 2026

TỜ TRÌNH
Về việc đề nghị ban hành Quyết định thành lập Đoàn thẩm định cấp giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm đối với ${company1} và ${company2}
────────────────────

Kính gửi: ${agencyName}.

   Căn cứ Luật An toàn thực phẩm ngày 17 tháng 6 năm 2010;
   Căn cứ Nghị định số 15/2018/NĐ-CP ngày 02 tháng 02 năm 2018 của Chính phủ quy định chi tiết thi hành một số điều của Luật An toàn thực phẩm;
   Căn cứ Thông tư số 38/2018/TT-BNNPTNT ngày 25 tháng 12 năm 2018 của Bộ trưởng Bộ Nông nghiệp và Phát triển nông thôn; Thông tư số 17/2024/TT-BNNPTNT ngày 28 tháng 11 năm 2024 của Bộ trưởng Bộ Nông nghiệp và Phát triển nông thôn sửa đổi, bổ sung một số Thông tư quy định thẩm định, chứng nhận cơ sở sản xuất, kinh doanh thực phẩm nông, lâm, thủy sản đủ điều kiện bảo đảm an toàn thực phẩm thuộc phạm vi quản lý của Bộ Nông nghiệp và Phát triển nông thôn;
   Căn cứ Quyết định số 09/2025/QĐ-UBND ngày 01 tháng 7 năm 2025 của Ủy ban nhân dân tỉnh quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Sở Nông nghiệp và Môi trường tỉnh Phú Thọ;
   Căn cứ Hồ sơ đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm của ${company1} và ${company2};

   Chi cục Chất lượng, Chế biến và Phát triển thị trường đã tiến hành thẩm tra tính hợp lệ của hồ sơ và xây dựng dự thảo Quyết định thành lập Đoàn thẩm định điều kiện bảo đảm an toàn thực phẩm đối với 02 cơ sở nêu trên.

   (Dự thảo Quyết định gửi kèm theo)

   Chi cục Chất lượng, Chế biến và Phát triển thị trường kính trình Giám đốc ${agencyName} xem xét, ký ban hành Quyết định để Chi cục có căn cứ tổ chức thực hiện./.

Nơi nhận:
- Như trên;
- Phòng TCCB Sở;
- Lãnh đạo Chi cục;
- Lưu: VT, CLCB (02 bản).

CHI CỤC TRƯỞNG
(Chữ ký, đóng dấu)

Nguyễn Thành Chung`;
    }

    return `Vui lòng chọn mẫu biểu phù hợp.`;
  };

  const outputText = generateOutputText();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = async () => {
    setIsExportingWord(true);
    try {
      await downloadFixedAsWord(outputText, `${templateType}_chuan_ND30.docx`);
    } catch (err) {
      console.error('Lỗi xuất file Word:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${templateType}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-700" />
            Trình Tạo Mẫu Văn Bản Chuẩn 100% (NĐ 30/2020 & TT 17/2024)
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Nhập thông tin cơ quan, doanh nghiệp để tự động xuất ra văn bản hành chính đúng chuẩn pháp lý, căn cứ và dấu câu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">Loại văn bản mẫu:</label>
            <select
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
            >
              <option value="quyet_dinh_doan_tham_dinh">1. Quyết định thành lập Đoàn thẩm định ATTP (Sở/Chi cục)</option>
              <option value="to_trinh_thanh_lap_doan">2. Tờ trình đề nghị thành lập Đoàn thẩm định ATTP</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600">Cơ quan ban hành:</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600">Tỉnh / Thành phố:</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-800"
              />
            </div>
          </div>

          {/* Company 1 */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Doanh nghiệp 1:
            </div>
            <input
              type="text"
              placeholder="Tên công ty"
              value={company1}
              onChange={(e) => setCompany1(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800"
            />
            <input
              type="text"
              placeholder="Địa chỉ mới (theo NQ 1676/2025)"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800"
            />
            <input
              type="text"
              placeholder="Mã số DN"
              value={taxCode1}
              onChange={(e) => setTaxCode1(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800"
            />
          </div>

          {/* Company 2 */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <div className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Doanh nghiệp 2:
            </div>
            <input
              type="text"
              placeholder="Tên công ty"
              value={company2}
              onChange={(e) => setCompany2(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800"
            />
            <input
              type="text"
              placeholder="Địa chỉ mới"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800"
            />
            <input
              type="text"
              placeholder="Mã số DN"
              value={taxCode2}
              onChange={(e) => setTaxCode2(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600">Trưởng đoàn:</label>
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600">Hạn báo cáo:</label>
              <input
                type="text"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-800"
              />
            </div>
          </div>
        </div>

        {/* Live Preview & Output (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Văn bản đã tạo đúng chuẩn thể thức
              </h3>
              <p className="text-xs text-neutral-500">
                Sẵn sàng ký ban hành hoặc sao chép vào phần mềm văn thư điều hành.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-download-word-template"
                disabled={isExportingWord}
                onClick={handleDownloadWord}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-neutral-400 text-white text-xs font-semibold transition shadow-sm"
                title="Tải văn bản mẫu dạng Microsoft Word (.docx) chuẩn Nghị định 30/2020: Lề trái 3cm, lề phải/trên/dưới 2cm"
              >
                {isExportingWord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{isExportingWord ? 'Đang tạo Word...' : 'Tải file Word (.DOCX) chuẩn NĐ 30'}</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium transition border border-neutral-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>File .txt</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-neutral-50 p-4 rounded-xl border border-neutral-200 font-mono text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[550px]">
            {outputText}
          </div>
        </div>
      </div>
    </div>
  );
};
