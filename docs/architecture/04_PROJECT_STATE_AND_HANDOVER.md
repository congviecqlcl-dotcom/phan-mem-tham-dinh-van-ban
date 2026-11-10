# DOCUGUARD AI — TRẠNG THÁI DỰ ÁN VÀ BÀN GIAO XUYÊN PHIÊN
**Cập nhật:** 10/11/2026  
**Mục đích:** Tài liệu bắt buộc phải đọc khi tiếp tục dự án ở cuộc trò chuyện/phiên làm việc mới.

## 1. Định danh dự án
- Tên: DocuGuard AI – Pháp chế & ATTP.
- Kho mã nguồn: `congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban`.
- Dự án Vercel: `phan-mem-tham-dinh-van-ban`.
- Nhánh phát triển được ghi nhận: `feature/docuguard-v2-hardening`.
- Nhánh nền từng được ghi nhận: `feature/attp-dossier-review-v1`.
- PR #6 từng được ghi nhận đang mở; không tự ý hợp nhất.
- Vercel Preview có bảo vệ SSO; không tìm cách vượt qua.

## 2. Quy tắc an toàn khi tiếp tục
1. Trước khi sửa mã, kiểm tra lại HEAD của nhánh, trạng thái CI, deployment và thay đổi mới nhất.
2. Không giả định trạng thái deployment cũ vẫn còn đúng.
3. Không merge PR, không deploy Production, không thay đổi Supabase và không thực hiện hành động không thể đảo ngược nếu chưa có chấp thuận rõ ràng.
4. Chỉ phát triển trên nhánh được xác nhận.
5. Không tuyên bố build/test/Preview thành công nếu chưa có kết quả công cụ xác nhận.
6. Khi Preview bị SSO bảo vệ, hướng dẫn người dùng tự đăng nhập và kiểm thử; không bypass.
7. Không ghi khóa, token, dữ liệu cá nhân hoặc nội dung hồ sơ nhạy cảm vào tài liệu bàn giao.

## 3. Định hướng sản phẩm đã thống nhất
- Thẩm định toàn chuỗi thực phẩm, không giới hạn nhóm sản phẩm hoặc loại hình kinh doanh.
- Mô hình riêng sản phẩm – hoạt động – cơ sở; cho phép nhiều-nhiều.
- Đánh giá pháp lý, khoa học, kỹ thuật, năng lực, chứng cứ và chuỗi cung ứng.
- Một cơ sở có thể thực hiện nhiều hoạt động và dùng nhiều nguồn nguyên liệu.
- AI thực hiện tối đa kiểm tra có thể tự động hóa; công chức kiểm soát ngoại lệ và xác minh thực địa; người có thẩm quyền quyết định.
- Kết luận có nguồn, trích dẫn, phép tính, giả định, giới hạn và hành động tiếp theo.
- Không tự tạo ngưỡng năng suất/công suất hoặc căn cứ pháp lý.
- Khi thiếu dữ liệu phải ghi “CHƯA ĐỦ CĂN CỨ XÁC ĐỊNH”.
- Tách trạng thái kỹ thuật khỏi kết quả nghiệp vụ.
- Giao diện tiếng Việt có dấu.

## 4. Các phần đã được ghi nhận trong mã nguồn trước thời điểm tài liệu này
Theo lịch sử công việc trong các phiên trước:
- Phân biệt số kết quả Gemini và kết quả quy tắc cục bộ ở giao diện;
- Điều chỉnh một số prompt pháp lý để giảm giả định pháp luật hard-code;
- Lọc phát hiện thiếu trích dẫn khớp nội dung gốc;
- Bổ sung kiểu dữ liệu chứng cứ OCR theo trang;
- Cải thiện xử lý xuống dòng OCR PDF;
- Phát hiện tài liệu ghép nhiều loại theo ranh giới trang, hiển thị khoảng trang và bằng chứng nhận diện;
- Bổ sung lưu ranh giới trang PDF nếu thư viện trích xuất cung cấp dữ liệu trang.

Các nội dung trên là ghi nhận lịch sử; phải kiểm tra mã nguồn thực tế trước khi kết luận vẫn tồn tại hoặc hoạt động đúng.

## 5. Rủi ro/khoảng trống kỹ thuật đã ghi nhận
- Phân biệt trạng thái API thất bại với fallback cục bộ cần được hoàn thiện; không được gắn trạng thái hoàn thành AI cho fallback.
- Chưa xác minh đầy đủ API/trường dữ liệu trang của phiên bản `pdf-parse` đang cài.
- OCR confidence dưới một ngưỡng chưa được hiệu chuẩn không được coi là thước đo chất lượng đã xác thực.
- Dữ liệu OCR/trang cần được liên kết với kết quả thẩm định và báo cáo.
- Cần kiểm thử việc lọc trích dẫn để tránh loại nhầm phát hiện hợp lệ.
- Cần kiểm tra tên model Gemini qua tài liệu chính thức và môi trường thực tế; không tự đoán model ID.
- Cần xây dựng coverage framework và tiêu chí kết quả có bằng chứng.
- Cần xây dựng ma trận sản phẩm × hoạt động và bộ quy tắc cấu hình.
- Cần kiểm thử tài liệu ghép, trang mất, trang trùng, trang không liên tục và nhận diện sai.

