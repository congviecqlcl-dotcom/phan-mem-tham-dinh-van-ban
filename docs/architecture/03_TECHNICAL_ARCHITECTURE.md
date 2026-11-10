# DOCUGUARD AI — KIẾN TRÚC KỸ THUẬT VÀ DỮ LIỆU
**Phiên bản:** 2.1-draft | **Ngày:** 10/11/2026

## 1. Mục tiêu kỹ thuật
Tổ chức phần mềm theo mô-đun, dữ liệu và quy tắc có phiên bản; có thể mở rộng sản phẩm/hoạt động mà không viết lại lõi. Tài liệu này mô tả kiến trúc đích; không khẳng định tất cả mô-đun đã được triển khai trong mã nguồn hiện tại.

## 2. Các lớp kiến trúc
1. **Tiếp nhận:** tải lên, phân loại tệp, metadata, chống trùng, quản lý hồ sơ.
2. **Trích xuất:** PDF/text, OCR ảnh, bảng, trang, confidence và dấu vết nguồn.
3. **Nhận diện:** phân loại tài liệu, sản phẩm, cơ sở, chủ thể, hoạt động và tài liệu ghép.
4. **Tri thức:** kho pháp lý, khoa học, kỹ thuật, nghiệp vụ và bộ quy tắc phiên bản.
5. **Đánh giá:** pháp lý, khoa học, kỹ thuật, năng lực, chứng cứ, chuỗi cung ứng.
6. **Điều phối AI:** gọi mô hình, truy xuất tri thức, công cụ tính toán và quy tắc xác định.
7. **Quản lý phát hiện:** trạng thái, mức độ, bằng chứng, giải trình và hành động.
8. **Kiểm soát con người:** rà soát ngoại lệ, xác minh thực tế, phê duyệt và quyết định.
9. **Báo cáo:** báo cáo thẩm định, checklist, bảng cân đối, hồ sơ chứng cứ, xuất Word.
10. **Quản trị:** tài khoản, phân quyền, nhật ký, cấu hình, kiểm soát phiên bản và kiểm thử.

## 3. Luồng xử lý chuẩn
1. Tạo hồ sơ và ghi nhận chủ thể/cơ sở;
2. Nhận tài liệu, kiểm tra định dạng, lưu bản gốc và mã băm;
3. Trích xuất nội dung theo trang; lưu OCR và confidence;
4. Phân loại từng tài liệu, phát hiện tài liệu ghép;
5. Nhận diện sản phẩm và hoạt động được kê khai;
6. Xác định phạm vi pháp lý, khoa học và kỹ thuật;
7. Chọn checklist/quy tắc theo phiên bản;
8. Chuẩn hóa đơn vị, số liệu và thời gian;
9. Chạy kiểm tra xác định và phép tính;
10. Chạy AI phân tích ngữ nghĩa trong phạm vi tri thức được truy xuất;
11. Đối chiếu chéo giữa tài liệu, sản phẩm, hoạt động và dòng vật chất;
12. Tính phạm vi bao phủ, ghi nhận tiêu chí chưa xác minh;
13. Phân loại phát hiện và mức độ rủi ro;
14. Sinh báo cáo có trích dẫn bằng chứng;
15. Chuyển công chức xử lý ngoại lệ/xác minh hiện trường;
16. Ghi nhận kết quả con người và quyết định theo thẩm quyền;
17. Lưu nhật ký và phiên bản toàn bộ quá trình.

## 4. Mô hình dữ liệu logic tối thiểu
Các thực thể đề xuất:
- `CaseFile`: hồ sơ thẩm định;
- `Party`: cá nhân/tổ chức;
- `Establishment`: cơ sở/địa điểm;
- `Product` và `ProductCategory`;
- `Activity` và `ActivityType`;
- `EstablishmentActivity`: quan hệ cơ sở – hoạt động;
- `ProductActivity`: quan hệ sản phẩm – hoạt động;
- `Document`, `DocumentPage`, `DocumentSegment`;
- `Evidence`: chứng cứ trích xuất/đính kèm;
- `ProductionLot`, `InputMaterial`, `ProcessStep`, `OutputProduct`;
- `InventoryMovement`: nhập/xuất/tồn/hao hụt;
- `Supplier`, `Buyer`, `Contract`, `Invoice`, `Shipment`;
- `LegalSource`, `LegalProvision`, `ScienceSource`, `TechnicalReference`;
- `RuleDefinition`, `RuleVersion`, `ChecklistTemplate`;
- `CriterionResult`, `Finding`, `RiskAssessment`;
- `HumanReview`, `FieldInspection`, `AdministrativeDecision`;
- `AuditLog`, `ModelRun`, `ProcessingStatus`.

