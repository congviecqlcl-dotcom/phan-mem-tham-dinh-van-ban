# Báo cáo rà soát kỹ thuật ban đầu

Phạm vi: đọc tĩnh server.ts, package.json, .env.example và src/App.tsx trên nhánh main. Chưa chạy build/test; chưa xác minh cấu hình triển khai hoặc hiệu lực từng điều khoản pháp luật.

## Phát hiện cần xử lý

1. **Điểm số kết luận đặt cứng.** server.ts gán DAT khi điểm >= 90, CAN_SUA_DOI ở 60–89, KHONG_DAT dưới 60. Không nên dùng điểm tổng hợp này để tự quyết định kết luận pháp lý. Tách phát hiện có căn cứ khỏi chỉ số tham khảo.
2. **Prompt tuyên bố độ chính xác tuyệt đối.** LEGAL_SYSTEM_PROMPT và prompt thẩm định yêu cầu AI có “kiến thức tuyệt đối chính xác” và tạo bản sửa “100%”. Điều này không bảo đảm độ đúng. Cần yêu cầu trích nguồn kiểm chứng được, nêu rõ điểm chưa xác minh và gắn nhãn dự thảo.
3. **Câu trả lời pháp lý dự phòng viết cứng.** getIntelligentLegalAnswer được gọi khi Gemini lỗi/không khả dụng. Các câu trả lời chứa khẳng định và thời hạn pháp lý cụ thể nhưng không kèm nguồn trực tiếp để người dùng kiểm tra. Cần hiển thị rõ trạng thái chưa tra cứu, và chỉ dùng kết luận pháp lý khi nguồn/phiên bản/điều khoản đã được xác minh.
4. **Chưa thấy middleware xác thực trong phần server đã rà soát.** Các route /api/audit-document, /api/batch-audit-documents và /api/chat không có xác thực thể hiện trong đoạn mã đã đọc. Chưa xác minh có lớp bảo vệ ở nền tảng triển khai hoặc nơi khác; phải kiểm tra trước khi phát hành.
5. **Payload giới hạn 50 MB.** Express JSON và URL-encoded parser đều đặt limit 50mb. Cần kiểm tra nhu cầu, loại tệp, số lượng tệp, kiểm soát tần suất và tiêu thụ tài nguyên.

## Nguyên tắc xử lý

- Phân biệt dữ kiện trích từ hồ sơ, suy luận AI, quy tắc cục bộ và căn cứ pháp luật.
- Mỗi phát hiện cần lưu đoạn hồ sơ/vị trí, nguồn và điều khoản áp dụng, phiên bản/hiệu lực, phương pháp, bằng chứng, giới hạn chứng minh và trạng thái.
- Thiếu bằng chứng không tự động đồng nghĩa vi phạm. AI hỗ trợ phân tích/dự thảo; công chức rà soát và quyết định.
- Không dùng điểm số tự đặt làm kết luận pháp lý; không tuyên bố AI chính xác tuyệt đối.
- Phân biệt kết quả Gemini, kết quả bộ quy tắc cục bộ và lỗi hệ thống.

## Trước khi triển khai

- Xác minh xác thực/ủy quyền thực tế.
- Bổ sung nguồn pháp lý có thể kiểm chứng cho từng phát hiện.
- Kiểm thử hồ sơ thiếu bằng chứng, mâu thuẫn, sai phạm vi áp dụng và văn bản đã sửa đổi.
- Chạy build, lint và kiểm thử hồi quy.
- Không triển khai công khai hoặc kết nối dữ liệu nghiệp vụ trước khi chủ dự án xác nhận.

Chưa sửa logic ứng dụng, chưa chạy build/lint, chưa xác minh toàn bộ căn cứ pháp luật và chưa triển khai. Đây là báo cáo rà soát kỹ thuật ban đầu, không phải kết luận pháp lý.
