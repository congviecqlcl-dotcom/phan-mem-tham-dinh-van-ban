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


## 12. Mốc tài liệu kiến trúc đã ghi vào GitHub
Năm tài liệu nền tảng đã được tạo và kiểm tra đọc lại thành công trên nhánh `feature/docuguard-v2-hardening`:
- `00_DOCUGUARD_MASTER_SPEC.md`
- `01_BUSINESS_DOMAIN_MAP.md`
- `02_LEGAL_SCIENCE_KNOWLEDGE.md`
- `03_TECHNICAL_ARCHITECTURE.md`
- `04_PROJECT_STATE_AND_HANDOVER.md`

Commit cuối cùng tại thời điểm tạo bộ tài liệu: `c941f5e7feaf3ecb086c07a7b8de6f09ae9d1fbf`.
Commit tiếp theo cập nhật sổ bàn giao: `b910dc2e65922604802dbc8e72457c8d06ce0ee0`. Đây là mốc tài liệu, không phải xác nhận build, CI hoặc deployment đã thành công.


## 13. Bổ sung ma trận sản phẩm × hoạt động
Đã tạo tài liệu `05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md` trên nhánh phát triển. Nội dung gồm:
- Danh mục nhóm sản phẩm và hoạt động;
- Mô hình nhiều-nhiều chủ thể – địa điểm – sản phẩm – hoạt động;
- Bộ tiêu chí chung và chuyên ngành;
- Cơ chế sinh checklist động;
- Trạng thái áp dụng và trạng thái kết quả;
- Cân đối dòng vật chất, đánh giá năng lực và kiểm soát dấu hiệu bất thường;
- Bộ 12 ca kiểm thử nghiệm thu ma trận.

Commit tạo ma trận: `f130390dbd4b6b6eca30624d95d38320ed5a0a96`.
Đây là khung nghiệp vụ dự thảo, chưa phải danh mục quy phạm đã được xác minh/duyệt. Chưa triển khai thành chức năng chạy trong ứng dụng.


## 14. Bổ sung từ điển dữ liệu sản phẩm
Đã tạo `06_PRODUCT_DATA_DICTIONARY.md` trên nhánh `feature/docuguard-v2-hardening`. Tài liệu chuẩn hóa:
- Mô hình nhóm sản phẩm – định nghĩa – biến thể – trạng thái qua công đoạn – lô;
- Từ điển thuộc tính lõi và thuộc tính chuyên biệt theo 16 nhóm SP01–SP16;
- Nguồn gốc tự sản xuất/thu mua/nhập khẩu/gia công/hỗn hợp;
- Thành phần, đơn vị, điều kiện bảo quản, hồ sơ nguy cơ;
- Liên kết sản phẩm – hoạt động – cơ sở – lô;
- Kiểm tra chất lượng dữ liệu PDQ01–PDQ15 và tình huống kiểm thử PDT01–PDT12.

Commit tạo tài liệu: `293909dd7e14d7b0b38d084d8b3c9e7c6b034686`.
Blob SHA đã kiểm tra đọc lại: `8eb9a29df377dd2bb55704e5476f17160680a5fb`.
Tài liệu đã được kiểm tra đọc lại; đây là đặc tả dữ liệu dự thảo, chưa phải chức năng đã triển khai. Chưa có build/test/CI/Preview được thực hiện cho thay đổi tài liệu này.


## 15. Bổ sung từ điển dữ liệu hoạt động
Đã tạo `07_ACTIVITY_DATA_DICTIONARY.md` trên nhánh `feature/docuguard-v2-hardening`. Tài liệu chuẩn hóa:
- Mô hình hoạt động cụ thể theo chủ thể, địa điểm, sản phẩm và thời kỳ;
- Thuộc tính chung và dữ liệu riêng cho HD01–HD20;
- Đầu vào, quy trình, đầu ra, phụ phẩm, hao hụt;
- Hồ sơ nhân lực, mặt bằng, thiết bị, phương tiện;
- Phân biệt công suất thiết kế, công suất kê khai, công suất thực tế và sản lượng giao dịch;
- Phân tích nút thắt, chứng cứ, checklist động và cảnh báo bất thường;
- Bộ kiểm tra ADQ01–ADQ15 và tình huống ADT01–ADT15.