## 6. Bộ hồ sơ kiểm thử hồi quy đã ghi nhận
Đã có một vòng kiểm thử 7 nhóm hồ sơ, bao gồm:
- Đơn đề nghị;
- Bản thuyết minh;
- Giấy khám sức khỏe;
- Tài liệu xác nhận kiến thức ATTP;
- Hồ sơ có nội dung về địa chỉ và căn cứ pháp lý;
- Hồ sơ ghép hợp đồng, hóa đơn và giấy chứng nhận;
- Tình huống OCR không rõ và fallback cục bộ.

Khi kiểm thử lại, phải dùng bản hồ sơ được phép, ghi mã bộ test và phiên bản quy tắc; không coi nhận xét lịch sử là kết luận pháp lý hiện hành nếu chưa xác minh lại.

## 7. Ưu tiên công việc tiếp theo
### P0 — Tính đúng đắn và minh bạch
1. Kiểm tra HEAD nhánh và trạng thái CI/Preview.
2. Kiểm tra luồng API/fallback, phân biệt rõ trạng thái kỹ thuật.
3. Kiểm tra PDF page extraction và lưu bằng chứng OCR.
4. Xây coverage/result schema, không giả tạo độ bao phủ.

### P1 — Nghiệp vụ lõi
5. Hoàn thiện bản đồ sản phẩm – hoạt động – cơ sở.
6. Xây ma trận sản phẩm × hoạt động có thể cấu hình.
7. Xây bộ đánh giá khoa học/kỹ thuật/năng lực theo ngành.
8. Xây đối chiếu chuỗi cung ứng và cân đối dòng vật chất.
9. Xây quản trị tri thức pháp lý/khoa học có phiên bản.

### P2 — Vận hành
10. Báo cáo thẩm định có bằng chứng và phạm vi kiểm tra.
11. Phân luồng theo rủi ro, quản lý xác minh thực địa và nhật ký.
12. Hoàn thiện bộ kiểm thử hồi quy và tiêu chí nghiệm thu.

## 8. Trạng thái triển khai phải xác minh lại
Ở lần ghi nhận trước:
- Deployment gắn với commit `5515bd66828c2c85e691abc3a4bdef7142234435` được ghi nhận ở trạng thái QUEUED.
- Preview URL từng thấy: `https://phan-mem-tham-dinh-van-bsuwuakqz-tuan-s-projects19.vercel.app`.
- Preview bị SSO bảo vệ.
- Không có xác nhận cuối cùng về deployment READY hoặc build pass.

Các thông tin deployment này có thể đã lỗi thời. Bắt buộc kiểm tra lại trước khi thông báo trạng thái hiện tại.

## 9. Nhật ký cập nhật tài liệu
- 10/11/2026: Tạo bộ tài liệu kiến trúc gốc V2.1-draft; thống nhất phạm vi toàn chuỗi, mô hình sản phẩm – hoạt động – cơ sở, Knowledge Brain và cơ chế bàn giao xuyên phiên.

## 10. Mẫu bắt buộc khi kết thúc mỗi phiên
Cập nhật các mục:
- Ngày/giờ cập nhật:
- Nhánh và commit HEAD:
- Các tệp đã thay đổi:
- Mục tiêu và lý do:
- Kết quả kiểm thử (lệnh, kết quả, bằng chứng):
- CI/Preview/Production:
- Vấn đề còn tồn tại:
- Rủi ro và quyết định cần chủ dự án:
- Việc tiếp theo, thứ tự ưu tiên:
- Tài liệu nào đã cập nhật:

## 11. Mẫu bắt buộc khi mở phiên mới
Đọc tài liệu này cùng:
- `00_DOCUGUARD_MASTER_SPEC.md`;
- `01_BUSINESS_DOMAIN_MAP.md`;
- `02_LEGAL_SCIENCE_KNOWLEDGE.md`;
- `03_TECHNICAL_ARCHITECTURE.md`.

Sau đó kiểm tra repo, branch, commit, CI và deployment thực tế. Không yêu cầu người dùng nhắc lại các nguyên tắc đã có trong tài liệu. Nếu thông tin mâu thuẫn, nêu rõ và xác minh, không tự chọn một phiên bản theo suy đoán.
