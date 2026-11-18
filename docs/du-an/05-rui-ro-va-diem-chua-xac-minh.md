# 05. Rủi ro và điểm chưa xác minh

## Rủi ro pháp lý
- Văn bản hết hiệu lực/sửa đổi/thay thế: phải kiểm tra nguồn chính thức, ngày hiệu lực và chuyển tiếp.
- Sai thẩm quyền: kiểm tra phân cấp/ủy quyền và thẩm quyền địa phương tại thời điểm xử lý.
- Tiêu chí gộp nhiều nghĩa vụ: tách thành yêu cầu nguyên tử.
- Nhầm hướng dẫn/thông lệ thành quy phạm bắt buộc: phân loại giá trị nguồn.
- Dùng pháp luật nước ngoài làm căn cứ: không sử dụng cho nghiệp vụ V1.

## Rủi ro AI và dữ liệu
- OCR sai số, tên, ngày, đơn vị hoặc dấu.
- AI suy diễn dữ liệu thiếu hoặc biến tài liệu tham khảo thành chứng cứ.
- Một tài liệu bị dùng vượt phạm vi hỗ trợ.
- Bỏ sót mâu thuẫn giữa tài liệu.
- Nhầm dữ liệu thử nghiệm là kết quả thật.
- Truy cập trái phép hồ sơ/tài liệu.

Kiểm soát: đối chiếu bản gốc; lưu trang/đoạn; xác nhận OCR; ghi giới hạn chứng minh; không tự điền dữ kiện; kiểm thử truy cập trái phép; nhật ký thao tác.

## Rủi ro kỹ thuật đã ghi nhận
1. Chưa thấy FK trực tiếp nối cụm hồ sơ ATTP với cụm đánh giá.
2. Chưa thấy FK trực tiếp nối tài liệu hồ sơ với evidence.
3. Chưa thu thập/đối chiếu đủ SQL gốc của 47 migration.
4. Một số hàm SQL và quyền thực thi cần rà soát.
5. Một số ACL/policy cần đánh giá least privilege.
6. Đường dẫn Storage cũ có thể không theo thư mục UUID hồ sơ.
7. Chưa chứng minh nhật ký bất biến.
8. Chưa xác nhận OCR lịch sử theo trang và quy trình xác nhận đã triển khai.
9. Preview READY không phải nghiệm thu.

## Điểm cần xác minh trước khi chốt kiến trúc
- SQL gốc và lịch sử schema của toàn bộ migration.
- Cây mã nguồn mới nhất trên các nhánh; xác định nguồn chuẩn V1.
- Liên kết ở tầng ứng dụng giữa hồ sơ và assessment.
- Luồng tải, đọc, OCR, lưu extracted text và xác nhận.
- Phân quyền thực tế frontend/API/DB/Storage.
- Kiểm thử đăng nhập, khôi phục mật khẩu, upload/download và truy cập chéo.
- Căn cứ pháp lý, thẩm quyền hiện hành của đúng thủ tục/địa phương.
- Mẫu báo cáo và thể thức văn bản hành chính.

## Nguyên tắc không làm
- Không xóa nhánh, mã nguồn, migration, bảng hoặc dữ liệu cũ chỉ vì chưa dùng V1.
- Không tự hợp nhất nhánh hoặc thay đổi main.
- Không triển khai Production.
- Không sửa dữ liệu thử nghiệm khi chưa được duyệt.
- Không đưa bí mật hoặc hồ sơ cá nhân/doanh nghiệp thật vào tài liệu công khai.
- Không kết luận pháp lý từ dữ liệu mẫu chưa xác minh.
- Không mở lại RPC/nới quyền trước khi phân tích và kiểm thử.

## Nhật ký phạm vi
Đợt này chỉ thêm tài liệu Markdown trong docs/du-an/ trên nhánh tài liệu riêng. Không thay đổi mã nguồn ứng dụng, SQL/schema/dữ liệu Supabase, cấu hình/deployment Vercel, các nhánh mã hiện có hoặc main. Các kết quả kỹ thuật được mô tả là kết quả kiểm tra trước đây; chưa thực hiện kiểm toán mới toàn diện trong lần lập hồ sơ này.