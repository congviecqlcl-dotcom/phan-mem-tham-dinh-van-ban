# Kế hoạch khắc phục bảo mật API — hệ thống thẩm định ATTP

**Trạng thái:** Kế hoạch kỹ thuật, chưa phải bản triển khai.
**Phạm vi:** Nhánh `security/supabase-auth-integration-plan`, tạo từ `safety-review/attp-audit-hardening`.
**Nguyên tắc:** Không hợp nhất vào `main`, không triển khai công khai và không sử dụng hồ sơ nghiệp vụ thật trước khi các cổng an toàn được nghiệm thu.

## 1. Phát hiện đã xác nhận

### 1.1. API của ứng dụng Express

Trong `server.ts`, các tuyến sau nhận yêu cầu trực tiếp và chưa thấy middleware xác thực/phân quyền ở cấp ứng dụng:

- `POST /api/parse-document`
- `POST /api/audit-document`
- `POST /api/batch-audit-documents`
- `POST /api/chat`

Đã có kiểm tra kích thước và định dạng đầu vào, nhưng các biện pháp đó **không thay thế xác thực, phân quyền hoặc giới hạn tần suất**. Nếu các tuyến này có thể truy cập từ Internet, người lạ có thể tiêu thụ tài nguyên máy chủ hoặc hạn mức Gemini.

### 1.2. Cơ sở dữ liệu Supabase hiện có

Đã tìm thấy dự án phát triển đang hoạt động `cong-chuc-tham-dinh-attp-dev` (ref `nresxqsvdhzqoetsvhhr`). Kiểm tra chỉ đọc cho thấy:

- Có các bảng `app_users` và `user_roles`.
- `app_users` có trường `is_active`.
- Vai trò được sử dụng trong chính sách RLS gồm `CONG_CHUC`, `LANH_DAO`, `QUAN_TRI`.
- Các bảng nghiệp vụ đã bật RLS và chính sách đọc dựa trên `has_app_role(...)`.
- Hàm `public.has_app_role` kiểm tra vai trò của `auth.uid()` và yêu cầu tài khoản đang hoạt động.

Đây là nền tảng phù hợp để tích hợp xác thực, nhưng **chưa chứng minh ứng dụng React/Express hiện tại đã sử dụng Supabase Auth**. Không có thay đổi nào được thực hiện trên cơ sở dữ liệu trong đợt rà soát này.

## 2. Thiết kế khắc phục đề xuất

### 2.1. Đăng nhập và xác thực danh tính

1. Tích hợp Supabase Auth vào giao diện người dùng; không tự xây cơ chế mật khẩu riêng.
2. Giao diện gửi access token trong tiêu đề `Authorization: Bearer <token>` khi gọi API cần bảo vệ.
3. Máy chủ xác minh token bằng cơ chế xác minh chính thức của Supabase (không chỉ giải mã JWT hoặc tin vào dữ liệu do trình duyệt gửi).
4. Máy chủ lấy danh tính người dùng đã xác minh, kiểm tra hồ sơ `app_users.is_active = true` và vai trò trong `user_roles`.
5. Từ chối mặc định nếu thiếu cấu hình, token không hợp lệ, tài khoản bị khóa, thiếu vai trò hoặc dịch vụ xác minh không khả dụng. Không được chuyển sang chế độ cho phép truy cập khi xác thực lỗi.

### 2.2. Phân quyền theo tuyến

| Tuyến | Chính sách dự kiến |
|---|---|
| `POST /api/parse-document` | Bắt buộc đăng nhập; chỉ vai trò nghiệp vụ được phép xử lý hồ sơ |
| `POST /api/audit-document` | Bắt buộc đăng nhập; chỉ vai trò nghiệp vụ được phép thẩm định |
| `POST /api/batch-audit-documents` | Bắt buộc đăng nhập; giới hạn chặt hơn do tiêu thụ tài nguyên lớn |
| `POST /api/chat` | Bắt buộc đăng nhập; giới hạn tần suất và ngân sách |
| `GET /api/health` | Chỉ trả trạng thái tối thiểu; tuyệt đối không trả bí mật, biến môi trường hoặc thông tin nội bộ |

Không nhận vai trò từ payload, query string hoặc local storage. Vai trò phải được lấy từ nguồn máy chủ tin cậy sau khi xác thực.

### 2.3. Giới hạn tần suất và chi phí

