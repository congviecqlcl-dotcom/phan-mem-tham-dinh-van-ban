# Báo cáo rà soát an toàn kỹ thuật — bản cập nhật

Phạm vi: rà soát tĩnh một phần mã trên nhánh thử nghiệm `safety-review/attp-audit-hardening`, tập trung vào `server.ts`, `src/components/DocumentAuditor.tsx` và `src/utils/auditEngine.ts`. Đây chưa phải kiểm toán toàn bộ hệ thống.

## Các thay đổi đã thực hiện trên nhánh thử nghiệm

1. Giảm các tuyên bố trong prompt rằng AI có kiến thức pháp luật “tuyệt đối chính xác” hoặc tạo bản sửa “100%”.
2. Thêm cảnh báo giao diện rằng điểm số/nhãn là gợi ý sàng lọc, không phải kết luận pháp lý; đổi một số nhãn sang “GỢI Ý”.
3. Sửa thông điệp của bộ kiểm tra cục bộ: không phát hiện dấu hiệu theo mẫu không chứng minh văn bản tuân thủ pháp luật.
4. **Tắt việc tự động thay thế nội dung văn bản bằng chuỗi regex diện rộng trong bộ kiểm tra chạy trên trình duyệt.** Bản xuất hiện tại giữ nguyên nội dung gốc; không được hiểu là bản đã được sửa chuẩn. Cần xây dựng cơ chế đề xuất từng thay đổi, chỉ rõ đoạn gốc, nội dung đề xuất, lý do và căn cứ có thể kiểm chứng, rồi yêu cầu người dùng chấp thuận từng thay đổi trước khi áp dụng.

## Cập nhật tiếp theo trên nhánh thử nghiệm

- Giao diện không còn dùng một số nhãn “Đạt chuẩn/Không đạt” làm kết luận; các nhãn được đổi thành gợi ý sàng lọc.
- Đã bỏ điểm tổng hợp tự đặt khỏi giao diện chính, bảng tổng hợp và báo cáo Word; giao diện dùng số lượng dấu hiệu cần rà soát. Trường điểm cũ vẫn tồn tại trong kiểu dữ liệu để tránh thay đổi API đột ngột và chưa được loại bỏ hoàn toàn.
- Tên tệp, thư mục ZIP và mô tả tài liệu xuất đã được đổi để phản ánh rằng nội dung văn bản gốc đang được giữ nguyên, chưa tự động sửa.
- Định dạng Word được tạo ra vẫn chỉ là định dạng trình bày tham khảo; chưa được xác nhận là tuân thủ đầy đủ Nghị định 30/2020/NĐ-CP.
- Các thay đổi này mới được ghi vào nhánh; chưa có build/lint/test để xác nhận không phát sinh lỗi giao diện, kiểu dữ liệu hoặc xuất tệp.

## Rà soát máy chủ — phát hiện mới

- Bộ quy tắc dự phòng phía máy chủ đã được sửa để giữ nguyên văn bản đầu vào, không tự thay thế nội dung bằng regex diện rộng.
- Kết quả từ Gemini hiện cũng bị ghi đè trường `fixedDocument` bằng đúng nội dung đầu vào; nội dung AI viết lại chưa được đưa ra làm bản “đã sửa” trước khi có quy trình xem diff và người dùng duyệt.
- Đã bỏ thông điệp dự phòng tuyên bố “tuân thủ đúng 100%” và thay bằng giới hạn của bộ quy tắc sàng lọc.
- **Rủi ro bảo mật nghiêm trọng còn mở:** trong các route được kiểm tra, chưa thấy middleware xác thực/phân quyền cho `/api/parse-document`, `/api/audit-document`, `/api/batch-audit-documents` và `/api/chat`. Đây là phát hiện từ mã đã đọc, chưa xác minh lớp bảo vệ ngoài ứng dụng. Không triển khai công khai hoặc gửi hồ sơ nghiệp vụ thật qua các route này cho đến khi xác minh và xử lý xác thực, phân quyền, giới hạn tần suất, kích thước yêu cầu và kiểm soát chi phí.
- Các route vẫn dùng giới hạn body 50 MB; chưa kiểm thử chống lạm dụng hoặc đo tài nguyên.

## Rủi ro còn tồn tại — chưa được xử lý xong

1. **Điểm số tổng hợp:** đã loại bỏ điểm tổng hợp tự đặt khỏi giao diện và báo cáo Word; thay bằng số lượng dấu hiệu phát hiện theo mẫu. Trường `overallScore` vẫn còn trong cấu trúc dữ liệu để tương thích ngược và hiện được đặt bằng 0 ở bộ kiểm tra cục bộ; cần loại bỏ trường này hoàn toàn trong một đợt thay đổi có kiểm thử API. Điểm nhóm cũ vẫn còn trong dữ liệu kết quả nhưng giao diện chuyển sang số lượng dấu hiệu, không hiển thị tỷ lệ tuân thủ.

