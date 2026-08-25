export function getLocalChatResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('17/2024') || q.includes('xếp loại') || q.includes('thay đổi') || q.includes('thông tư 17/2024')) {
    return `### Điểm mới cốt lõi của Thông tư số 17/2024/TT-BNNPTNT (Hiệu lực từ 15/01/2025):

1. **Bãi bỏ xếp loại A, B, C**: Chuyển hoàn toàn sang cơ chế đánh giá **02 mức**: *"Đạt"* hoặc *"Không đạt"*.
2. **Bãi bỏ cấp Giấy xác nhận kiến thức ATTP của cơ quan nhà nước**: Chủ cơ sở tự tổ chức tập huấn và tự xác nhận kiến thức ATTP cho bản thân và người trực tiếp sản xuất, kinh doanh.
3. **Thời hạn thẩm định và khắc phục**:
   - Thời hạn thẩm định thực tế tại cơ sở: **15 ngày làm việc** kể từ ngày nhận đủ hồ sơ hợp lệ.
   - Thời hạn khắc phục sai lỗi đối với cơ sở chưa đạt: Tối đa **30 ngày** (trước đây có thể kéo dài hơn).
4. **Cập nhật thẩm quyền**: Thẩm quyền quản lý trực thuộc **Cục Chất lượng, Chế biến và Phát triển thị trường** và các Chi cục cấp tỉnh tương ứng.`;
  }

  if (q.includes('miễn') || q.includes('điều 12') || q.includes('không thuộc diện')) {
    return `### Các cơ sở được miễn cấp Giấy chứng nhận đủ điều kiện ATTP theo Điều 12 Nghị định 15/2018/NĐ-CP:

1. Sản xuất ban đầu nhỏ lẻ.
2. Sản xuất, kinh doanh thực phẩm không có địa điểm cố định.
3. Sơ chế nhỏ lẻ.
4. Kinh doanh thực phẩm nhỏ lẻ.
5. Kinh doanh thực phẩm bao gói sẵn.
6. Sản xuất, kinh doanh dụng cụ, vật liệu bao gói, chứa đựng thực phẩm.
7. Nhà hàng trong khách sạn.
8. Bếp ăn tập thể không có đăng ký ngành nghề kinh doanh thực phẩm.
9. Kinh doanh thức ăn đường phố.
10. Cơ sở đã được cấp một trong các Giấy chứng nhận: GMP, HACCP, ISO 22000, IFS, BRC, FSSC 22000 hoặc tương đương còn hiệu lực.

*(Lưu ý: Các cơ sở nông lâm thủy sản không thuộc diện cấp GCN theo Điều 12 vẫn phải Ký Bản cam kết sản xuất, kinh doanh thực phẩm an toàn theo Thông tư 17/2018/TT-BNNPTNT).*`;
  }

  if (q.includes('nghị định 30') || q.includes('thể thức') || q.includes('viết tắt') || q.includes('viết hoa') || q.includes('trích yếu')) {
    return `### Quy tắc thể thức văn bản chuẩn theo Nghị định số 30/2020/NĐ-CP:

1. **Trích yếu văn bản**:
   - Văn bản có tên loại (Quyết định, Tờ trình, Kế hoạch...): Không dùng chữ "V/v", trình bày in thường, đứng, đậm, có đường gạch ngang dưới từ 1/3 đến 1/2 độ dài dòng chữ.
   - Công văn: Bắt buộc dùng chữ "V/v", không có đường gạch ngang phía dưới trích yếu.
2. **Quy tắc cấm viết tắt tùy tiện (Phụ lục I)**:
   - Nghiêm cấm viết tắt chức vụ: PGĐ, GĐ, PCT, CT, CCT, TP, PP, BGD (phải viết đầy đủ: Phó Giám đốc, Giám đốc, Chi cục trưởng...).
   - Nghiêm cấm viết tắt tên cơ quan trong câu: Bộ NN&PTNT (phải viết: Bộ Nông nghiệp và Phát triển nông thôn).
3. **Quy tắc viết hoa (Phụ lục II)**:
   - Tên cơ quan: Viết hoa chữ cái đầu loại hình và chức năng, không viết hoa liên từ ("và", "của", "thuộc").
   - Cấm viết hoa danh từ chung giữa câu: "an toàn thực phẩm", "nông, lâm, thủy sản", "cơ sở sản xuất".`;
  }

  if (q.includes('nhãn') || q.includes('111/2021') || q.includes('bảo vệ sức khỏe') || q.includes('tpcn')) {
    return `### Quy định ghi nhãn Thực phẩm bảo vệ sức khỏe (Nghị định 43/2017 & NĐ 111/2021/NĐ-CP):

1. **Tên nhóm sản phẩm**: Phải ghi rõ cụm từ *"Thực phẩm bảo vệ sức khỏe"* ở mặt chính của nhãn.
2. **Dòng khuyến cáo bắt buộc**: Phải ghi dòng chữ:  
   *"Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh"*  
   ngay cạnh tên sản phẩm hoặc cùng một trường nhìn.
3. **Ngôn ngữ và kích thước**: Chữ tiếng Việt bắt buộc, chiều cao chữ tối thiểu là 1.2mm (hoặc 0.9mm nếu diện tích nhãn < 80cm²).
4. **Cách ghi xuất xứ**: Ghi *"Sản xuất tại: [Tên nước/địa chỉ]"* hoặc *"Xuất xứ: [Tên nước]"*, không được viết tắt tên nước.`;
  }

  if (q.includes('thu hồi') || q.includes('truy xuất') || q.includes('17/2021') || q.includes('24 giờ')) {
    return `### Quy trình truy xuất nguồn gốc & Thu hồi thực phẩm (Thông tư số 17/2021/TT-BNNPTNT):

1. **Nguyên tắc truy xuất**: Theo nguyên tắc *"Một bước trước - Một bước sau"* (biết rõ cơ sở cung cấp nguyên liệu và cơ sở tiếp nhận sản phẩm).
2. **Thời gian lưu trữ hồ sơ**:
   - Tối thiểu **6 tháng** đối với sản phẩm tươi sống, thời hạn bảo quản ngắn.
   - Tối thiểu **12 tháng** đối với sản phẩm đông lạnh, chế biến.
   - Tối thiểu **24 tháng** đối với hồ sơ kiểm nghiệm, chứng từ nguyên liệu.
3. **Thời hạn thu hồi khẩn cấp**: Cơ sở phải phát thông báo và tiến hành thu hồi sản phẩm không an toàn trong vòng **24 giờ** kể từ khi nhận được yêu cầu hoặc phát hiện sự cố.`;
  }

  if (q.includes('phú thọ') || q.includes('202/2025') || q.includes('1676') || q.includes('địa giới') || q.includes('sáp nhập')) {
    return `### Địa giới hành chính mới tỉnh Phú Thọ theo Nghị quyết 202/2025/QH15 & Nghị quyết 1676/NQ-UBTVQH15:

1. **Phạm vi sáp nhập**: Tỉnh Phú Thọ mới được hình thành trên cơ sở hợp nhất địa giới các tỉnh Phú Thọ, Vĩnh Phúc và Hòa Bình.
2. **Sắp xếp đơn vị hành chính**: Thực hiện sắp xếp, thành lập mới 148 xã, phường, thị trấn (ví dụ: xã Vĩnh An, xã Tiên Lữ, xã Hy Cương, xã Lâm Thao, xã Phùng Nguyên, xã Trạm Thản, xã Dân Chủ, xã Phú Mỹ...).
3. **Lưu ý khi thẩm định**: Mọi địa chỉ cơ sở SXKD nông lâm thủy sản, nơi cấp đăng ký kinh doanh và thẩm quyền quản lý cần đối chiếu chính xác theo tên gọi đơn vị hành chính mới sau sáp nhập.`;
  }

  return `Chào bạn! Tôi đã phân tích câu hỏi: "${query}".

Theo hệ thống văn bản quy phạm pháp luật hiện hành (Luật ATTP 2010, Nghị định 15/2018/NĐ-CP, Thông tư 17/2024/TT-BNNPTNT, Nghị định 30/2020/NĐ-CP):
- Mọi văn bản hành chính cần đảm bảo đầy đủ thể thức theo Nghị định 30/2020 (không viết tắt tùy tiện chức vụ, cơ quan; tuân thủ quy tắc viết hoa).
- Quy trình kiểm tra, thẩm định cơ sở SXKD nông lâm thủy sản hiện áp dụng 2 mức xếp loại "Đạt" hoặc "Không đạt" theo Thông tư 17/2024/TT-BNNPTNT.
- Bạn có thể tải tệp văn bản lên công cụ "Thẩm định văn bản" để được kiểm tra chi tiết từng lỗi và nhận ngay bản Word chuẩn sửa đổi.`;
}