Commit tạo tài liệu: `2011e852a5d0b939e9b3b61c68b420715f20337a`.
Blob SHA đã kiểm tra đọc lại: `4c985f85d009da64d34951a2d1d1d45a92a3a33f`.
Tài liệu đã được kiểm tra đọc lại; đây là đặc tả nghiệp vụ dự thảo, chưa phải chức năng đã triển khai. Chưa có build/test/CI/Preview được thực hiện cho các thay đổi tài liệu này.


## 16. Bổ sung ma trận áp dụng pháp luật ATTP
Đã tạo `08_LEGAL_APPLICABILITY_MATRIX.md` trên nhánh `feature/docuguard-v2-hardening`. Tài liệu có:
- Mô hình bản ghi văn bản, điều khoản và quy tắc pháp lý;
- Trạng thái pháp lý theo thời điểm, gồm tạm ngưng, sửa đổi một phần, bãi bỏ, thay thế và chuyển tiếp;
- Danh mục 14 văn bản/dự án luật hạt giống;
- Ma trận trục quản lý y tế – nông nghiệp và môi trường – công thương – địa phương;
- Quy trình xác định căn cứ áp dụng, thẩm quyền, hồ sơ và chứng cứ;
- Cảnh báo đặc biệt về Nghị quyết 15/2026/NQ-CP: Nghị định 46/2026/NĐ-CP và Nghị quyết 66.13/2026/NQ-CP bị tạm ngưng cho đến khi Luật ATTP sửa đổi và nghị định hướng dẫn có hiệu lực; trong thời gian tạm ngưng, Nghị định 15/2018/NĐ-CP và văn bản hướng dẫn tiếp tục áp dụng theo Nghị quyết 15;
- Dự án Luật ATTP sửa đổi vẫn là dự thảo tại ngày rà soát 10/11/2026;
- Các khoảng trống cần hoàn thiện, đặc biệt ma trận phân cấp/ủy quyền riêng của tỉnh Phú Thọ.

Commit tạo tài liệu: `4f6dfed159f668f3dc981fb272f0bf77919dfb52`.
Blob SHA đã kiểm tra đọc lại: `a8dfa11fa79a3887b9a5ee1c0ffa125c54381918`.
Nguồn pháp lý chính thức đã tra cứu: Cổng Thông tin điện tử Chính phủ, Công báo Chính phủ, CSDL quốc gia về VBPL và Cổng thông tin Quốc hội. Tài liệu đã kiểm tra đọc lại, nhưng là ma trận hạt giống/dự thảo; chưa bóc hết mọi điều khoản, chưa được chuyên viên pháp lý phê duyệt và chưa được dùng để chạy kết luận tự động.
Chưa có build/test/CI/Preview được thực hiện cho thay đổi tài liệu này.


---

## 17. ĐẦU MỐI TRI THỨC DUY NHẤT — BẮT BUỘC ĐỌC KHI MỞ PHIÊN MỚI

Tài liệu này là sổ bàn giao và điểm điều hướng trung tâm của DocuGuard AI. Không tạo thêm bản mô tả tổng thể hoặc tài liệu kiến trúc trùng lặp nếu nội dung đã có ở đây hoặc trong các tài liệu được liên kết.

### 17.1. Thứ tự đọc bắt buộc

1. Tài liệu này — trạng thái, quyết định đã chốt, công việc dở dang và quy tắc tiếp tục.
2. [00 — Master Specification](00_DOCUGUARD_MASTER_SPEC.md).
3. [01 — Business Domain Map](01_BUSINESS_DOMAIN_MAP.md).
4. [02 — Legal & Science Knowledge](02_LEGAL_SCIENCE_KNOWLEDGE.md).
5. [03 — Technical Architecture](03_TECHNICAL_ARCHITECTURE.md).
6. [05 — Product × Activity Assessment Matrix](05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md).
7. [06 — Product Data Dictionary](06_PRODUCT_DATA_DICTIONARY.md).
8. [07 — Activity Data Dictionary](07_ACTIVITY_DATA_DICTIONARY.md).
9. [08 — Legal Applicability Matrix](08_LEGAL_APPLICABILITY_MATRIX.md).
10. [Legal registry README](../legal-registry/README.md) và [registry.json](../../data/legal-registry/registry.json).