Đây là mô hình logic; trước khi tạo bảng thật phải đối chiếu schema Supabase hiện có, quyền truy cập và dữ liệu đang dùng. Không tự ý sửa cơ sở dữ liệu đang hoạt động.

## 5. Mô hình kết quả tiêu chí
Mỗi `CriterionResult` nên có:
- ID, mã tiêu chí, phiên bản tiêu chí;
- Nhóm nghiệp vụ và phạm vi áp dụng;
- Trạng thái: `checked_no_issue`, `checked_issue`, `not_verifiable`, `not_applicable`, `not_processed`;
- Phương pháp: quy tắc xác định, AI, tính toán, người kiểm tra;
- Dữ liệu đầu vào, đơn vị, nguồn;
- Bằng chứng và vị trí tài liệu;
- Căn cứ pháp lý/khoa học/kỹ thuật;
- Giải thích, giả định, độ không chắc chắn;
- Hành động tiếp theo, người xử lý, dấu thời gian.

## 6. Phân biệt trạng thái nghiệp vụ và trạng thái kỹ thuật
Không gộp:
- `ai_success`: mô hình AI trả kết quả hợp lệ;
- `rules_engine_success`: quy tắc xác định chạy thành công;
- `local_fallback_used`: dùng bộ máy cục bộ;
- `api_failure`: dịch vụ API lỗi;
- `ocr_review_required`: OCR cần người xem lại;
- `partial_processing`: chỉ xử lý một phần;
- `not_processed`: chưa xử lý.

Fallback không được hiển thị như AI đã thẩm định thành công. Báo cáo phải chỉ ra engine nào đã xử lý từng phần.

## 7. Đánh giá phạm vi bao phủ
Báo cáo cần có:
- Tổng tiêu chí áp dụng;
- Số tiêu chí đã kiểm tra có bằng chứng;
- Số tiêu chí có phát hiện;
- Số tiêu chí chưa thể xác minh;
- Số tiêu chí chưa xử lý;
- Số tiêu chí không áp dụng và lý do.

Chỉ dùng câu “Không phát hiện sai lệch trong phạm vi đã kiểm tra” khi đúng trạng thái và phạm vi. Không dùng “đạt 100%” nếu không có định nghĩa và bằng chứng cho độ bao phủ.

## 8. Phân loại rủi ro
Không dựa vào một điểm AI mờ đục. Phải nêu yếu tố cấu thành, ví dụ:
- Mâu thuẫn giữa tài liệu;
- Số liệu năng lực vượt phạm vi tham chiếu;
- Thiếu chứng cứ quan trọng;
- Hoạt động/sản phẩm có nguy cơ đặc thù;
- OCR không chắc chắn;
- Dòng vật chất mất cân đối;
- Quy tắc pháp lý chưa xác định;
- Dấu hiệu cần xác minh hiện trường.

Ngưỡng và quy tắc phân luồng phải được kiểm thử, hiệu chỉnh và phê duyệt. Không tự đặt tỷ lệ lấy mẫu kiểm tra.

## 9. Bảo mật và kiểm toán
- Phân quyền tối thiểu theo vai trò và phạm vi hồ sơ;
- Không đưa bí mật/khóa API vào mã nguồn hoặc log;
- Nhật ký truy cập, sửa dữ liệu, chạy mô hình, thay đổi quy tắc và phê duyệt;
- Bảo vệ tệp gốc, checksum, lịch sử phiên bản;
- Kiểm soát tải lên, loại tệp, kích thước và nội dung nguy hiểm;
- Tách dữ liệu thử nghiệm khỏi dữ liệu thật;
- Chính sách lưu trữ, sao lưu, phục hồi và xóa theo quy định được xác định;
- Không dùng hồ sơ nhạy cảm để huấn luyện mô hình nếu chưa có căn cứ và phê duyệt.

## 10. Nguyên tắc triển khai
- Giữ thay đổi trên nhánh phát triển riêng;
- CI/build/test trước khi đề nghị người dùng thử;
- Preview có bảo vệ SSO không được tìm cách vượt qua;
- Không merge PR, deploy Production hoặc sửa Supabase nếu chưa được chấp thuận;
- Mọi thay đổi schema cần migration, kiểm tra tương thích, kế hoạch rollback và phê duyệt riêng.
