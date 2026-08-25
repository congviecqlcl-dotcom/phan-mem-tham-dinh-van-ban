import { LegalDocument } from '../types';

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'luat-55-2010',
    code: 'Luật số 55/2010/QH12',
    title: 'Luật An toàn thực phẩm',
    issuedDate: '17/06/2010',
    effectiveDate: '01/07/2011',
    issuer: 'Quốc hội nước CHXHCN Việt Nam',
    category: 'ATTP',
    summary: 'Đạo luật cao nhất điều chỉnh quyền và nghĩa vụ trong bảo đảm an toàn thực phẩm; điều kiện bảo đảm ATTP đối với sản xuất, kinh doanh, xuất nhập khẩu; quảng cáo, ghi nhãn; kiểm nghiệm; phòng ngừa và khắc phục sự cố ATTP.',
    keyArticles: [
      {
        article: 'Điều 2',
        title: 'Giải thích từ ngữ ATTP',
        content: 'Quy định các khái niệm: An toàn thực phẩm, Chế biến thực phẩm, Cơ sở kinh doanh dịch vụ ăn uống, Điều kiện bảo đảm ATTP, Thực phẩm tươi sống, Thực phẩm chức năng, Thực phẩm biến đổi gen, Thức ăn đường phố, Truy xuất nguồn gốc...'
      },
      {
        article: 'Điều 5',
        title: 'Những hành vi bị cấm',
        content: 'Cấm sử dụng nguyên liệu không thuộc loại dùng cho thực phẩm; nguyên liệu quá hạn, không rõ nguồn gốc; sử dụng phụ gia hóa chất cấm/vượt giới hạn; dùng động vật chết do bệnh; kinh doanh thực phẩm không rõ xuất xứ, chưa đăng ký bản công bố hợp quy...'
      },
      {
        article: 'Điều 34 - 37',
        title: 'Cấp và thu hồi Giấy chứng nhận cơ sở đủ điều kiện ATTP',
        content: 'Quy định đối tượng, điều kiện cấp, thẩm quyền và hồ sơ, thủ tục cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm. Thời hạn hiệu lực của Giấy chứng nhận là 03 năm. Nộp hồ sơ xin cấp lại trước 06 tháng trước khi hết hạn.'
      },
      {
        article: 'Điều 54 - 55',
        title: 'Truy xuất nguồn gốc, thu hồi và xử lý thực phẩm không bảo đảm an toàn',
        content: 'Truy xuất nguồn gốc thực hiện khi có yêu cầu hoặc khi phát hiện thực phẩm không an toàn. Thu hồi gồm tự nguyện và bắt buộc. Hình thức xử lý: Khắc phục lỗi sản phẩm/lỗi ghi nhãn; Chuyển mục đích sử dụng; Tái xuất; Tiêu hủy.'
      },
      {
        article: 'Điều 61 - 65',
        title: 'Trách nhiệm quản lý nhà nước về ATTP',
        content: 'Phân công trách nhiệm quản lý nhà nước giữa Bộ Y tế (chịu trách nhiệm trước Chính phủ), Bộ Nông nghiệp & PTNT, Bộ Công Thương và UBND các cấp.'
      }
    ]
  },
  {
    id: 'nd-15-2018',
    code: 'Nghị định số 15/2018/NĐ-CP',
    title: 'Quy định chi tiết thi hành một số điều của Luật An toàn thực phẩm',
    issuedDate: '02/02/2018',
    effectiveDate: '02/02/2018',
    issuer: 'Chính phủ',
    category: 'ATTP',
    summary: 'Quy định chi tiết thủ tục tự công bố sản phẩm, đăng ký bản công bố sản phẩm, miễn cấp Giấy chứng nhận ATTP, kiểm tra nhà nước đối với thực phẩm xuất nhập khẩu, phân công trách nhiệm quản lý giữa Bộ Y tế, Bộ NN&PTNT và Bộ Công Thương.',
    keyArticles: [
      {
        article: 'Điều 4 - 5',
        title: 'Thủ tục tự công bố sản phẩm',
        content: 'Áp dụng đối với thực phẩm đã qua chế biến bao gói sẵn, phụ gia, chất hỗ trợ chế biến, dụng cụ bao gói tiếp xúc trực tiếp. Hồ sơ gồm Bản tự công bố (Mẫu 01) và Phiếu kiểm nghiệm còn hạn 12 tháng từ phòng kiểm nghiệm đạt chuẩn ISO 17025.'
      },
      {
        article: 'Điều 6 - 8',
        title: 'Thủ tục đăng ký bản công bố sản phẩm',
        content: 'Bắt buộc đối với Thực phẩm bảo vệ sức khỏe, TPDDYH, TP cho chế độ ăn đặc biệt, SP dinh dưỡng cho trẻ đến 36 tháng tuổi, Phụ gia hỗn hợp công dụng mới. Nộp tại Bộ Y tế hoặc cơ quan do UBND cấp tỉnh chỉ định.'
      },
      {
        article: 'Điều 12',
        title: 'Cơ sở không thuộc diện cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP',
        content: 'Bao gồm 10 nhóm: a) Sản xuất ban đầu nhỏ lẻ; b) SXKD không có địa điểm cố định; c) Sơ chế nhỏ lẻ; d) Kinh doanh thực phẩm nhỏ lẻ; đ) Kinh doanh thực phẩm bao gói sẵn; e) SXKD dụng cụ, vật liệu bao gói; g) Nhà hàng trong khách sạn; h) Bếp ăn tập thể không ĐKKD thực phẩm; i) Kinh doanh thức ăn đường phố; k) Cơ sở đã có GMP, HACCP, ISO 22000, IFS, BRC, FSSC 22000 còn hiệu lực.'
      },
      {
        article: 'Điều 13 - 19',
        title: 'Kiểm tra nhà nước về ATTP nhập khẩu',
        content: 'Quy định 3 phương thức kiểm tra: Giảm (kiểm tra hồ sơ tối đa 5% ngẫu nhiên), Thông thường (kiểm tra hồ sơ), Chặt (kiểm tra hồ sơ kết hợp lấy mẫu kiểm nghiệm). Miễn kiểm tra đối với SP đã có Giấy tiếp nhận bản công bố, hàng quà biếu, ngoại giao, quá cảnh...'
      },
      {
        article: 'Điều 36 - 40 & Phụ lục II, III, IV',
        title: 'Phân công trách nhiệm quản lý nhà nước về ATTP',
        content: 'Nguyên tắc một cửa, một sản phẩm, một cơ sở chỉ chịu sự quản lý của một cơ quan. Phụ lục II: Danh mục của Bộ Y tế; Phụ lục III: Danh mục của Bộ Nông nghiệp & PTNT; Phụ lục IV: Danh mục của Bộ Công Thương.'
      }
    ]
  },
  {
    id: 'tt-17-2024',
    code: 'Thông tư số 17/2024/TT-BNNPTNT',
    title: 'Sửa đổi, bổ sung một số Thông tư quy định thẩm định, chứng nhận cơ sở SXKD thực phẩm nông, lâm, thủy sản đủ điều kiện ATTP',
    issuedDate: '28/11/2024',
    effectiveDate: '15/01/2025',
    issuer: 'Bộ Nông nghiệp và Phát triển nông thôn',
    category: 'ATTP',
    summary: 'VĂN BẢN MỚI QUAN TRỌNG: Sửa đổi toàn diện Thông tư 38/2018/TT-BNNPTNT và Thông tư 48/2013/TT-BNNPTNT. Bãi bỏ phân loại hạng A, B, C chuyển sang "Đạt" hoặc "Không đạt"; bãi bỏ cấp giấy xác nhận kiến thức ATTP của cơ quan nhà nước chuyển cho chủ cơ sở tự tổ chức xác nhận; giảm thời hạn khắc phục sai lỗi tối đa còn 30 ngày; cập nhật thẩm quyền Cục Chất lượng, Chế biến và Phát triển thị trường.',
    keyArticles: [
      {
        article: 'Điều 1 Khoản 9 (sửa đổi Điều 8 TT 38)',
        title: 'Bỏ xếp loại A/B/C - Chỉ phân loại Đạt hoặc Không đạt',
        content: 'Cơ sở đáp ứng đầy đủ yêu cầu được xếp loại "Đạt". Cơ sở chưa đáp ứng hoặc còn điểm không phù hợp không thể khắc phục trong thời hạn yêu cầu xếp loại "Không đạt".'
      },
      {
        article: 'Điều 1 Khoản 14 (sửa đổi Điều 12 TT 38)',
        title: 'Hồ sơ xin cấp Giấy chứng nhận và Giấy xác nhận kiến thức ATTP',
        content: 'Chủ cơ sở tự tổ chức tập huấn kiến thức an toàn thực phẩm cho người trực tiếp sản xuất, kinh doanh và tự ký giấy xác nhận, không cần cơ quan quản lý cấp.'
      },
      {
        article: 'Điều 1 Khoản 16 (sửa đổi Điều 14 TT 38)',
        title: 'Thời hạn thẩm định tại cơ sở',
        content: 'Thực hiện thẩm định tại cơ sở trong vòng 15 ngày làm việc kể từ ngày nhận đủ hồ sơ hợp lệ. Thông báo thời điểm thẩm định trước 05 ngày làm việc.'
      },
      {
        article: 'Điều 1 Khoản 20 (sửa đổi Điều 17 TT 38)',
        title: 'Kiểm tra an toàn thực phẩm và thời hạn khắc phục sai lỗi',
        content: 'Tần suất kiểm tra định kỳ không quá 01 lần/cơ sở/năm. Nếu không đạt, cơ sở có trách nhiệm báo cáo kết quả kèm bằng chứng khắc phục trong thời hạn tối đa 30 ngày (trước đây là 3 tháng).'
      },
      {
        article: 'Điều 1 Khoản 5 & Khoản 23',
        title: 'Thẩm quyền cấp GCN Trung ương và Địa phương',
        content: 'Trung ương (Cục Chất lượng Chế biến & PTTT, Cục BVTV, Cục Thú y) quản lý cơ sở xuất khẩu theo yêu cầu đối tác; Địa phương (Sở/Chi cục) quản lý các cơ sở trên địa bàn.'
      }
    ]
  },
  {
    id: 'tt-38-2018',
    code: 'Thông tư số 38/2018/TT-BNNPTNT',
    title: 'Quy định việc thẩm định, chứng nhận cơ sở sản xuất, kinh doanh thực phẩm nông, lâm, thủy sản đủ điều kiện ATTP',
    issuedDate: '25/12/2018',
    effectiveDate: '07/02/2019',
    issuer: 'Bộ Nông nghiệp và Phát triển nông thôn',
    category: 'ATTP',
    summary: 'Văn bản gốc quy định về thẩm định cơ sở, cấp Giấy chứng nhận đủ điều kiện ATTP thuộc Bộ NN&PTNT (Lưu ý: Các nội dung xếp loại A/B/C, cấp GCN kiến thức ATTP, tần suất kiểm tra đã được sửa đổi, bãi bỏ bởi Thông tư 17/2024/TT-BNNPTNT).',
    keyArticles: [
      {
        article: 'Điều 1 - 2',
        title: 'Phạm vi và đối tượng áp dụng',
        content: 'Quy định thẩm định, chứng nhận ATTP đối với cơ sở nông lâm thủy sản (loại trừ các đối tượng quy định tại Điều 12 Nghị định 15/2018).'
      },
      {
        article: 'Điều 17 (Gốc)',
        title: 'Thời hạn hiệu lực của Giấy chứng nhận ATTP',
        content: 'Giấy chứng nhận ATTP có hiệu lực trong thời gian 03 năm kể từ ngày cấp.'
      }
    ]
  },
  {
    id: 'tt-17-2018',
    code: 'Thông tư số 17/2018/TT-BNNPTNT',
    title: 'Quy định phương thức quản lý điều kiện bảo đảm ATTP đối với cơ sở SXKD nông lâm thủy sản không thuộc diện cấp Giấy chứng nhận ATTP',
    issuedDate: '31/10/2018',
    effectiveDate: '01/01/2019',
    issuer: 'Bộ Nông nghiệp và Phát triển nông thôn',
    category: 'ATTP',
    summary: 'Quản lý các cơ sở sản xuất ban đầu nhỏ lẻ, sơ chế nhỏ lẻ, kinh doanh nhỏ lẻ, kinh doanh bao gói sẵn, bán hàng không cố định thông qua hình thức Ký Bản cam kết sản xuất kinh doanh ATTP.',
    keyArticles: [
      {
        article: 'Điều 3 - 4',
        title: 'Phương thức quản lý và Ký cam kết ATTP',
        content: 'Quản lý thông qua ký Bản cam kết (Mẫu Phụ lục I), kiểm tra việc thực hiện nội dung cam kết và xử lý vi phạm. Thời hạn ký cam kết: 03 năm/lần.'
      },
      {
        article: 'Điều 5',
        title: 'Kiểm tra việc thực hiện nội dung đã cam kết',
        content: 'Kiểm tra định kỳ theo kế hoạch hàng năm do UBND phê duyệt (Biên bản Phụ lục II) và kiểm tra đột xuất khi có sự cố hoặc chỉ đạo cấp trên.'
      },
      {
        article: 'Điều 6',
        title: 'Xử lý cơ sở vi phạm cam kết',
        content: 'Lần 1: Nhắc nhở tuân thủ. Lần 2: Công khai việc cơ sở không thực hiện đúng cam kết trên phương tiện thông tin đại chúng. Lần 3 hoặc gây hậu quả nghiêm trọng: Kiến nghị xử lý vi phạm pháp luật hành chính.'
      }
    ]
  },
  {
    id: 'tt-17-2021',
    code: 'Thông tư số 17/2021/TT-BNNPTNT',
    title: 'Quy định về truy xuất nguồn gốc, thu hồi và xử lý thực phẩm không bảo đảm an toàn thuộc Bộ Nông nghiệp và PTNT',
    issuedDate: '20/12/2021',
    effectiveDate: '02/02/2022',
    issuer: 'Bộ Nông nghiệp và Phát triển nông thôn',
    category: 'ATTP',
    summary: 'Quy định nguyên tắc truy xuất nguồn gốc "một bước trước - một bước sau", lưu trữ thông tin lô hàng nhận, lô sản xuất, lô hàng giao; thời gian lưu trữ dữ liệu; quy trình thu hồi tự nguyện và bắt buộc trong 24 giờ.',
    keyArticles: [
      {
        article: 'Điều 3 - 4',
        title: 'Nguyên tắc truy xuất một bước trước - một bước sau',
        content: 'Cơ sở phải lưu giữ thông tin nhận diện cơ sở/công đoạn sản xuất trước và cơ sở/công đoạn sản xuất tiếp theo trong chuỗi. Mã hóa lô hàng sau mỗi công đoạn.'
      },
      {
        article: 'Điều 6',
        title: 'Thời gian lưu trữ thông tin truy xuất',
        content: 'Tối thiểu 06 tháng đối với nông lâm thủy sản tươi sống; 02 năm đối với thực phẩm đông lạnh, chế biến; tối thiểu 12 tháng kể từ ngày hết hạn sử dụng đối với SP có ghi HSD.'
      },
      {
        article: 'Điều 10 - 11',
        title: 'Trình tự thu hồi tự nguyện và bắt buộc',
        content: 'Trong thời gian tối đa 24 giờ kể từ khi phát hiện hoặc có quyết định thu hồi, phải thông báo dừng sản xuất kinh doanh và thực hiện thu hồi. Báo cáo kết quả trong 03 ngày làm việc sau khi kết thúc thu hồi.'
      },
      {
        article: 'Điều 13 - 14',
        title: 'Hình thức xử lý sau thu hồi',
        content: '4 hình thức: Khắc phục lỗi SP/lỗi ghi nhãn; Chuyển mục đích sử dụng; Tái xuất; Tiêu hủy. Thời hạn hoàn thành xử lý tối đa 03 tháng.'
      }
    ]
  },
  {
    id: 'tt-48-2013',
    code: 'Thông tư số 48/2013/TT-BNNPTNT',
    title: 'Quy định về kiểm tra, chứng nhận an toàn thực phẩm thủy sản xuất khẩu',
    issuedDate: '12/11/2013',
    effectiveDate: '26/12/2013',
    issuer: 'Bộ Nông nghiệp và Phát triển nông thôn',
    category: 'ATTP',
    summary: 'Quy định về thẩm định điều kiện ATTP, đưa cơ sở vào Danh sách ưu tiên/Danh sách xuất khẩu và cấp Chứng thư an toàn thực phẩm cho các lô hàng thủy sản xuất khẩu (được sửa đổi bởi TT 17/2024).',
    keyArticles: [
      {
        article: 'Điều 22',
        title: 'Danh sách ưu tiên cơ sở xuất khẩu',
        content: 'Quy định điều kiện xếp hạng ưu tiên (Hạng 1, Hạng 2), chế độ thẩm tra mẫu giám sát định kỳ.'
      },
      {
        article: 'Điều 25 - 28',
        title: 'Cấp Chứng thư cho lô hàng thủy sản xuất khẩu',
        content: 'Mỗi lô hàng được cấp 01 Chứng thư. Thời hạn cấp chứng thư trong vòng 01 ngày làm việc sau khi nhận đủ hồ sơ hợp lệ và kết quả thẩm tra đạt.'
      }
    ]
  },
  {
    id: 'nd-43-2017',
    code: 'Nghị định số 43/2017/NĐ-CP',
    title: 'Nghị định về nhãn hàng hóa',
    issuedDate: '14/04/2017',
    effectiveDate: '01/06/2017',
    issuer: 'Chính phủ',
    category: 'NHAN_HANG_HOA',
    summary: 'Quy định nội dung, vị trí, kích thước, ngôn ngữ và cách ghi nhãn hàng hóa lưu thông tại Việt Nam và hàng hóa nhập khẩu; các nội dung bắt buộc của từng loại hàng hóa tại Phụ lục I.',
    keyArticles: [
      {
        article: 'Điều 5',
        title: 'Kích thước chữ và số trên nhãn',
        content: 'Đối với thực phẩm, phụ gia đóng gói sẵn, chiều cao chữ của các nội dung bắt buộc không được thấp hơn 1,2 mm (với diện tích mặt ghi nhãn < 80cm2 thì không thấp hơn 0,9 mm).'
      },
      {
        article: 'Điều 7 - 8',
        title: 'Ngôn ngữ ghi nhãn và Nhãn phụ',
        content: 'Nội dung bắt buộc phải ghi bằng tiếng Việt. Hàng nhập khẩu có nhãn gốc tiếng nước ngoài phải có nhãn phụ tiếng Việt thể hiện đầy đủ nội dung bắt buộc và giữ nguyên nhãn gốc.'
      },
      {
        article: 'Điều 10',
        title: 'Nội dung bắt buộc chung trên nhãn',
        content: 'a) Tên hàng hóa; b) Tên và địa chỉ của tổ chức, cá nhân chịu trách nhiệm về hàng hóa; c) Xuất xứ hàng hóa; d) Các nội dung bắt buộc khác theo tính chất từng loại hàng hóa tại Phụ lục I.'
      },
      {
        article: 'Điều 14',
        title: 'Ngày sản xuất và Hạn sử dụng',
        content: 'Ghi theo thứ tự ngày, tháng, năm dương lịch. Viết tắt là NSX, HSD hoặc HD. Trường hợp khác phải hướng dẫn rõ (ví dụ: "Xem NSX, HSD ở đáy bao bì").'
      }
    ]
  },
  {
    id: 'nd-111-2021',
    code: 'Nghị định số 111/2021/NĐ-CP',
    title: 'Sửa đổi, bổ sung một số điều Nghị định số 43/2017/NĐ-CP về nhãn hàng hóa',
    issuedDate: '09/12/2021',
    effectiveDate: '15/02/2022',
    issuer: 'Chính phủ',
    category: 'NHAN_HANG_HOA',
    summary: 'Sửa đổi quan trọng về ghi xuất xứ hàng hóa, nhãn hàng nhập khẩu khi thông quan, cách ghi phụ gia thực phẩm (mã INS, nhóm chức năng, nguồn gốc tự nhiên/nhân tạo), và thay thế toàn bộ Phụ lục I, IV, V của Nghị định 43.',
    keyArticles: [
      {
        article: 'Khoản 5 Điều 1 (Sửa đổi Điều 10 NĐ 43)',
        title: 'Nội dung nhãn gốc hàng nhập khẩu khi thông quan',
        content: 'Bắt buộc phải có: a) Tên hàng hóa; b) Xuất xứ; c) Tên hoặc tên viết tắt của tổ chức cá nhân sản xuất ở nước ngoài. Sau thông quan về kho phải dán nhãn phụ tiếng Việt đầy đủ trước khi lưu thông.'
      },
      {
        article: 'Khoản 7 Điều 1 (Sửa đổi Điều 15 NĐ 43)',
        title: 'Cách ghi xuất xứ hàng hóa',
        content: 'Ghi bằng một trong các cụm từ: "sản xuất tại", "chế tạo tại", "nước sản xuất", "xuất xứ", "sản xuất bởi", "sản phẩm của" kèm tên nước. Không được viết tắt tên nước/vùng lãnh thổ.'
      },
      {
        article: 'Khoản 8 Điều 1 (Sửa đổi Điều 16 NĐ 43)',
        title: 'Cách ghi thành phần và phụ gia thực phẩm',
        content: 'Ghi theo thứ tự từ cao đến thấp về khối lượng. Phụ gia ghi tên nhóm + tên chất hoặc mã INS. Chất tạo ngọt, tạo màu phải ghi rõ: "tự nhiên", "giống tự nhiên", "tổng hợp" hay "nhân tạo". Hương liệu ghi kèm tính chất.'
      },
      {
        article: 'Phụ lục I (Thay thế)',
        title: 'Nội dung bắt buộc cho nhóm Thực phẩm, Thực phẩm BVSK, Đồ uống',
        content: 'Thực phẩm BVSK bắt buộc ghi cụm từ: "Thực phẩm bảo vệ sức khỏe" và dòng khuyến cáo: "Thực phẩm này không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh".'
      }
    ]
  },
  {
    id: 'nd-181-2013',
    code: 'Nghị định số 181/2013/NĐ-CP',
    title: 'Quy định chi tiết thi hành một số điều của Luật Quảng cáo',
    issuedDate: '14/11/2013',
    effectiveDate: '01/01/2014',
    issuer: 'Chính phủ',
    category: 'QUANG_CAO',
    summary: 'Quy định điều kiện và nội dung quảng cáo các sản phẩm đặc biệt: Thuốc, Mỹ phẩm, Thực phẩm và phụ gia thực phẩm, Thực phẩm chức năng, Hóa chất diệt khuẩn, Trang thiết bị y tế, Phân bón, Thức ăn chăn nuôi...',
    keyArticles: [
      {
        article: 'Điều 5',
        title: 'Quảng cáo thực phẩm, thực phẩm chức năng',
        content: 'Nội dung phải phù hợp với Giấy tiếp nhận bản công bố. Phải có tên SP, tên địa chỉ đơn vị chịu trách nhiệm. TPCN phải có khuyến cáo: "Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh". Không được quảng cáo TPCN gây hiểu nhầm là thuốc. Trên báo nói/hình phải đọc rõ khuyến cáo.'
      },
      {
        article: 'Điều 12',
        title: 'Yêu cầu xác nhận nội dung quảng cáo',
        content: 'Chỉ được tiến hành quảng cáo sau khi được cơ quan nhà nước có thẩm quyền (Bộ Y tế, Bộ NN&PTNT, Bộ Công Thương) cấp Giấy xác nhận nội dung quảng cáo trong thời hạn 10 ngày làm việc.'
      }
    ]
  },
  {
    id: 'nd-30-2020',
    code: 'Nghị định số 30/2020/NĐ-CP',
    title: 'Nghị định về công tác văn thư',
    issuedDate: '05/03/2020',
    effectiveDate: '05/03/2020',
    issuer: 'Chính phủ',
    category: 'VAN_THU',
    summary: 'QUY CHUẨN THỂ THỨC VĂN BẢN HÀNH CHÍNH QUỐC GIA: Quy định chi tiết thể thức, kỹ thuật trình bày văn bản hành chính và bản sao văn bản; quản lý văn bản đi/đến; quản lý con dấu và chữ ký số; lập và nộp lưu hồ sơ vào lưu trữ cơ quan.',
    keyArticles: [
      {
        article: 'Điều 8 - 9 & Phụ lục I',
        title: '14 Thành phần thể thức chính và kỹ thuật trình bày',
        content: 'Quy định chuẩn: Khổ A4, font Times New Roman, định lề (trên/dưới 20-25mm, trái 30-35mm, phải 15-20mm). Chi tiết 14 ô vị trí thể thức trên trang văn bản.'
      },
      {
        article: 'Mục II Phần I Phụ lục I & Phụ lục III',
        title: 'Quy tắc Trích yếu & Tên loại văn bản',
        content: 'Văn bản có tên loại (Nghị quyết, Quyết định, Tờ trình, Thông báo...): Trích yếu đặt ngay dưới tên loại, in thường, đứng, đậm, có gạch ngang nét liền 1/3-1/2 dưới trích yếu. KHÔNG dùng cụm từ "V/v" (chữ "V/v" chỉ dùng riêng cho Công văn tại ô 5b).'
      },
      {
        article: 'Khoản 6 Điều 10 & Phụ lục I',
        title: 'Quy cách Căn cứ ban hành văn bản',
        content: 'Căn cứ ban hành được trình bày bằng chữ in thường, KIỂU CHỮ NGHIÊNG, cỡ 13-14. Sau mỗi căn cứ phải xuống dòng, cuối dòng có dấu chấm phẩy (;), dòng căn cứ cuối cùng kết thúc bằng dấu chấm (.). Lần đầu viện dẫn phải ghi đầy đủ tên loại, số, ký hiệu, cơ quan ban hành, ngày tháng năm và trích yếu, không được viết tắt tên cơ quan ban hành.'
      },
      {
        article: 'Khoản 7 Điều 13 & Phụ lục I',
        title: 'Chức vụ, Họ tên, Quyền hạn ký và Màu mực',
        content: 'Ký thay mặt tập thể (TM.), Ký thay (KT.), Quyền cấp trưởng (Q.), Ký thừa lệnh (TL.), Ký thừa ủy quyền (TUQ.). Văn bản giấy dùng mực màu xanh, không dùng mực dễ phai. Họ tên người ký in thường, đứng, đậm. Chữ ký số màu xanh, định dạng PNG nền trong suốt.'
      },
      {
        article: 'Khoản 9 Điều 13 & Phụ lục I',
        title: 'Quy cách Nơi nhận (ô 9a, 9b)',
        content: 'Tại ô 9b: "Nơi nhận:" in nghiêng đậm. Mỗi đơn vị nhận một dòng, đầu dòng có gạch ngang (-), cuối dòng có dấu chấm phẩy (;). Dòng cuối cùng ghi: "Lưu: VT, [tên đơn vị soạn thảo] [số lượng bản lưu]." và kết thúc bằng dấu chấm (.). Không viết tắt chức danh người nhận (ví dụ không viết "PGĐ Sở" mà phải viết "Phó Giám đốc Sở").'
      },
      {
        article: 'Khoản 10 Phụ lục I',
        title: 'Quy định nghiêm ngặt về viết tắt trong văn bản hành chính',
        content: 'NGHIÊM CẤM viết tắt tùy tiện: Không viết tắt các chức vụ, chức danh lãnh đạo ("PGĐ" -> phải viết "Phó Giám đốc", "GĐ" -> "Giám đốc", "PCT" -> "Phó Chủ tịch", "CT" -> "Chủ tịch", "CCT" -> "Chi cục trưởng", "TP" -> "Trưởng phòng", "PP" -> "Phó Trưởng phòng", "BGD" -> "Ban Giám đốc"). Không viết tắt tên cơ quan trong nội dung/viện dẫn ("Bộ NN&PTNT" -> "Bộ Nông nghiệp và Phát triển nông thôn"). Không viết tắt địa danh ("TP.HCM" -> "Thành phố Hồ Chí Minh", "HN" -> "Hà Nội", "TX." -> "thị xã"). CHỈ ĐƯỢC viết tắt các chức danh theo luật định (TM., KT., TL., TUQ., Q., UBND, HĐND, VT trong nơi nhận, TNHH/CP trong tên doanh nghiệp).'
      },
      {
        article: 'Phụ lục II',
        title: 'Quy tắc viết hoa chuẩn xác trong văn bản hành chính',
        content: '1. Tên cơ quan, tổ chức: Viết hoa chữ cái đầu của từ/cụm từ chỉ loại hình và chức năng (Văn phòng Chính phủ, Bộ Nông nghiệp và Phát triển nông thôn, Sở Nông nghiệp và Môi trường). KHÔNG viết hoa liên từ "và", "của", "tại", "thuộc". 2. Chức vụ, chức danh: Viết hoa khi đi liền cơ quan hoặc chỉ đích danh (Giám đốc Sở, Phó Giám đốc Sở, Chủ tịch UBND tỉnh, Thủ tướng Chính phủ); viết thường khi nói chung (các phó giám đốc, trưởng các phòng). 3. DANH TỪ CHUNG: CẤM viết hoa giữa câu các danh từ chung như: "an toàn thực phẩm", "cơ sở sản xuất", "nông, lâm, thủy sản", "ngày cấp", "hồ sơ". 4. Tên văn bản và điều khoản: Viết hoa khi viện dẫn cụ thể: Điều 1, Khoản 2, Điểm a, Luật An toàn thực phẩm, Nghị định số 30/2020/NĐ-CP.'
      }
    ]
  },
  {
    id: 'nq-dia-gioi-2025',
    code: 'NQ 202/2025/QH15 & NQ 1676/NQ-UBTVQH15',
    title: 'Nghị quyết về sắp xếp đơn vị hành chính cấp tỉnh & cấp xã tỉnh Phú Thọ năm 2025',
    issuedDate: '12/06/2025 & 16/06/2025',
    effectiveDate: '01/07/2025',
    issuer: 'Quốc hội & Ủy ban Thường vụ Quốc hội',
    category: 'DIA_GIOI',
    summary: 'Quy định việc sắp xếp các đơn vị hành chính cấp tỉnh (sáp nhập tỉnh Vĩnh Phúc, Hòa Bình vào tỉnh Phú Thọ thành tỉnh Phú Thọ mới) và sắp xếp 148 đơn vị hành chính cấp xã của tỉnh Phú Thọ mới (bao gồm các xã mới như Vĩnh An, Tiên Lữ, Hy Cương, Lâm Thao, Phùng Nguyên...).',
    keyArticles: [
      {
        article: 'NQ 202/2025 Điều 1 Khoản 4',
        title: 'Sắp xếp tỉnh Phú Thọ mới',
        content: 'Sắp xếp toàn bộ diện tích tự nhiên, quy mô dân số của tỉnh Vĩnh Phúc, tỉnh Hòa Bình và tỉnh Phú Thọ thành tỉnh mới có tên gọi là tỉnh Phú Thọ.'
      },
      {
        article: 'NQ 1676/NQ-UBTVQH15 Điều 1',
        title: 'Sắp xếp các xã, phường của tỉnh Phú Thọ',
        content: 'Thành lập các xã mới như xã Hy Cương, xã Lâm Thao, xã Xuân Lũng, xã Phùng Nguyên, xã Bản Nguyên, xã Vĩnh An, xã Tiên Lữ, xã Trạm Thản, xã Dân Chủ, xã Phú Mỹ...'
      }
    ]
  }
];