Các tài liệu 00–08 là bộ thiết kế/đặc tả hiện có. Chúng không tự chứng minh chức năng đã lập trình, dữ liệu đã xác minh hoặc quy tắc đã được phê duyệt. Khi tài liệu và mã nguồn khác nhau, phải ghi nhận và xác minh, không tự suy đoán.

### 17.2. Nghiên cứu và tài liệu gốc có trước bộ kiến trúc V2.1

Không được bỏ qua hoặc viết lại từ đầu các nguồn sau:

- “Bộ não AI hỗ trợ thẩm định cơ sở thực phẩm nông lâm thủy sản” (ghi nhận ngày 01/10/2026, 16 trang).
- “Bảng hướng dẫn hồ sơ cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP”.
- “Bản mô tả hệ thống: Trang web thẩm định hồ sơ ATTP tích hợp AI”.
- Các tài liệu pháp lý người dùng đã tải lên thư viện ChatGPT, trong đó có bản hợp nhất 88/2026/VBHN-TT-BNNMT, bản hợp nhất TT38/2018 – TT17/2024 – TT22/2026 và bản gốc TT38/2018/TT-BNNPTNT.
- Bộ biểu mẫu BB1.1–BB2.8 và tiêu chí kiểm tra tương ứng.

Các tài liệu trên được ghi nhận là tài liệu đã tải lên/thảo luận trong thư viện hoặc các cuộc trò chuyện ChatGPT trước đây; chưa xác nhận tất cả đã được đưa vào GitHub. Khi cần đọc, phải tìm và mở đúng tệp gốc. Không tự tạo lại nội dung từ trí nhớ và không coi tên tệp là bằng chứng về nội dung hoặc hiệu lực pháp lý.

### 17.3. Phân loại nguồn và mức độ tin cậy

| Nhóm | Nguồn | Cách sử dụng |
|---|---|---|
| Nguyên tắc sản phẩm | 00–04 | Chuẩn định hướng; thay đổi phải có lý do và ghi nhận quyết định |
| Đặc tả nghiệp vụ/dữ liệu | 05–07 | Cơ sở thiết kế và kiểm thử; chưa đồng nghĩa đã triển khai |
| Ma trận pháp lý | 08 | Khung xác định phạm vi; chưa phải danh mục điều khoản đã xác minh đầy đủ |
| Danh mục văn bản | data/legal-registry/registry.json | Dữ liệu hạt giống; trạng thái CHUA_XAC_MINH không được dùng kết luận pháp lý |
| Nghiên cứu/tài liệu gốc | Mục 17.2 | Phải truy xuất bản gốc và đối chiếu trước khi kế thừa |
| Mã nguồn | src/, server/, tests/ và cấu hình | Bằng chứng mã đã viết; cần kiểm thử để xác nhận hành vi |
| CI/Preview/Production | GitHub Actions và Vercel | Chỉ kết luận theo lần kiểm tra mới nhất |

### 17.4. Kết quả rà soát mã nguồn tĩnh ngày 10/11/2026

Đã rà soát tĩnh trên nhánh phát triển; chưa chạy build, test hoặc kiểm thử runtime trong vòng rà soát này.

Đã tìm thấy: Supabase Auth và phân quyền vai trò; giao diện/quản trị người dùng; tải tài liệu, trích xuất và OCR PDF; xử lý tài liệu ghép; thẩm định đơn lẻ và hàng loạt; trợ lý Gemini; Legal Explorer dữ liệu tĩnh; quản lý hồ sơ ATTP, tài liệu và checklist; xuất Word; các kiểm thử auth, audit fallback và chat fallback.

Các khoảng trống:
1. Checklist ATTP hiện là bộ mặc định/cố định, chưa sinh động theo sản phẩm × hoạt động × cơ sở × phạm vi pháp lý.
2. Chưa có mô hình dữ liệu đầy đủ cho sản phẩm, địa điểm, lô, nguồn cung, công suất và dòng vật chất toàn chuỗi.
3. Tri thức pháp lý còn tĩnh; tuyến Gemini chưa truy xuất trực tiếp kho điều khoản đã xác minh.
4. registry.json có 10 bản ghi hạt giống, tất cả CHUA_XAC_MINH; chưa đủ điều kiện làm nguồn kết luận pháp lý tự động.
5. Chưa tìm thấy thư viện chuẩn khoa học/kỹ thuật đã tuyển chọn trong cây mã nguồn; cần tìm trong tài liệu nghiên cứu/thư viện trước khi tạo mới.
6. SAFETY_REVIEW.md cần rà soát vì một số nhận định về xác thực API có thể không còn khớp middleware hiện tại.
7. Workflow CI chưa bảo đảm kích hoạt phù hợp với nhánh phát triển và cấu hình PR được ghi nhận.
8. PR #6 từng được ghi nhận có head/base không còn phản ánh nhánh phát triển mới nhất; phải kiểm tra trực tiếp, không hợp nhất theo trạng thái cũ.