2. **Quy tắc pháp lý cục bộ:** nhiều quy tắc, giải thích và viện dẫn được viết cứng trong mã. Chưa xác minh độc lập hiệu lực, phạm vi áp dụng, phiên bản và tính chính xác của từng điều khoản. Phải coi chúng là dấu hiệu sàng lọc chưa được thẩm định, không phải cơ sở pháp lý đã xác nhận.
3. **Máy chủ/API:** rà soát trước đó chưa xác minh được xác thực và phân quyền thực tế cho các tuyến API. Không phát hành công khai trước khi kiểm tra đầy đủ lớp ứng dụng và cấu hình nền tảng.
4. **Dữ liệu hồ sơ:** cần kiểm tra cách lưu, truyền, ghi log, thời hạn lưu và quyền truy cập đối với hồ sơ có thông tin cá nhân hoặc thông tin nghiệp vụ.
5. **Lịch sử thẩm định:** cần kiểm tra toàn bộ luồng cập nhật/xóa kết quả, bằng chứng và báo cáo để bảo đảm mỗi lần chạy được lưu phiên bản, không âm thầm ghi đè hoặc xóa lịch sử.
6. **Xuất tệp:** tên tệp hoặc nút tải xuống vẫn có thể mô tả bản xuất như văn bản “chuẩn” dù nội dung đang giữ nguyên. Cần đổi tên/nhãn sang “bản gốc” hoặc “dự thảo đề xuất” đúng với nội dung thực tế trước khi đưa vào sử dụng.
7. **Kết quả Gemini và dự phòng:** cần thể hiện rõ kết quả đến từ AI, quy tắc cục bộ hay lỗi hệ thống; không được trình bày câu trả lời dự phòng chưa có nguồn xác minh như kết luận pháp lý.

## Nguyên tắc an toàn bắt buộc

- Phân biệt dữ kiện trích từ hồ sơ, suy luận, quy tắc cục bộ và căn cứ pháp luật đã kiểm chứng.
- Mỗi phát hiện nên có đoạn/vị trí nguồn, căn cứ và phiên bản áp dụng, phương pháp, giới hạn chứng minh, trạng thái xác minh.
- Thiếu bằng chứng không tự động đồng nghĩa với vi phạm; không phát hiện mâu thuẫn trong dữ liệu đã trích không chứng minh hồ sơ nhất quán đầy đủ.
- Không dùng điểm số tự đặt làm kết luận pháp lý.
- Không tự sửa, ghi đè hoặc xóa nội dung hồ sơ; mọi đề xuất sửa phải được xem xét và chấp thuận rõ ràng.
- Không triển khai công khai, không kết nối hồ sơ nghiệp vụ thật và không thay đổi dữ liệu vận hành khi chưa có xác nhận của chủ dự án.

## Trạng thái kiểm thử

- Đã ghi thay đổi mã trên nhánh thử nghiệm, chưa nhập vào `main`.
- Chưa chạy build, lint hoặc kiểm thử hồi quy trong môi trường thực thi.
- Chưa xác minh toàn bộ căn cứ pháp luật.
- Chưa xác minh đầy đủ xác thực, phân quyền, lưu trữ và cấu hình triển khai.
- Chưa triển khai công khai.

Đây là báo cáo rà soát kỹ thuật ban đầu, không phải kết luận pháp lý hoặc chứng nhận an toàn của toàn hệ thống.

## Phòng vệ bổ sung cho API — giới hạn đầu vào

Trên nhánh thử nghiệm, đã bổ sung các giới hạn kỹ thuật ở phía máy chủ:

- Giảm giới hạn body JSON/form từ 50 MB xuống 20 MB.
- Giới hạn dữ liệu tệp dạng Base64 ở 15.000.000 ký tự trước khi xử lý.
- Giới hạn nội dung văn bản ở 250.000 ký tự mỗi văn bản.
- Giới hạn một lượt thẩm định hàng loạt tối đa 5 văn bản; kiểm tra kiểu dữ liệu và độ dài trước khi gọi bộ máy thẩm định.
- Giới hạn câu hỏi trợ lý ở 10.000 ký tự.
- Trả lỗi 400/413 cho đầu vào không hợp lệ hoặc vượt giới hạn, thay vì tiếp tục xử lý.

**Giới hạn của biện pháp này:** đây chỉ là kiểm soát kích thước và khối lượng đầu vào, không phải xác thực, phân quyền hay giới hạn tần suất theo người dùng/IP. Chưa có kiểm thử build, tải, tệp biên hoặc kiểm thử hồi quy; cần xác nhận các giới hạn tương thích với kích thước hồ sơ thực tế. Rủi ro API chưa xác thực vẫn là điều kiện chặn triển khai công khai.

## Loại bỏ suy diễn trạng thái đạt/không đạt từ điểm sàng lọc

