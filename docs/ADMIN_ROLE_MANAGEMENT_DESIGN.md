# Thiết kế mô-đun quản trị tài khoản và phân quyền V1

> Tài liệu thiết kế trên nhánh thử nghiệm. Chưa triển khai mã chức năng, chưa thay đổi Supabase và chưa cấp vai trò cho bất kỳ tài khoản nào.

## 1. Mục tiêu

- Quản lý tài khoản ứng dụng gắn với Supabase Auth.
- Quản lý trạng thái hoạt động và vai trò nghiệp vụ.
- Chỉ người có vai trò QUAN_TRI mới được truy cập chức năng quản trị.
- Mọi thay đổi quyền phải được xác thực ở máy chủ, ghi nhật ký và có khả năng truy vết.
- Không cho phép người dùng tự cấp quyền hoặc tự nâng quyền.

## 2. Phạm vi dữ liệu hiện biết

- `auth.users`: danh tính xác thực do Supabase Auth quản lý.
- `public.app_users`: `user_id`, `display_name`, `is_active`, `created_at`.
- `public.user_roles`: `user_id`, `role_code`.
- Vai trò hợp lệ: `CONG_CHUC`, `LANH_DAO`, `QUAN_TRI`.

Không lưu mật khẩu, access token hoặc refresh token vào bảng nghiệp vụ hay nhật ký.

## 3. Ma trận quyền V1

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

## 4. Kiến trúc bắt buộc

1. Giao diện chỉ là lớp trình bày; không phải ranh giới bảo mật.
2. Máy chủ xác minh Bearer token với Supabase Auth.
3. Máy chủ kiểm tra trạng thái tài khoản và vai trò từ nguồn dữ liệu tin cậy.
4. Các thao tác quản trị phải qua API riêng có middleware chỉ cho QUAN_TRI.
5. Không cho phép trình duyệt gửi trực tiếp lệnh INSERT/UPDATE/DELETE vào bảng vai trò.
6. RLS hiện chỉ cho phép người dùng đọc dữ liệu của chính mình. Không nới lỏng chính sách này chỉ để làm giao diện quản trị.
7. Cần cơ chế RPC hoặc lớp dịch vụ máy chủ đặc quyền được kiểm soát. Nếu dùng SECURITY DEFINER, phải cố định search_path, kiểm tra auth.uid() và vai trò QUAN_TRI bên trong hàm, thu hẹp EXECUTE grant, không tin tham số user_id do client cung cấp nếu chưa xác minh.
8. Không dùng user_metadata/app_metadata do client có thể tác động làm nguồn phân quyền nghiệp vụ.

## 5. Quy tắc chống tự nâng quyền và khóa nhầm

- Không có API tự gán QUAN_TRI cho chính người gọi.
- Không cho phép thu hồi vai trò QUAN_TRI cuối cùng.
- Không cho phép khóa tài khoản quản trị cuối cùng.
- Thao tác đổi vai trò phải ghi người thực hiện, người bị tác động, vai trò cũ/mới, thời điểm, lý do và kết quả.
- Yêu cầu xác nhận lại trước thao tác cấp/thu hồi QUAN_TRI hoặc khóa tài khoản.
- Nhật ký không chứa mật khẩu, token, mã OTP hoặc dữ liệu xác thực bí mật.
- Từ chối mặc định khi không truy vấn được vai trò, trạng thái tài khoản hoặc nhật ký.

## 6. Luồng quản trị tài khoản dự kiến

1. Quản trị viên mở mục Quản lý tài khoản.
2. Máy chủ xác minh phiên và vai trò QUAN_TRI.
3. Máy chủ trả danh sách tối thiểu: email, tên hiển thị, trạng thái Auth, trạng thái ứng dụng, vai trò, thời điểm tạo/đăng nhập gần nhất nếu nguồn cung cấp.
4. Quản trị viên chọn một tài khoản và thao tác.
5. Máy chủ kiểm tra lại quyền quản trị và trạng thái mục tiêu ngay tại thời điểm ghi.
6. Máy chủ thực hiện thay đổi trong giao dịch hoặc RPC nguyên tử.
7. Ghi nhật ký kết quả; trả phản hồi thành công/thất bại rõ ràng.
8. Giao diện tải lại trạng thái từ máy chủ; không tự suy diễn quyền từ phản hồi client.

## 7. Điều kiện cần trước khi lập trình phần ghi dữ liệu

- Xác nhận schema đầy đủ, khóa ngoại, unique constraint và chính sách RLS của hai bảng.
- Xác định cách gửi lời mời / tạo tài khoản Auth phù hợp; không lưu hoặc tự đặt mật khẩu thay người dùng.
- Chọn cơ chế quản trị phía máy chủ: RPC SECURITY DEFINER đã kiểm soát hoặc Supabase Admin API qua môi trường máy chủ với secret chỉ nằm trong Vercel Environment Variables. Không bao giờ đưa service_role key vào Vite/client bundle.
- Chốt yêu cầu lưu nhật ký và thời hạn lưu.
- Kiểm tra cách xử lý khi Auth user tồn tại nhưng app_users/user_roles thiếu hoặc ngược lại.

## 8. Ma trận kiểm thử bắt buộc

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
| Người dùng tự gán QUAN_TRI cho mình | Bị từ chối |
| Thu hồi QUAN_TRI cuối cùng | Bị từ chối |
| Khóa quản trị viên cuối cùng | Bị từ chối |
| Cơ sở dữ liệu / dịch vụ vai trò lỗi | 503, không cấp quyền |
| Ghi vai trò thành công | Có nhật ký đầy đủ |
| Client sửa request body để giả vai trò | Không ảnh hưởng kết quả phân quyền |

## 9. Trạng thái và giới hạn

- Đây là thiết kế nghiệp vụ/kỹ thuật, chưa phải xác nhận tuân thủ pháp luật.
- Chưa thêm API quản trị hoặc giao diện quản trị.
- Chưa tạo migration SQL/RPC.
- Chưa thay đổi dữ liệu, RLS, Auth settings hoặc secrets Supabase.
- Chưa cấp vai trò QUAN_TRI cho tài khoản `congviecqlcl@gmail.com`.
- Chưa merge PR và chưa triển khai Production.
