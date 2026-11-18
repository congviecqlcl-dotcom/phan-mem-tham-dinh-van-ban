# 02. Kiến trúc và phạm vi V1

## Luồng nghiệp vụ đích
1. Tạo hồ sơ, xác định cơ sở, thủ tục và phạm vi hoạt động.
2. Tiếp nhận, lưu tài liệu.
3. OCR/trích xuất; đối chiếu bản gốc và xác nhận kết quả đọc.
4. Xác định gói pháp lý theo đối tượng, hoạt động, điều kiện và thời điểm.
5. Tách yêu cầu pháp lý thành tiêu chí có thể kiểm tra.
6. Gắn tiêu chí với tài liệu, dữ kiện và bằng chứng.
7. Đánh giá từng tiêu chí, ghi nhận trạng thái và giới hạn chứng minh.
8. Tổng hợp vấn đề và dự thảo báo cáo.
9. Công chức rà soát/xác minh; người có thẩm quyền quyết định.
10. Lưu phiên bản, người thao tác, thời điểm và lịch sử.

Đây là mô hình đích, không khẳng định toàn bộ đã triển khai.

## Các lớp chức năng
| Lớp | Trách nhiệm | Kiểm soát |
|---|---|---|
| Giao diện hồ sơ | Tạo hồ sơ, tài liệu, checklist | Tiếng Việt, thao tác rõ |
| Lưu trữ | Lưu tệp riêng tư | Quyền theo hồ sơ, không URL công khai |
| OCR | Trích xuất PDF/ảnh | Giữ bản gốc, trang/lỗi/độ tin cậy |
| Kho pháp lý | Văn bản và yêu cầu | Phiên bản, hiệu lực, phạm vi, nguồn |
| Máy quy tắc | Điều kiện áp dụng | Rule có phiên bản/phê duyệt |
| Đánh giá | So sánh yêu cầu với bằng chứng | Truy nguyên và giới hạn |
| Báo cáo | Tổng hợp dự thảo | Không tự phát hành |
| Nhật ký | Lịch sử thao tác | Người, thời điểm, hành động |

## Các cụm dữ liệu đã quan sát
**Hồ sơ:** attp_dossiers, attp_dossier_documents, attp_dossier_checklist_items, attp_dossier_document_links.

**Đánh giá:** cases, case_versions, assessment_runs, assessment_questions, findings, evidence_items, claims, supported_facts, document_fact_comparisons, dossier_gate_results, assessment_rule_runs, finding_support_links.

**Pháp lý/quy tắc:** legal_documents, legal_requirements, rule_versions, method_versions và các bảng liên quan.

### Điểm nối chưa xác nhận
Trong DB đã kiểm tra chưa thấy khóa ngoại trực tiếp nối attp_dossiers với cases/case_versions/assessment_runs; cũng chưa thấy khóa ngoại trực tiếp nối attp_dossier_documents với evidence_items. attp_dossier_document_links được ghi nhận 0 bản ghi tại thời điểm kiểm tra.

Điều này chỉ chứng minh chưa có cầu nối bằng khóa ngoại ở DB đã kiểm tra; chưa đủ để kết luận không có liên kết ở tầng ứng dụng.

## Định hướng OCR đã thống nhất, chưa xác nhận triển khai
- OCR lại tài liệu đã lưu, tải bằng phiên đăng nhập và quyền hồ sơ.
- Không dùng URL công khai hoặc khóa dịch vụ ở trình duyệt.
- Hiển thị bản gốc và OCR theo trang, cảnh báo trang không đọc được/độ tin cậy thấp.
- Công chức xác nhận hoặc từ chối.
- Lưu từng lần OCR; không ghi đè lịch sử hoặc tùy tiện ghi đè extracted_text.
- Chỉ OCR đã xác nhận được dùng làm đầu vào đánh giá.
- Gắn xác nhận với người và thời điểm.

Các bảng attp_document_ocr_runs và attp_document_ocr_pages từng được đề xuất; chưa xác nhận đã tồn tại.

## Nguyên tắc pháp lý và AI
Nguồn pháp lý đã xác minh là nguồn chuẩn. Tách điều khoản nhiều nghĩa vụ thành tiêu chí nguyên tử. Phân biệt quy định bắt buộc, quyền tùy nghi, điều cấm, điều kiện, ngoại lệ, hướng dẫn và thông lệ. Máy quy tắc kiểm tra phạm vi/điều kiện; AI hỗ trợ đọc, trích xuất, so sánh, dự thảo. Không tự tạo căn cứ, ngưỡng, định mức hoặc kết luận khi thiếu nguồn.

## Các thay đổi cần phê duyệt riêng
Tạo bảng nối dossier-case; bảng OCR; liên kết tài liệu-evidence; quan hệ câu hỏi-yêu cầu pháp lý; sửa RPC/RLS/grants/Storage; thay đổi xác thực/phân quyền. Tài liệu này không triển khai các thay đổi đó.