- Bộ kiểm tra cục bộ phía trình duyệt và máy chủ không còn ánh xạ điểm số heuristic sang các trạng thái `DAT`, `CAN_SUA_DOI`, `KHONG_DAT`.
- Mọi kết quả thẩm định tự động hiện mang trạng thái `CAN_XAC_MINH` — “Cần công chức xác minh”. Trạng thái này được cập nhật trong kiểu dữ liệu, giao diện và báo cáo Word.
- Đầu ra có cấu trúc của Gemini chỉ chấp nhận trạng thái `CAN_XAC_MINH`; không dùng nhãn do mô hình tạo ra để tuyên bố hồ sơ đạt/không đạt.
- Bảng tổng hợp không còn chia văn bản thành nhóm đạt/không đạt dựa trên điểm; các ô nhóm cũ được đổi nhãn để nhấn mạnh rằng kết quả đang chờ xác minh.

**Lưu ý còn mở:** trường điểm sàng lọc và các điểm thành phần vẫn tồn tại dưới dạng chỉ báo heuristic, chưa được kiểm chứng là thước đo có ý nghĩa nghiệp vụ. Không dùng điểm để quyết định hoặc xếp hạng tính hợp pháp. Cần cân nhắc thay điểm bằng số lượng dấu hiệu theo mức độ và mức độ bao phủ kiểm tra có thể giải thích được. Chưa chạy build/lint/test nên cần kiểm tra tương thích kiểu dữ liệu, JSX và báo cáo xuất trước khi nhập nhánh chính.



## Cập nhật tiếp theo — loại bỏ điểm số khỏi hiển thị

- Giao diện không còn hiển thị điểm tổng hợp `x/100`, điểm trung bình theo lô hoặc thanh phần trăm theo nhóm; thay bằng số lượng dấu hiệu theo mẫu kiểm tra.
- Báo cáo Word cá nhân và báo cáo tổng hợp dùng số lượng dấu hiệu, không dùng điểm tổng hợp để xếp hạng.
- Bộ kiểm tra cục bộ không còn tính điểm tổng hợp từ trọng số tự đặt. Trường `overallScore` tạm giữ giá trị 0 để tương thích cấu trúc API cũ; cần một đợt dọn kiểu dữ liệu và kiểm thử tích hợp trước khi xóa trường.
- Đây là sửa đổi mã trên nhánh thử nghiệm. Chưa chạy build, lint hoặc test tự động; cần kiểm tra JSX/TypeScript và mọi luồng xuất Word trước khi coi là hoàn tất.

- Cập nhật tiếp: đã bỏ các trường điểm và điểm tối đa khỏi nhóm `CategoryScore` trong bộ kiểm tra cục bộ và máy chủ; trường tổng hợp legacy `overallScore` vẫn tạm tồn tại bằng 0 để tương thích API.

- Đã rà soát thêm đường xử lý Gemini và dự phòng phía máy chủ: bỏ điểm thành phần và các phép trừ điểm theo mức độ; schema không còn yêu cầu mô hình tạo điểm tổng hợp, máy chủ ghi đè trường legacy `overallScore` bằng 0. Cần kiểm thử thực tế cả đường Gemini và đường dự phòng trước khi phát hành.


## Kết quả CI — 20/10/2026

GitHub Actions run trên commit `811d638aa84e62843205f434f8f7cfdd8910e206` đã hoàn tất thành công:

- `npm run lint`: thành công.
- `npm run build`: thành công.
- Workflow: [Quality checks run 39382261273](https://github.com/congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban/actions/runs/39382261273).

Kết quả này xác nhận TypeScript check và build production trên commit nói trên, không thay thế kiểm thử chức năng, kiểm thử bảo mật, kiểm thử tải hoặc xác minh pháp lý. Chưa có `package-lock.json`; quy trình hiện dùng `npm install`, nên việc tái lập chính xác phiên bản phụ thuộc chưa được bảo đảm.

## Rà soát tiếp theo — các điểm API cần xử lý

- Trong các route `/api/parse-document`, `/api/audit-document`, `/api/batch-audit-documents` và `/api/chat` đã đọc, chưa thấy middleware xác thực/phân quyền ở cấp ứng dụng. Chưa xác minh có lớp bảo vệ bên ngoài hay không.
- `/api/audit-document` trả kết quả dự phòng với HTTP 200 khi có lỗi xử lý; cần phân biệt rõ lỗi hệ thống với kết quả phân tích dự phòng để giao diện không hiểu nhầm rằng AI đã xử lý thành công.
- Kiểm tra đầu vào Base64 hiện giới hạn độ dài chuỗi nhưng chưa đủ để chứng minh dữ liệu thực sự là Base64 hợp lệ hoặc loại tệp đúng với nội dung.
- Chưa có giới hạn tần suất theo người dùng/IP; giới hạn body và batch không thay thế biện pháp này.

Không nên thêm một token bí mật cố định vào mã trình duyệt để “bảo vệ” API vì người dùng có thể trích xuất token. Thiết kế xác thực cần gắn với phiên người dùng được xác minh ở máy chủ hoặc cổng tin cậy phía trước; sau đó mới bổ sung giới hạn tần suất, kiểm soát chi phí và kiểm thử truy cập trái phép.