- Dùng bộ giới hạn tần suất có lưu trạng thái dùng chung, phù hợp môi trường triển khai nhiều phiên bản/serverless; không coi bộ đếm trong bộ nhớ của một tiến trình là bảo vệ đầy đủ.
- Tách hạn mức cho trích xuất tệp, thẩm định đơn, thẩm định hàng loạt và trợ lý AI.
- Giới hạn theo người dùng đã xác thực; bổ sung theo IP khi có thể xác định IP qua proxy tin cậy đã cấu hình.
- Trả HTTP 429 và thông báo tiếng Việt khi vượt hạn mức.
- Có giới hạn ngân sách/khối lượng gọi Gemini, thời gian chờ và xử lý lỗi; không ghi nội dung hồ sơ hoặc token vào log.

### 2.4. Bảo vệ dữ liệu hồ sơ

- Không ghi văn bản hồ sơ, Base64, access token hoặc khóa bí mật vào log.
- Chỉ ghi mã yêu cầu, người dùng đã xác thực, thời điểm, tuyến, kết quả xử lý và mã lỗi tối thiểu cần thiết.
- Không lưu hồ sơ vào cơ sở dữ liệu nếu chưa có mục đích, quyền truy cập, thời hạn lưu và quy trình xóa được phê duyệt.
- Giữ giới hạn kích thước hiện có; bổ sung kiểm thử tệp giả mạo phần mở rộng, tệp hỏng và tệp nén bất thường.

## 3. Biến môi trường và bí mật

Tên biến dự kiến (cần đối chiếu cấu hình triển khai trước khi áp dụng):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` hoặc khóa publishable tương ứng
- Cấu hình nhà cung cấp giới hạn tần suất dùng chung
- `GEMINI_API_KEY` (chỉ ở máy chủ)

Không đưa khóa bí mật vào mã nguồn, biến `VITE_*`, giao diện trình duyệt hoặc tệp kiểm thử. Không sử dụng `service_role` key trong trình duyệt. Nếu máy chủ cần quyền quản trị cơ sở dữ liệu, phải thiết kế riêng và chứng minh cần thiết; ưu tiên xác thực người dùng bằng token của họ cùng RLS.

## 4. Cổng kiểm thử bắt buộc

### Xác thực và phân quyền
- Không có token → HTTP 401.
- Token sai, hết hạn hoặc bị thu hồi → HTTP 401.
- Người dùng không có hồ sơ ứng dụng hoặc `is_active = false` → bị từ chối.
- Người dùng đăng nhập nhưng không có vai trò được phép → HTTP 403.
- Người dùng sửa payload để tự khai vai trò quản trị → vẫn bị từ chối.
- Supabase xác thực không khả dụng → từ chối mặc định, không chạy AI.

### Giới hạn tài nguyên
- Gửi liên tiếp vượt hạn mức → HTTP 429.
- Lô vượt số lượng, văn bản quá dài, Base64 sai hoặc tệp vượt kích thước → bị chặn trước khi gọi Gemini.
- Xác minh giới hạn hoạt động đúng qua nhiều phiên bản máy chủ.
- Kiểm tra timeout, lỗi Gemini và dự phòng; phản hồi phải phân biệt rõ lỗi AI với kết quả do quy tắc cục bộ.

### Hồi quy nghiệp vụ
- Đăng nhập/đăng xuất, hết hạn phiên và làm mới phiên.
- Đọc PDF/DOCX/TXT, lỗi trích xuất và tải hàng loạt.
- Thẩm định đơn/lô và xuất Word.
- Không có đầu ra nào được tuyên bố là kết luận pháp lý tự động.
- Không có dữ liệu hồ sơ thật trong fixture, log hoặc báo cáo CI.

## 5. Điều kiện nghiệm thu trước khi hợp nhất

- [ ] Middleware xác thực và phân quyền đã có mã, có kiểm thử đơn vị/tích hợp.
- [ ] Giao diện đăng nhập sử dụng Supabase Auth và không làm lộ bí mật.
- [ ] RLS và vai trò đã được kiểm thử bằng tài khoản không quyền, công chức, lãnh đạo và quản trị.
- [ ] Giới hạn tần suất dùng chung đã được cấu hình, kiểm thử.
- [ ] Các kiểm tra TypeScript, unit test và production build đều thành công.
- [ ] Kiểm thử bảo mật API, tệp và hồi quy đã có bằng chứng.
- [ ] Biến môi trường được cấu hình an toàn trong Preview trước; không tự thay đổi môi trường Production.
- [ ] Chủ dự án xem xét và đồng ý hợp nhất.

## 6. Ranh giới của tài liệu này

Tài liệu này ghi lại phát hiện và thiết kế triển khai. Nó **không** có nghĩa API đã được bảo vệ, Supabase Auth đã được tích hợp hoặc ứng dụng đã đủ điều kiện vận hành. Những kết luận đó chỉ được đưa ra sau khi mã được triển khai trên nhánh thử nghiệm và các kiểm thử có bằng chứng hoàn tất.
