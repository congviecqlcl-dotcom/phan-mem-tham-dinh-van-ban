# 01. Tổng quan dự án

## Mục tiêu
Xây dựng công cụ nghiệp vụ hỗ trợ công chức thẩm định hồ sơ đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm (ATTP), trước mắt giới hạn ở ngành hàng và hoạt động thuộc phạm vi quản lý của ngành nông nghiệp.

Sản phẩm phải hướng dẫn được công chức mới: cần kiểm tra gì, căn cứ nào áp dụng, tài liệu nào chứng minh, cách ghi nhận kết quả, trường hợp cần bổ sung/xác minh và sản phẩm đầu ra.

## Nguyên tắc
- AI hỗ trợ, không phải chủ thể có thẩm quyền hành chính.
- Không tự động cấp/từ chối cấp giấy, ký, xử phạt hoặc quyết định thay người có thẩm quyền.
- Không dùng điểm rủi ro thay thế điều kiện pháp lý.
- Nhận định phải truy nguyên được về căn cứ, tài liệu, vị trí thông tin và giới hạn chứng minh.
- Thiếu dữ liệu không đồng nghĩa sự việc không xảy ra; diễn đạt là chưa có tài liệu chứng minh/chưa đủ căn cứ.
- Chỉ pháp luật Việt Nam hiện hành là căn cứ nghiệp vụ.

## Phạm vi V1
**Bao gồm:** hồ sơ ATTP; tài liệu; OCR; thư viện pháp lý; yêu cầu/tiêu chí; đối chiếu bằng chứng; ghi nhận thiếu sót/mâu thuẫn; dự thảo báo cáo; lịch sử xử lý.

**Chưa bao gồm:** cổng tiếp nhận doanh nghiệp/người dân; quản lý doanh nghiệp/nhân sự/lịch công tác; thanh tra hiện trường, cưỡng chế, xử phạt, khiếu nại; tự động ra quyết định/phát hành giấy; lĩnh vực Y tế/Công Thương; phân hệ truy xuất nguồn gốc, cân bằng lô, thiết kế kho/bảo quản như luồng V1 bắt buộc.

Giữ nguyên mã và dữ liệu các phân hệ ngoài phạm vi; chỉ tạm không đưa vào luồng V1.

## Bốn trạng thái hỗ trợ
- ĐẠT
- KHÔNG ĐẠT
- CHƯA ĐỦ CĂN CỨ
- CẦN XÁC MINH

Đây là trạng thái nghiệp vụ hỗ trợ, không thay thế kết luận chính thức của người có thẩm quyền.

## Tiêu chí thành công
1. Hồ sơ/tài liệu lưu và truy xuất đúng quyền.
2. OCR đối chiếu được bản gốc, thể hiện lỗi/độ không chắc chắn.
3. Yêu cầu pháp lý xác định đúng đối tượng, hoạt động, điều kiện và thời điểm.
4. Kết quả gắn với bằng chứng cụ thể và giới hạn chứng minh.
5. Không suy diễn khi thiếu dữ liệu hoặc tài liệu mâu thuẫn.
6. Báo cáo là dự thảo để công chức rà soát/phê duyệt.
7. Có lịch sử thao tác và phiên bản.