### 17.5. GitHub, Vercel và giới hạn thao tác

- Kho mã nguồn: [congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban](https://github.com/congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban).
- Nhánh phát triển được ghi nhận: feature/docuguard-v2-hardening.
- PR #6 từng được ghi nhận là bản nháp; trạng thái hiện tại phải kiểm tra trực tiếp.
- Vercel Preview có bảo vệ SSO; không tìm cách vượt qua.
- Không triển khai Production, thay đổi Supabase, hợp nhất PR, xóa dữ liệu hoặc thực hiện thao tác không thể đảo ngược nếu chưa có chấp thuận rõ ràng.

Trước mỗi phiên phải kiểm tra HEAD, nhánh, thay đổi chưa commit, PR, CI, Preview/Production và Supabase nếu có liên quan. Các commit, URL deployment và trạng thái cũ chỉ là lịch sử tham khảo.

### 17.6. Điểm dừng và công việc tiếp theo

- Người dùng yêu cầu kế thừa toàn bộ nghiên cứu, tài liệu và mã nguồn đã có; không tạo mới từ đầu hoặc tạo tài liệu trùng lặp.
- Đã tạm dừng ý định tạo tài liệu ma trận tham chiếu khoa học/kỹ thuật mới (tệp 09); tệp 09 chưa được tạo.
- Đã hoàn thành rà soát tĩnh bước đầu; chưa thay đổi mã nguồn, Supabase, Vercel hoặc PR trong vòng rà soát.
- Bước tiếp theo: kiểm kê sâu tài liệu nghiên cứu và nguồn khoa học/kỹ thuật hiện có; đối chiếu với 00–08 và mã nguồn; chỉ bổ sung khi chứng minh được khoảng trống.

### 17.7. Lệnh mở phiên mới

Dán nội dung sau vào cuộc trò chuyện mới:

> Chúng ta tiếp tục dự án DocuGuard AI – Pháp chế & ATTP. Hãy mở kho GitHub congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban, kiểm tra nhánh và commit hiện tại, đọc docs/architecture/04_PROJECT_STATE_AND_HANDOVER.md trước, sau đó đọc các tài liệu được liệt kê tại mục 17.1 và tìm các tài liệu gốc tại mục 17.2. Không yêu cầu tôi nhắc lại thông tin đã có; không tạo tài liệu trùng lặp; không sửa mã nguồn, thay đổi Supabase, triển khai Production hoặc hợp nhất PR nếu chưa có căn cứ và phê duyệt. Trước tiên báo cáo trạng thái thực tế, những gì đã có, những gì còn thiếu, điểm mâu thuẫn và bước tiếp theo nhỏ nhất có giá trị.

### 17.8. Kỷ luật cập nhật

Mỗi phiên phải cập nhật tài liệu này khi có quyết định nghiệp vụ, thay đổi kiến trúc/mã nguồn, kết quả kiểm thử, thay đổi pháp lý, CI/deployment, rủi ro hoặc thay đổi ưu tiên. Ghi ngày giờ, bằng chứng, trạng thái xác minh và quyết định cần chủ dự án. Không ghi khóa API, mật khẩu, token, dữ liệu cá nhân hoặc hồ sơ nhạy cảm. Nội dung chưa kiểm chứng phải ghi CHUA_XAC_MINH.


### 17.9. Kết quả kiểm kê thư viện tài liệu ChatGPT — đợt 1 (10/11/2026)

Đã tìm và đọc các nguồn sau trong thư viện ChatGPT:

| Tài liệu | Ngày lưu trong thư viện | Giá trị kế thừa | Trạng thái/giới hạn |
|---|---:|---|---|
| `Bo-nao-AI-tham-dinh-ATTP.docx` | 01/10/2026 | Nghiên cứu nghiệp vụ và kiến trúc suy luận 16 trang; mô hình yêu cầu–bằng chứng–lập luận–trạng thái; phân nhánh nghiệp vụ; luồng hồ sơ/thực địa; vai trò; các điều kiện chặn L1–L8; biểu mẫu BB1.1–BB2.8 | Nguồn nghiên cứu nền cần đối chiếu với 00–08; chính tài liệu nêu chưa phải kiểm toán pháp lý toàn bộ điều khoản |
| `Bang_ho_so_ATTP_tach_tung_y.docx` | 03/07/2026 | Tách bản thuyết minh thành các nhóm dữ liệu và từng yêu cầu kiểm tra: thông tin cơ sở, sản phẩm, nhà xưởng, thiết bị, nguồn nước/đá, chất thải, nhân lực, vệ sinh, hóa chất/phụ gia, quản lý chất lượng, kiểm nghiệm | Tài liệu nghiệp vụ lịch sử; căn cứ và biểu mẫu phải đối chiếu phiên bản hiện hành |
| `Bang_ho_so_ATTP.docx` và bản `(1)` | 03/07/2026 | Bảng thành phần hồ sơ và yêu cầu chất lượng nội dung | Có nhiều bản gần giống; chưa kết luận bản nào là bản chuẩn cuối |
| `CSDL_san_pham_nong_nghiep_Viet_Nam_Phan_1_Ngu_coc.docx` | 07/07/2026 | Cấu trúc dữ liệu sản phẩm: mã nhóm/mã sản phẩm, phân nhóm, giống/loài, tên khoa học, đơn vị kê khai, đơn vị năng suất, năng suất trung bình/thấp/cao, chu kỳ, mùa vụ, trạng thái | Mới là phần 1 – ngũ cốc; số liệu mẫu trong tài liệu chưa được xác minh theo địa phương, mùa vụ, giống và nguồn thống kê; không dùng trực tiếp làm ngưỡng kết luận |
| `V1.0_Phan01_Luot01_NguCoc_Mau.docx` | 07/07/2026 | Bản mẫu/biến thể của cơ sở dữ liệu ngũ cốc | Có nội dung gần với tài liệu CSDL; cần so sánh phiên bản và chọn nguồn chuẩn, không nhập trùng |
| `11. 38_2018_TT-BNNPTNT_406512.pdf` và bản trùng | 01–02/10/2026 | Văn bản gốc TT 38/2018 để đối chiếu lịch sử sửa đổi | Không sử dụng độc lập như bản hiện hành sau khi có văn bản sửa đổi/hợp nhất |
| `12. 17_2024_TT-BNNPTNT_634992.pdf` và bản trùng | 01–02/10/2026 | Văn bản sửa đổi TT 38/2018 và TT 48/2013; có thay thế phụ lục, biểu mẫu | Phải đọc cùng TT 17/2025, TT 22/2026 và VBHN 88/2026 |
| `0. vbhn hop nhat số 88-2026VBHN-TT-BNNMT...` (có các bản gần trùng) | 02/10/2026 | Bản hợp nhất để tra cứu TT 38/2018 và các sửa đổi | Phải truy ngược văn bản sửa đổi khi xác định căn cứ; cần đối chiếu các bản trùng để chọn bản toàn vẹn |

**Phát hiện quan trọng:** Tài liệu nghiên cứu và dữ liệu sản phẩm đã có trước bộ tài liệu kiến trúc V2.1. Do đó, không tạo mới một bộ khung tri thức khoa học/sản phẩm từ đầu. Cần lập quan hệ giữa tài liệu gốc này với các đặc tả 05–07; ưu tiên kiểm tra dữ liệu, nguồn và mức độ xác minh trước khi nhập vào ứng dụng.

**Nguồn thư viện đã tra cứu:** `turn335file0`, `turn336file1`, `turn336file3`, `turn336file5`, `turn336file7`, `turn339file0`, `turn339file1`, `turn339file2`, `turn339file4`. Đây là tham chiếu truy xuất trong ChatGPT, không phải đường dẫn tệp GitHub.

**Việc còn lại của kiểm kê:** tiếp tục duyệt thư viện theo các nhóm hồ sơ ATTP, biểu mẫu, dữ liệu chuyên ngành và quy chuẩn kỹ thuật; xác định bản gốc/bản trùng; lập bảng ánh xạ tài liệu → nội dung → tài liệu 00–08 → phân hệ phần mềm → tình trạng xác minh. Chưa có tệp gốc nào trong danh sách trên được sao chép vào GitHub ở đợt này.


### 17.10. Kiểm kê thư viện tài liệu — đợt 2 (10/11/2026)

**Nhóm biểu mẫu và căn cứ nghiệp vụ đã tìm thấy**
- Có bản VBHN 88/2026/VBHN-TT-BNNMT lưu ngày 02/10/2026 và một bản hợp nhất lưu ngày 22/09/2026, tên tệp thể hiện chuỗi TT38–TT17–TT22.
- Có các bản TT17/2024 và TT38/2018 gốc; một số bản sao trùng tên có hậu tố (1), (2), (3).
- VBHN có danh mục 14 mẫu biên bản thẩm định BB1.1–BB1.6 và BB2.1–BB2.8, cùng nội dung quy trình thẩm định/kiểm tra và mẫu bản thuyết minh cơ sở.
- Bảng hồ sơ ATTP tách từng ý đã có các nhóm thông tin: cơ sở, sản phẩm, khu vực sản xuất, thiết bị, nguồn nước/nước đá, xử lý chất thải, nhân lực, vệ sinh, hóa chất/phụ gia, hệ thống quản lý chất lượng và kiểm nghiệm.

Không nhập các bản sao thành nhiều nguồn quy tắc. Cần kiểm tra checksum, số trang, chữ ký/nguồn phát hành và khác biệt nội dung để chọn bản chuẩn. Bản gốc và bản hợp nhất có vai trò khác nhau, không xóa lẫn nhau.

**Dữ liệu sản phẩm và kỹ thuật**
Qua các truy vấn theo cơ sở dữ liệu sản phẩm, năng suất, giống, chu kỳ, quy chuẩn kỹ thuật, nước và biểu mẫu BB1/BB2, chỉ xác nhận rõ bộ dữ liệu sản phẩm nông nghiệp Phần 1 – Ngũ cốc cùng bản mẫu V1.0 đã ghi tại mục 17.9. Chưa tìm thấy bằng chứng đủ rõ về thư viện QCVN/TCVN được lập chỉ mục có hệ thống hoặc bộ dữ liệu định mức đã thẩm định cho chăn nuôi, thủy sản, sơ chế, chế biến, bảo quản. Đây chỉ là “chưa tìm thấy trong các truy vấn đã thực hiện”, không khẳng định các tài liệu đó không tồn tại trong toàn bộ thư viện.

**Ánh xạ kế thừa**
| Nguồn hiện có | Đặc tả liên quan | Cách xử lý |
|---|---|---|
| Bộ não AI thẩm định ATTP | 00, 01, 02, 03, 08 | Nguồn nghiệp vụ/kiến trúc gốc; đối chiếu nội dung trùng và điều kiện L1–L8 |
| Bảng hồ sơ tách từng ý và mẫu thuyết minh | 05, 07, 08 | Tái sử dụng cấu trúc trường; phân biệt hồ sơ phải nộp với bằng chứng thẩm định |
| Danh mục BB1.1–BB2.8 | 05, 07, 08 | Ánh xạ loại hình và mẫu kiểm tra; không biến toàn bộ tiêu chí thành checklist chung |
| CSDL ngũ cốc V1.0 | 05, 06 | Đối chiếu mã và trường dữ liệu; bổ sung nguồn, địa bàn, thời gian, phương pháp, trạng thái xác minh |
| VBHN và văn bản gốc TT38/TT17/TT22 | 02, 08 | Quản lý theo văn bản gốc, sửa đổi, hợp nhất và thời điểm áp dụng |

**Kết luận:** Chưa có lý do tạo thêm tài liệu kiến trúc. Bước tiếp theo là chọn bản chuẩn, kiểm tra phụ lục/mẫu, ánh xạ chi tiết tới 05–08 và đánh dấu dữ liệu thiếu nguồn kiểm chứng. Đợt này không thay đổi mã nguồn, Supabase, Vercel hay hồ sơ nghiệp vụ.

Nguồn truy xuất thư viện: turn344file0–turn344file9, turn345file0–turn345file9 (tham chiếu tìm kiếm thư viện ChatGPT, không phải đường dẫn GitHub).