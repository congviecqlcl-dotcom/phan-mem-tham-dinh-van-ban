# Thiết kế mô-đun quản trị tài khoản và phân quyền V1

> Tài liệu thiết kế trên nhánh thử nghiệm. Chưa triển khai mã chức năng, chưa thay đổi Supabase và chưa cấp vai trò cho bất kỳ tài khoản nào.

## 1. Mục tiêu

- Quản lý tài khoản ứng dụng gắn với Supabase Auth.
- Quản lý trạng thái hoạt động và vai trò nghiệp vụ.
- Chỉ người có vai trò QUAN_TRI mới được truy cập chức năng quản trị.
- Mọi thay đổi quyền phải được xác thực ở máy chủ, ghi nhật ký và có khả năng truy vết.
- Không cho phép người dùng tự cấp quyền hoặc tự nâng quyền.

## 2. Schema đã kiểm tra trực tiếp trên Supabase

Dự án `nresxqsvdhzqoetsvhhr`, schema `public`:

| Bảng | Cột và ràng buộc đã xác nhận |
|---|---|
| `public.app_users` | `user_id uuid` là khóa chính, đồng thời khóa ngoại đến `auth.users(id)`; `display_name text` nullable; `is_active boolean NOT NULL DEFAULT true`; `created_at timestamptz NOT NULL DEFAULT now()`. RLS đang bật. |
| `public.user_roles` | `user_id uuid`, `role_code text`; khóa chính ghép `(user_id, role_code)`; khóa ngoại `user_id` đến `app_users(user_id)`; CHECK chỉ nhận `CONG_CHUC`, `LANH_DAO`, `QUAN_TRI`. RLS đang bật. |

Các hệ quả kỹ thuật:

1. `app_users` hiện không có cột email. Không thể lấy email từ bảng này để hiển thị danh sách tài khoản.
2. `user_roles` cho phép một tài khoản có nhiều vai trò cùng lúc do khóa chính ghép theo cả `user_id` và `role_code`.
3. Khóa ngoại bảo đảm không tạo vai trò cho một `user_id` chưa có trong `app_users`, nhưng không tự bảo đảm tài khoản Auth và hồ sơ ứng dụng luôn được đồng bộ theo mọi luồng.
4. Không được mở rộng RLS hiện hữu chỉ để giao diện quản trị đọc được toàn bộ người dùng.

## 3. Mục tiêu dữ liệu và vai trò

- `auth.users`: danh tính xác thực do Supabase Auth quản lý.
- `public.app_users`: hồ sơ ứng dụng, trạng thái hoạt động.
- `public.user_roles`: các vai trò nghiệp vụ.
- Vai trò hợp lệ: `CONG_CHUC`, `LANH_DAO`, `QUAN_TRI`.

Không lưu mật khẩu, access token hoặc refresh token vào bảng nghiệp vụ hay nhật ký.

## 4. Ma trận quyền V1

| Chức năng | CONG_CHUC | LANH_DAO | QUAN_TRI |
|---|---:|---:|---:|
| Thẩm định hồ sơ, trích xuất, trợ lý AI, thư viện, biểu mẫu | Có | Có | Có |
| Xem danh sách tài khoản | Không | Không mặc định | Có |
| Tạo hồ sơ tài khoản ứng dụng / gửi lời mời | Không | Không | Có |
| Kích hoạt / tạm khóa tài khoản ứng dụng | Không | Không | Có |
| Gán / thu hồi vai trò | Không | Không | Có |
| Xem nhật ký quản trị | Không | Theo phân công riêng | Có |
| Thay đổi cấu hình bảo mật | Không | Không | Có, với xác nhận tăng cường |

Quyền nghiệp vụ trên hồ sơ phải được giới hạn theo đơn vị, nhiệm vụ và phạm vi phân công. Vai trò LANH_DAO không mặc nhiên đồng nghĩa được xem mọi hồ sơ.

## 5. Kiến trúc bắt buộc

1. Giao diện chỉ là lớp trình bày; không phải ranh giới bảo mật.
2. Máy chủ xác minh Bearer token với Supabase Auth.
3. Máy chủ kiểm tra trạng thái tài khoản và vai trò từ nguồn dữ liệu tin cậy.
4. Các thao tác quản trị phải qua API riêng có middleware chỉ cho QUAN_TRI.
5. Không cho phép trình duyệt gửi trực tiếp lệnh INSERT/UPDATE/DELETE vào bảng vai trò.
6. RLS hiện chỉ cho phép người dùng đọc dữ liệu của chính mình. Không nới lỏng chính sách này chỉ để làm giao diện quản trị.
7. Với danh sách Auth user và các thao tác quản trị Auth, phương án phù hợp là Supabase Admin API chỉ gọi từ máy chủ bằng secret lưu trong biến môi trường Vercel Preview. Secret không được đưa vào biến `VITE_*`, mã nguồn trình duyệt, log hoặc phản hồi API. Nếu thiếu secret, API phải từ chối an toàn.
8. Việc cập nhật `app_users`, `user_roles` và nhật ký phải được thiết kế nguyên tử. Không dùng nhiều lệnh cập nhật rời rạc mà có thể để lại trạng thái nửa chừng.
9. Không dùng `user_metadata` hoặc dữ liệu do client gửi làm nguồn phân quyền nghiệp vụ.
10. Mọi endpoint quản trị phải kiểm tra lại vai trò QUAN_TRI tại thời điểm thực hiện; không chỉ dựa vào trạng thái giao diện hoặc vai trò lưu ở client.

## 6. Quy tắc chống tự nâng quyền và khóa nhầm

- Không có API tự gán QUAN_TRI cho chính người gọi.
- Không cho phép thu hồi vai trò QUAN_TRI cuối cùng.
- Không cho phép khóa tài khoản quản trị cuối cùng.
- Thao tác đổi vai trò phải ghi người thực hiện, người bị tác động, vai trò cũ/mới, thời điểm, lý do và kết quả.
- Yêu cầu xác nhận lại trước thao tác cấp/thu hồi QUAN_TRI hoặc khóa tài khoản.
- Nhật ký không chứa mật khẩu, token, mã OTP hoặc dữ liệu xác thực bí mật.
- Từ chối mặc định khi không truy vấn được vai trò, trạng thái tài khoản hoặc nhật ký.
- Phải xử lý trường hợp tài khoản Auth đã tồn tại nhưng thiếu `app_users`, hoặc có `app_users` nhưng không có vai trò: không tự suy diễn và không tự cấp vai trò mặc định.

## 7. Luồng quản trị tài khoản dự kiến

1. Quản trị viên mở mục Quản lý tài khoản.
2. Máy chủ xác minh phiên và vai trò QUAN_TRI.
3. Máy chủ lấy danh sách Auth user qua Admin API và ghép với hồ sơ ứng dụng/vai trò. Chỉ trả dữ liệu tối thiểu cần cho giao diện.
4. Quản trị viên chọn một tài khoản và thao tác.
5. Máy chủ kiểm tra lại quyền quản trị và trạng thái mục tiêu ngay tại thời điểm ghi.
6. Máy chủ thực hiện thay đổi trong giao dịch hoặc RPC nguyên tử.
7. Ghi nhật ký kết quả; trả phản hồi thành công/thất bại rõ ràng.
8. Giao diện tải lại trạng thái từ máy chủ; không tự suy diễn quyền từ phản hồi client.

## 8. Điều kiện trước khi triển khai phần ghi dữ liệu

- Chốt schema nhật ký quản trị: tối thiểu người thực hiện, đối tượng, hành động, dữ liệu trước/sau ở mức không nhạy cảm, lý do, kết quả, thời điểm và mã tương quan.
- Thiết kế giao dịch/RPC cho việc thay đổi vai trò, trạng thái ứng dụng và nhật ký; có khóa/kiểm soát đồng thời để bảo vệ quản trị viên cuối cùng.
- Xác định quy trình gửi lời mời Auth. Không lưu hoặc tự đặt mật khẩu thay người dùng.
- Bổ sung biến môi trường server-only cho Supabase Admin API trong Vercel Preview do chủ dự án tự cấu hình; không gửi secret qua hội thoại.
- Kiểm tra đầy đủ schema, RLS, quyền GRANT và các trigger hiện có trước khi viết migration.
- Chạy kiểm thử bảo mật và Security Advisor trước khi đề xuất áp dụng migration lên dự án.

## 9. Ma trận kiểm thử bắt buộc

| Tình huống | Kết quả mong đợi |
|---|---|
| Không có token | 401 |
| Token sai / hết hạn | 401 |
| Tài khoản không tồn tại trong app_users | 403 |
| Tài khoản is_active=false | 403 |
| Không có vai trò hợp lệ | 403 |
| CONG_CHUC gọi API quản trị | 403 |
| LANH_DAO gọi API quản trị | 403, trừ quyền được cấp riêng rõ ràng |
| QUAN_TRI gọi API quản trị | Được phép nếu tài khoản đang hoạt động |
| Thiếu biến môi trường Admin API | 503, không lộ thông tin cấu hình |
| Người dùng tự gán QUAN_TRI cho mình | Bị từ chối |
| Thu hồi QUAN_TRI cuối cùng | Bị từ chối |
| Khóa quản trị viên cuối cùng | Bị từ chối |
| Cơ sở dữ liệu / dịch vụ vai trò lỗi | 503, không cấp quyền |
| Ghi vai trò thành công | Có nhật ký đầy đủ |
| Ghi nhật ký thất bại | Giao dịch thay đổi quyền bị rollback |
| Client sửa request body để giả vai trò | Không ảnh hưởng kết quả phân quyền |
| Auth user thiếu app_users hoặc user_roles | Hiển thị trạng thái chưa đồng bộ; không tự cấp quyền |

## 10. Trạng thái và giới hạn

- Đã kiểm tra trực tiếp schema, khóa chính, khóa ngoại, CHECK constraint và trạng thái RLS của `app_users`, `user_roles`.
- Đã xác định `app_users` chưa có email; danh sách tài khoản cần nguồn Auth Admin API phía máy chủ.
- Chưa thêm API quản trị hoặc giao diện quản trị.
- Chưa tạo migration SQL/RPC.
- Chưa thay đổi dữ liệu, RLS, Auth settings hoặc secrets Supabase.
- Chưa cấp vai trò QUAN_TRI cho tài khoản `congviecqlcl@gmail.com`.
- Chưa merge PR và chưa triển khai Production.
