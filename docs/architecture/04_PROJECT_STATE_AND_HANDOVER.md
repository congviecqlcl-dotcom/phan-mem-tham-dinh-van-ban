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

### 17.11. Đối chiếu nghiên cứu nghiệp vụ cũ với kiến trúc 00–08 (10/11/2026)

**Nguồn gốc dùng để đối chiếu**
- `Bo-nao-AI-tham-dinh-ATTP.docx` (nghiên cứu 1, mốc 01/10/2026, 16 trang).
- `Bang_ho_so_ATTP_tach_tung_y.docx` (bảng thành phần hồ sơ và yêu cầu chất lượng, 3 trang).
- `CSDL_san_pham_nong_nghiep_Viet_Nam_Phan_1_Ngu_coc.docx` (dữ liệu mẫu ngũ cốc).
- Các bản VBHN 88/2026, TT38/2018 và TT17/2024 trong thư viện.

**Kết quả đối chiếu**
| Nội dung nghiên cứu cũ | Nội dung tương ứng trong 00–08 | Nhận định kế thừa |
|---|---|---|
| Phải xác định phiên bản pháp luật; lưu sửa đổi, bãi bỏ, tạm ngưng, chuyển tiếp | 02 và 08 | Đã được nâng thành mô hình quản trị văn bản/điều khoản/quy tắc; cần tiếp tục đối chiếu danh mục điều khoản thực tế và nguồn chính thức |
| Tách nghiệp vụ cấp giấy, kiểm tra ATTP, quản lý theo cam kết, thủy sản xuất khẩu, xử phạt | 00, 01, 03, 05, 07, 08 | Nguyên tắc phân nhánh đã có; phải giữ các luồng nghiệp vụ độc lập, không gộp chung thành một checklist |
| Mỗi yêu cầu có căn cứ, phạm vi, bằng chứng, người xác minh, thông tin thiếu | 00, 02, 03, 08 | Đã được thể hiện ở chuẩn kết quả và quản trị tri thức; cần kiểm tra schema/mã nguồn có lưu đủ từng trường không |
| Không dùng điểm rủi ro thay điều kiện pháp luật; giữ quyền giải trình, lịch sử sửa kết luận | 00, 01, 03 | Đã có nguyên tắc; cần kiểm chứng việc triển khai nhật ký, ý kiến cơ sở và luồng sửa/duyệt trong ứng dụng |
| Đọc từng yêu cầu, tách chủ thể, hành vi, điều kiện, ngoại lệ, thời hạn, hậu quả | 02, 08 | Đã có mô hình pháp lý; cần đối chiếu với bộ phân tích điều khoản và kho dữ liệu pháp lý thực tế |
| Định danh cơ sở, sản phẩm, hoạt động, địa điểm, chuỗi cung ứng | 01, 05, 06, 07 | Đã được mở rộng thành mô hình sản phẩm × hoạt động × cơ sở và dòng vật chất |
| Kế hoạch thẩm định, đoàn thẩm định, kiểm chứng thực địa, phỏng vấn, lấy mẫu, biên bản, thẩm tra, cấp giấy/theo dõi | 00, 01, 03, 05, 07 | Kiến trúc hiện tại mới mô tả ở mức khung; cần kiểm tra xem các trạng thái và biểu mẫu đã có đầy đủ trong phần mềm chưa |
| Điều kiện chặn L1–L8 trước triển khai | 00–08 có các nguyên tắc và điều kiện quản trị liên quan | Chưa có bằng chứng rằng toàn bộ L1–L8 đã được chuyển thành cổng kiểm soát có thể kiểm thử; cần trích nguyên văn từ tài liệu gốc và lập ánh xạ riêng, không tự diễn giải thay thế |
| Bảng hồ sơ tách từng ý: pháp lý, thông tin chung, sản phẩm, nhà xưởng, thiết bị, nước/đá, chất thải, nhân lực, vệ sinh, hóa chất/phụ gia, quản lý chất lượng, kiểm nghiệm | 05, 06, 07 | Phần lớn trường đã có chỗ trong từ điển/matrix; phải xác định trường nào là hồ sơ bắt buộc, trường nào là thông tin khai báo/bằng chứng hỗ trợ, trường nào chỉ áp dụng có điều kiện |
| CSDL ngũ cốc với mã nhóm/mã sản phẩm, giống, tên khoa học, đơn vị, năng suất, chu kỳ, mùa vụ | 05, 06 | Đặc tả dữ liệu đã có khung rộng hơn; dữ liệu số trong tệp mẫu chưa có nguồn thống kê/địa bàn/giống đủ rõ để dùng làm chuẩn kết luận |

**Sai khác/điểm cần cảnh báo khi kế thừa**
1. Bảng hồ sơ ATTP cũ còn dẫn mẫu bản thuyết minh theo Phụ lục VI của TT38/2018 và gọi là tham chiếu TT17/2024. Bản VBHN trong thư viện thể hiện mẫu bản thuyết minh ở Phụ lục IV ban hành kèm TT17/2024. Không lấy nguyên nhãn phụ lục từ bảng cũ để cấu hình biểu mẫu hiện hành; phải kiểm tra bản VBHN toàn văn, các sửa đổi TT22/2026 và thủ tục địa phương trước khi chốt.
2. Nghiên cứu Bộ não AI tự cảnh báo rằng việc nghiên cứu chưa phải kiểm toán pháp lý từng câu/từng phụ lục hoàn tất. Vì vậy không nâng các trích dẫn hoặc kết luận trong tài liệu nghiên cứu thành quy tắc đã duyệt.
3. Tài liệu nghiên cứu phân biệt rõ rủi ro để chuẩn bị và ưu tiên kiểm chứng với điều kiện pháp luật để kết luận. Quy tắc này phải được giữ nguyên trong sản phẩm và kiểm thử, không để điểm rủi ro tự chuyển thành kết quả đạt/không đạt.
4. CSDL ngũ cốc có các con số năng suất minh họa nhưng chưa kèm nguồn, địa bàn, vụ, điều kiện canh tác và phương pháp thống kê. Chỉ được dùng để thử cấu trúc/kiểm thử dữ liệu, không dùng làm ngưỡng tự động.

**Kết luận đối chiếu**
Kiến trúc 00–08 đã kế thừa phần lớn định hướng cốt lõi của nghiên cứu cũ và mở rộng tốt hơn mô hình sản phẩm–hoạt động–cơ sở–dòng vật chất. Không cần viết lại nghiên cứu Bộ não AI hoặc tạo thêm tài liệu kiến trúc tổng thể. Khoảng trống thực sự là chuyển nội dung đã nghiên cứu thành cấu hình và quy trình có thể kiểm thử trong phần mềm: (a) ánh xạ đầy đủ L1–L8; (b) ánh xạ từng biểu mẫu BB1.1–BB2.8 và từng trường hồ sơ; (c) quản lý phiên bản pháp lý/địa phương; (d) mô hình kế hoạch và bằng chứng thực địa; (e) xác minh dữ liệu khoa học trước khi bật quy tắc.

**Bước tiếp theo nhỏ nhất có giá trị:** lập bảng đối chiếu chi tiết từ tài liệu gốc sang cấu hình phần mềm và mã nguồn hiện có, bắt đầu với luồng cấp Giấy chứng nhận ATTP và bộ biểu mẫu BB1.1–BB2.8. Không tạo tài liệu kiến trúc mới; có thể ghi bảng kiểm kê/ánh xạ vào sổ bàn giao hoặc tệp dữ liệu kiểm thử hiện có sau khi kiểm tra cấu trúc kho.

Tham chiếu thư viện: `turn335file0`, `turn339file0`, `turn339file2`, `turn344file0`–`turn344file9`, `turn345file0`–`turn345file9`.

### 17.12. Đối chiếu tĩnh luồng hồ sơ ATTP hiện có với nghiệp vụ cấp Giấy chứng nhận (10/11/2026)

**Phạm vi kiểm tra:** đọc mã nguồn `src/components/AttpDossierReview.tsx`, `src/data/presets.ts`, `src/types.ts`, `src/App.tsx`, ma trận 05 và từ điển 07 trên nhánh `feature/docuguard-v2-hardening`. Đây là rà soát tĩnh mã nguồn; chưa chạy ứng dụng, chưa kiểm tra dữ liệu Supabase thực tế, chưa xác minh RLS/Storage policy hoặc triển khai.

**Những gì mã nguồn hiện có thể làm**
- Tạo hồ sơ làm việc theo cơ sở với mã hồ sơ, tên cơ sở, người đại diện, địa chỉ, loại hình và thủ tục được chọn.
- Tải tệp PDF, DOCX, TXT, MD, CSV lên vùng lưu trữ riêng `attp-dossiers-private`; giới hạn 25 MB/tệp trong giao diện.
- Gọi `/api/parse-document` để trích xuất PDF/DOCX; nhận diện PDF cần OCR khi máy chủ trả HTTP 422; lưu trạng thái trích xuất.
- Lưu tài liệu và văn bản trích xuất vào các bảng `attp_dossiers`, `attp_dossier_documents`, `attp_dossier_checklist_items`, `attp_dossier_document_links`.
- Gắn một hoặc nhiều tài liệu vào một đầu mục kiểm soát; cho phép thêm đầu mục bổ sung; gỡ tài liệu khỏi danh sách bằng cờ `is_removed` và giữ tệp gốc trong kho.
- Có cảnh báo giao diện rằng danh mục hiện tại là khung tổ chức công việc, không mặc nhiên là thành phần hồ sơ pháp lý.

**Những gì chưa được chứng minh hoặc chưa có trong mã nguồn đã đọc**
1. Checklist sinh theo thủ tục, nhóm sản phẩm, hoạt động, địa điểm, loại hình và căn cứ pháp luật: hiện `DEFAULT_CHECKLIST` gồm 7 đầu mục chung, được tạo giống nhau cho mọi hồ sơ, bất kể lựa chọn thủ tục/loại hình.
2. Mô hình dữ liệu cấu trúc cho chủ thể pháp lý, nhiều cơ sở/địa điểm, nhiều sản phẩm, nhiều hoạt động, công đoạn, nhà cung cấp, lô hàng, công suất và dòng vật chất: không thấy trong component hồ sơ; thông tin tạo mới hiện chỉ có tên cơ sở, đại diện, địa chỉ, loại hình, thủ tục.
3. Ánh xạ 14 biểu mẫu BB1.1–BB2.8 tới từng tiêu chí, yêu cầu, phương pháp, bằng chứng và phiên bản biểu mẫu: chưa thấy trong component hoặc `presets.ts` được kiểm tra.
4. Kiểm tra tính đầy đủ/hợp lệ của hồ sơ theo thời hạn và quy trình thủ tục; lập kế hoạch/đoàn thẩm định; ghi nhận kết quả từng tiêu chí; ý kiến giải trình/khắc phục; thẩm tra; trình và phê duyệt: chưa thấy trong luồng component này.
5. Trạng thái checklist hiện chủ yếu suy ra từ việc có tài liệu được gắn hay không. Có tài liệu gắn vào đầu mục không chứng minh tài liệu hợp lệ, nội dung đáp ứng, hoặc tiêu chí đã được thẩm định.
6. Hàm cập nhật liên kết xóa các liên kết cũ rồi tạo lại liên kết mới bằng hai yêu cầu riêng; cần đánh giá tính nguyên tử và xử lý lỗi giữa chừng để tránh trạng thái liên kết bị mất một phần.
7. Khi tạo hồ sơ, thao tác ghi hồ sơ và ghi checklist là hai yêu cầu riêng; nếu bước hai lỗi, có thể tồn tại hồ sơ chưa có checklist. Cần cơ chế giao dịch/khôi phục hoặc thao tác phía máy chủ có tính nguyên tử.
8. Mã nguồn gọi trực tiếp Supabase REST từ trình duyệt với access token người dùng; chưa kiểm chứng được chính sách RLS, quyền Storage, ràng buộc khóa ngoại, giới hạn truy cập chéo hồ sơ và quy trình dọn tệp mồ côi.
9. Không tìm thấy thư mục migration Supabase trong danh sách thư mục gốc đã kiểm tra; vì vậy chưa thể xác nhận định nghĩa bảng, ràng buộc, trigger, RLS hay lịch sử thay đổi schema chỉ từ repository này.

**Nhận định nghiệp vụ**
Phân hệ hiện tại phù hợp với vai trò “tiếp nhận và tập hợp tài liệu theo hồ sơ làm việc”, chưa đủ căn cứ gọi là phân hệ thẩm định hồ sơ cấp Giấy chứng nhận theo quy trình nghiệp vụ hoàn chỉnh. Không được lấy số lượng đầu mục đã gắn tệp làm tỷ lệ hồ sơ đạt. Cần giữ cảnh báo hiện có và mở rộng trạng thái theo hướng tách: đã tiếp nhận, đã đọc/trích xuất, cần OCR, chưa kiểm tra nội dung, đã kiểm tra, có yêu cầu bổ sung, chưa đủ căn cứ, không áp dụng có lý do.

**Ưu tiên xử lý theo thứ tự, chưa triển khai trong đợt rà soát này**
- P0 — Xác minh schema/RLS/Storage policy và tính nhất quán khi ghi nhiều bảng; đây là kiểm soát dữ liệu và bảo mật.
- P1 — Chốt một thủ tục cụ thể (cấp mới Giấy chứng nhận cho cơ sở thuộc phạm vi nông, lâm, thủy sản) và xác minh đúng cơ quan, hồ sơ, biểu mẫu, thời hạn theo văn bản trung ương và quyết định công bố TTHC/ủy quyền của Phú Thọ tại thời điểm áp dụng.
- P1 — Lập bảng ánh xạ biểu mẫu BB1.1–BB2.8 và từng trường hồ sơ: trường dữ liệu, nguồn, bắt buộc/có điều kiện, đối tượng áp dụng, bằng chứng, người kiểm tra, trạng thái và căn cứ điều khoản.
- P2 — Từ bảng ánh xạ đã duyệt mới cấu hình checklist theo điều kiện; không biến danh sách 7 đầu mục chung thành checklist pháp lý.
- P2 — Bổ sung luồng thẩm định nội dung, xác minh thực địa, giải trình/khắc phục, thẩm tra và phê duyệt; giữ người có thẩm quyền là chủ thể quyết định.

**Kết luận:** Không sửa mã nguồn trong lần này. Có cơ sở xác định khoảng cách giữa chức năng đang chạy theo thiết kế tĩnh và đích nghiệp vụ: phân hệ hiện có là kho hồ sơ/tập hợp chứng cứ ở mức cơ bản, chưa phải quy trình thẩm định pháp lý–chuyên môn đầy đủ. Bước kế tiếp phải kiểm chứng nguồn pháp lý và schema/kiểm soát dữ liệu trước khi thiết kế thay đổi.

Tham chiếu mã nguồn đã đọc: `src/components/AttpDossierReview.tsx`, `src/data/presets.ts`, `src/types.ts`, `src/App.tsx`, `docs/architecture/05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md`, `docs/architecture/07_ACTIVITY_DATA_DICTIONARY.md`.

### 17.13. Rà soát căn cứ và quy trình TTHC cấp Giấy chứng nhận ATTP tại Phú Thọ (10/11/2026)

**Lưu ý đính chính:** Quyết định 602/QĐ-UBND ngày 11/08/2025 không còn là quy trình nội bộ hiện hành theo hồ sơ nghiên cứu đã lưu trong Library. Tài liệu sáng kiến rà soát pháp lý (bản Lần 5, tạo 19/10/2026) ghi rõ Quyết định 602 đã được thay thế bởi Quyết định 1091/QĐ-UBND ngày 22/09/2025. Không tiếp tục lấy quy trình 602 làm căn cứ hiện hành. Cần kiểm tra thêm các cập nhật sau tháng 9/2025.

**Nguồn chính thức đã kiểm tra trực tuyến**
- Trang TTHC của Sở Nông nghiệp và Môi trường Phú Thọ hiện công khai mã TTHC `2.001.827` — cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP đối với cơ sở sản xuất, kinh doanh thực phẩm nông, lâm, thủy sản; trang này chưa hiển thị đầy đủ thành phần hồ sơ trong phần nội dung trích xuất.
- Quyết định 1088/QĐ-UBND ngày 22/09/2025: công bố danh mục TTHC thuộc thẩm quyền giải quyết của Chủ tịch UBND cấp xã, phường. Bản Công báo xác định TTHC 2.001827, thời hạn 15 ngày từ khi nhận đủ hồ sơ hợp lệ, phí hiển thị 700.000 đồng/cơ sở; căn cứ có Luật ATTP, TT38/2018, TT17/2024, Điều 3 TT17/2025 và QĐ1046/2025.
- Quyết định 1091/QĐ-UBND ngày 22/09/2025: quy trình nội bộ các cấp chính quyền; Sở đang liệt kê văn bản này là còn hiệu lực tại trang hệ thống văn bản.
- Quyết định 1046/QĐ-UBND ngày 18/09/2025: ủy quyền cho Giám đốc Sở và Chủ tịch UBND xã, phường thực hiện nhiệm vụ thuộc thẩm quyền Chủ tịch UBND tỉnh; Sở đang liệt kê văn bản là còn hiệu lực.
- Quyết định 548/QĐ-UBND ngày 06/08/2025: công bố danh mục TTHC được sửa đổi, bổ sung lĩnh vực quản lý chất lượng nông lâm sản và thủy sản; trang hệ thống văn bản của Sở đang liệt kê còn hiệu lực.
- Trang hệ thống văn bản của Sở hiện liệt kê thêm Quyết định 2133/QĐ-UBND ngày 01/07/2026 — quy trình nội bộ TTHC lĩnh vực Quản lý chất lượng Nông lâm sản và Thủy sản thuộc thẩm quyền giải quyết của Sở Nông nghiệp và Môi trường — tình trạng hiển thị còn hiệu lực. Đây là cập nhật sau QĐ1091, phải đọc bản gốc để xác định chính xác phạm vi thủ tục nào được thay thế/điều chỉnh; không suy diễn rằng nó thay thế toàn bộ QĐ1091.
- Cùng danh mục văn bản Sở có QĐ1773/QĐ-UBND ngày 02/06/2026 về công bố danh mục TTHC được sửa đổi, bổ sung thuộc thẩm quyền các cấp chính quyền. Phải lấy bản gốc và phụ lục để xác định chính xác các trường thay đổi đối với TTHC 2.001827.
- QĐ108/2025/QĐ-UBND ngày 27/11/2025 (hiệu lực từ 15/12/2025 theo bản tra cứu) ban hành quy định phân cấp quản lý nhà nước về ATTP thuộc lĩnh vực Nông nghiệp và Môi trường trên địa bàn Phú Thọ. Cần đối chiếu toàn văn quy định phân cấp với QĐ1046, TT17/2025 và các quy trình TTHC; không chỉ dùng phần căn cứ.

**Căn cứ trung ương và điểm cần phân biệt**
- VBHN 88/2026/VBHN-TT-BNNMT ngày 21/09/2026 là bản hợp nhất hướng dẫn chứng nhận cơ sở đủ điều kiện ATTP; nội dung hồ sơ trong tệp Library được trích xuất cho thấy văn bản hợp nhất TT38/2018, TT17/2024, TT17/2025 và TT22/2026. Phải dùng chính bản hợp nhất đã đối chiếu, không đọc riêng TT38/2018 như văn bản nguyên trạng.
- TT17/2024/TT-BNNPTNT sửa đổi quy định về thẩm định/chứng nhận; hiệu lực 15/01/2025 theo Cổng văn bản Chính phủ.
- TT17/2025/TT-BNNMT là văn bản phân cấp quản lý nhà nước trong lĩnh vực quản lý chất lượng nông lâm sản và thủy sản, hiệu lực 01/07/2025; không nhầm với TT17/2024 và không mô tả TT17/2025 là văn bản ban hành mẫu đơn.
- Kết quả tra cứu Cổng Dịch vụ công quốc gia hiện hiển thị thành phần hồ sơ viện dẫn Phụ lục I và II của TT17/2025. Đây là điểm không thống nhất với bản chất/văn bản TT17/2025 đã tra cứu (văn bản phân cấp) và với bản hợp nhất 88; không được tự động nhập nội dung hiển thị đó thành checklist pháp lý. Cần xác minh bản ghi TTHC gốc trong CSDL quốc gia và phụ lục hiện hành của VBHN 88, sau đó kiến nghị cập nhật nếu dữ liệu công khai bị sai.
- Nguồn không chính thức 33/VBHN-BNNPTNT/77/VBHN-BNNMT cũ có mẫu đơn, mẫu thuyết minh và mẫu biên bản, nhưng không dùng thay VBHN 88/2026. Dùng bản cũ chỉ để đối chiếu lịch sử.

**Danh mục biểu mẫu đã xác định được từ nguồn trước đó**
- 14 mẫu BB1.1–BB1.6 và BB2.1–BB2.8 là mẫu biên bản thẩm định theo loại hình cơ sở, không phải 14 thành phần hồ sơ mà mọi cơ sở đều phải nộp.
- Phải lựa chọn biểu mẫu theo loại hình/hoạt động thực tế và phạm vi thủ tục; không áp dụng tất cả biểu mẫu cho một hồ sơ.
- Hồ sơ xin cấp giấy, biểu mẫu thuyết minh và mẫu biên bản thẩm định là các loại tài liệu khác nhau. Phân hệ phải tách: tài liệu do cơ sở nộp; biểu mẫu công chức/đoàn thẩm định lập; kết quả/quyết định do cơ quan có thẩm quyền ban hành.

**Quy trình nội bộ QĐ602 cũ — chỉ dùng làm tài liệu lịch sử**
QĐ602 bản Công báo mô tả chuỗi tiếp nhận → thẩm định hồ sơ tại Chi cục → lãnh đạo Chi cục xét duyệt/trình → lãnh đạo Sở xét duyệt → văn thư phát hành → chuyển Văn phòng UBND tỉnh → thẩm tra/trình lãnh đạo UBND tỉnh ký → trả kết quả. Tuy nhiên, đây là quy trình đã bị thay thế bởi QĐ1091 theo hồ sơ Library; tuyệt đối không sao chép nguyên chuỗi người xử lý và thời gian của QĐ602 vào phần mềm hiện hành. QĐ1091 và các cập nhật QĐ2133/1773 phải được bóc tách trước.

**Kết luận kiểm soát cho DocuGuard**
1. Căn cứ trung ương cần dùng làm điểm xuất phát hiện nay là VBHN 88/2026, nhưng trạng thái từng điều khoản vẫn phải được duyệt; VBHN không thay thế quyết định TTHC địa phương.
2. Lớp địa phương phải tối thiểu xét QĐ548, QĐ1046, QĐ1088, QĐ1091, QĐ108/2025/QĐ-UBND, QĐ1773/2026 và QĐ2133/2026; QĐ602 đánh dấu lịch sử/đã bị thay thế.
3. Tách cấu hình thủ tục do UBND tỉnh/Chủ tịch UBND tỉnh ủy quyền và thủ tục thuộc Chủ tịch UBND cấp xã; không hard-code tất cả hồ sơ vào một tuyến thẩm quyền.
4. Không xác nhận mức phí, biểu mẫu nộp, thời hạn, đơn vị xử lý hiện tại chỉ từ một cổng tra cứu có dữ liệu không thống nhất; cần bản gốc quyết định công bố mới nhất và quy trình nội bộ tương ứng.
5. Chưa cập nhật `registry.json` hoặc bật quy tắc pháp lý. Tất cả thông tin trên là kết quả nghiên cứu nguồn và cần người rà soát pháp chế phê duyệt trước khi chuyển `DA_XAC_MINH`.

**Nguồn đã đối chiếu:** Cổng văn bản Chính phủ (TT17/2024; VBHN88); Cổng thông tin Sở Nông nghiệp và Môi trường Phú Thọ (danh mục TTHC 2.001827; hệ thống văn bản liệt kê QĐ2133, QĐ1091, QĐ1046, QĐ1088, QĐ548); Công báo Phú Thọ (QĐ1088; QĐ602 bản lịch sử); Library người dùng (VBHN88 bản PDF; Báo cáo sáng kiến Lần 5 trích yếu QĐ548, QĐ602, QĐ1046, QĐ1088, QĐ1091, QĐ108/2025 và QĐ1773).

### 17.14. Bóc tách VBHN 88/2026 và quy tắc hồ sơ/biểu mẫu cấp giấy ATTP (10/11/2026)

**Nguồn trực tiếp:** tệp Library “0. vbhn hop nhat số 88-2026VBHN-TT-BNNMT hợp nhất tt38-2018 _tt17-2024 (3).pdf”, bản 28 trang, ngày văn bản hợp nhất 21/09/2026. Đã đọc toàn văn phần điều khoản và phụ lục (trang 1–28). Đây là nội dung trích xuất từ bản PDF do người dùng cung cấp; cần tiếp tục đối chiếu bản ký số/nguồn công bố chính thức và rà soát pháp chế trước khi kích hoạt quy tắc.

**1. Phạm vi và trường hợp không thuộc diện cấp giấy**
- Khoản 1 Điều 2 quy định đối tượng chứng nhận là cơ sở sản xuất, kinh doanh thực phẩm thuộc phạm vi quản lý của Bộ NN&PTNT (tên cơ quan trong văn bản gốc; cần đọc cùng các quy định phân cấp/tổ chức hiện hành).
- Các trường hợp loại trừ được liệt kê gồm: sản xuất ban đầu nhỏ lẻ; sản xuất, kinh doanh không có địa điểm cố định và tàu cá dưới 15 m; sơ chế nhỏ lẻ; kinh doanh thực phẩm nhỏ lẻ; kinh doanh thực phẩm bao gói sẵn; cơ sở có một trong các chứng nhận hệ thống được liệt kê còn hiệu lực (GMP, HACCP, ISO 22000, IFS, BRC, FSSC 22000 hoặc tương đương).
- Phải phân biệt “không thuộc diện cấp Giấy chứng nhận” với “không thuộc diện kiểm tra”: khoản 2 Điều 2 vẫn quy định đối tượng kiểm tra, bao gồm cả cơ sở có chứng nhận hệ thống còn hiệu lực.
- Không tự suy rộng ngoại lệ. Khi phân loại phải thu thập đủ dữ liệu về quy mô/loại hình, địa điểm, hoạt động, loại sản phẩm và chứng nhận hệ thống, sau đó đối chiếu đúng điều kiện pháp lý.

**2. Nội dung và phương pháp thẩm định**
- Điều 7: xem xét cơ sở vật chất, trang thiết bị; nguồn nhân lực tham gia sản xuất, kinh doanh và quản lý ATTP; việc thực hiện quy định, tiêu chuẩn, quy chuẩn kỹ thuật quốc gia về chương trình quản lý ATTP và ghi nhãn hàng hóa.
- Lấy mẫu kiểm nghiệm do Đoàn thẩm định xem xét, quyết định trên cơ sở đánh giá nguy cơ khi có nghi ngờ sản phẩm không bảo đảm ATTP hoặc hoạt động kiểm soát của cơ sở không bảo đảm; việc lấy mẫu/phân tích theo quy định hiện hành.
- Phương pháp thẩm định gồm xem xét hồ sơ, tài liệu lưu; đánh giá thực tế nhà xưởng, thiết bị, nguồn lực quản lý, chương trình quản lý ATTP, truy xuất nguồn gốc, thu hồi và xử lý sản phẩm không bảo đảm; đánh giá kết quả thực hiện, phỏng vấn và lấy mẫu khi cần.
- Điều 8: “Đạt” khi đáp ứng đầy đủ yêu cầu điều kiện ATTP theo pháp luật; “Không đạt” khi chưa đáp ứng hoặc còn điểm không phù hợp không thể khắc phục trong thời hạn yêu cầu. Việc thẩm định/phân loại theo mẫu tương ứng tại Phụ lục II, III.

**3. Trình tự và thời hạn ở cấp quy định chuyên ngành**
- Điều 12: hồ sơ xin cấp Giấy chứng nhận gồm các thành phần theo khoản 1 Điều 36 Luật ATTP; nộp trực tuyến, qua bưu điện hoặc trực tiếp đến cơ quan có thẩm quyền theo Điều 5.
- Sau khi nhận hồ sơ, cơ quan có thẩm quyền thẩm tra tính đầy đủ, hợp lệ; thông báo kết quả và ngày dự kiến thẩm định nếu hợp lệ, hoặc thông báo hồ sơ không đạt và nêu rõ lý do.
- Điều 13: cơ quan có thẩm quyền ban hành quyết định thành lập Đoàn thẩm định ngay sau khi thông báo hồ sơ hợp lệ; quyết định cần xác định căn cứ, phạm vi/nội dung, cơ sở, thành viên và trách nhiệm.
- Điều 14: tổ chức thẩm định tại cơ sở trong vòng 15 ngày kể từ ngày nhận đủ hồ sơ hợp lệ; Đoàn công bố quyết định, đánh giá hồ sơ và thực tế, lập biên bản, thông báo kết quả; nếu phát hiện vi phạm thì lập biên bản/chuyển cơ quan có thẩm quyền xử lý.
- Điều 15: biên bản phải lập tại cơ sở ngay sau khi kết thúc thẩm định, phản ánh chính xác kết quả, nêu rõ hạng mục không bảo đảm và thời hạn khắc phục, kết luận chung, ý kiến cơ sở và chữ ký theo quy định.
- Điều 16: cơ quan có thẩm quyền thẩm tra biên bản; kết quả đạt thì cấp giấy theo mẫu, hiệu lực 3 năm; nếu có lấy mẫu thì phải chờ kết quả đạt. Trường hợp không đạt và không khắc phục đúng hạn thì thông báo không cấp giấy; có cơ chế thẩm tra khắc phục trong thời hạn luật định. Cơ quan có thẩm quyền phải thống kê/công khai danh sách cơ sở được cấp và chưa đáp ứng.
- Lưu ý: mốc 15 ngày trong VBHN là thời hạn tổ chức thẩm định tại cơ sở theo Điều 14; không tự đồng nhất với tổng thời hạn TTHC tại địa phương nếu quyết định công bố TTHC quy định/diễn giải tổng thời gian khác.

**4. Phân biệt hồ sơ người nộp và biểu mẫu cơ quan**
- Điều 12 dẫn chiếu thành phần hồ sơ theo khoản 1 Điều 36 Luật ATTP. Không được tự thay thế bằng checklist tự thiết kế hoặc coi toàn bộ nội dung bản thuyết minh là giấy tờ độc lập phải nộp nếu điều luật không quy định như vậy.
- Phụ lục III của VBHN: Đơn đề nghị cấp Giấy chứng nhận.
- Phụ lục IV: Bản thuyết minh điều kiện bảo đảm ATTP; có dữ liệu về cơ sở, loại hình, công suất/diện tích, sản lượng, thị trường, sản phẩm, nguyên liệu/nguồn gốc, sơ đồ mặt bằng, thiết bị, nguồn nước/đá, xử lý chất thải, nhân lực, sức khỏe/kiến thức ATTP, vệ sinh, hóa chất/phụ gia, hệ thống quản lý chất lượng và phòng kiểm nghiệm.
- Phụ lục V: Mẫu Giấy chứng nhận.
- Phụ lục II: danh mục 14 mẫu biên bản thẩm định theo loại hình: BB1.1–BB1.6 và BB2.1–BB2.8. Đây là công cụ nghiệp vụ của đoàn thẩm định, không phải 14 thành phần hồ sơ người nộp.
- Phụ lục I: mẫu thống kê/lập danh sách cơ sở; Phụ lục I.A: mẫu biên bản kiểm tra ATTP (hoạt động kiểm tra, không phải đơn đề nghị cấp giấy).
- Cảnh báo kỹ thuật/pháp lý: Điều 12 trong phần thân VBHN còn câu dẫn mẫu đơn tại Phụ lục V và bản thuyết minh tại Phụ lục VI theo cấu trúc cũ của TT38/2018; nhưng chú thích sửa đổi tại chính VBHN và phần phụ lục hiện hành cho thấy mẫu đơn cũ đã được thay bằng Phụ lục III, mẫu thuyết minh cũ bằng Phụ lục IV, mẫu giấy chứng nhận cũ bằng Phụ lục V. Vì vậy không lấy số phụ lục cũ trong câu Điều 12 làm mã biểu mẫu hiện hành. Cần ghi nhận đây là điểm biên tập/dẫn chiếu cần rà soát, không tự sửa văn bản gốc.
- Tệp VBHN được đọc thể hiện rõ mẫu đơn và bản thuyết minh; tuy nhiên thành phần hồ sơ pháp lý bắt buộc vẫn phải đối chiếu khoản 1 Điều 36 Luật ATTP và TTHC địa phương hiện hành. Không suy diễn rằng mọi trường dữ liệu trong bản thuyết minh đều là giấy tờ đính kèm riêng.

**5. Điều kiện nhân sự thẩm định và trách nhiệm**
- Thành viên đoàn: trung thực, khách quan, không xung đột lợi ích; chuyên môn phù hợp; đã được đào tạo/tập huấn nghiệp vụ.
- Trưởng đoàn: đáp ứng điều kiện thành viên, có ít nhất 02 năm kinh nghiệm và đã tham gia thẩm định ít nhất 05 cơ sở trong lĩnh vực.
- Người lấy mẫu: chuyên môn phù hợp và có chứng chỉ/giấy chứng nhận đào tạo hoặc tập huấn về lấy mẫu.
- Trưởng đoàn điều hành, bảo đảm khách quan, ký biên bản/báo cáo và chịu trách nhiệm; thành viên đánh giá theo phân công, tuân thủ phương pháp, chịu trách nhiệm về phần việc.
- Phần mềm phải có bước kiểm tra điều kiện nhân sự và xung đột lợi ích trước khi phát hành quyết định thành lập đoàn; không tự động chỉ định người nếu chưa có dữ liệu chứng minh năng lực/điều kiện.

**6. Điểm cần khóa trong thiết kế DocuGuard**
1. Tách ít nhất ba loại đối tượng: (i) tài liệu cơ sở nộp; (ii) biểu mẫu/biên bản do cơ quan hoặc đoàn thẩm định lập; (iii) kết quả/giấy chứng nhận do người có thẩm quyền ban hành.
2. Sinh biểu mẫu BB theo loại hình và phạm vi hoạt động đã xác minh, không gán đồng loạt cả 14 mẫu.
3. Không suy ra “đạt” từ việc tải lên hoặc gắn tài liệu. Mỗi tiêu chí phải có trạng thái đánh giá nội dung, bằng chứng, người đánh giá, căn cứ và lý do không áp dụng.
4. Luồng nghiệp vụ phải có: phân loại đối tượng/ngoại lệ → kiểm tra thành phần hồ sơ theo Điều 36 Luật ATTP và TTHC địa phương → xác nhận hợp lệ → thành lập đoàn đủ điều kiện → thẩm định hồ sơ và thực tế → biên bản → khắc phục/thẩm tra nếu phát sinh → cơ quan thẩm quyền quyết định cấp/không cấp → công khai/lưu trữ.
5. Tách đồng hồ thời hạn: tiếp nhận/kiểm tra tính hợp lệ; thời hạn tổ chức thẩm định tại cơ sở; thời gian khắc phục; thời gian xử lý kết quả; tổng thời hạn TTHC địa phương. Không cộng/trừ hoặc tự suy diễn khi chưa có quy định địa phương đã xác minh.
6. Chưa chuyển quy tắc sang trạng thái DA_XAC_MINH; chưa sửa registry, mã nguồn, Supabase hoặc Vercel.

**7. Tình trạng rà soát địa phương**
- Tra cứu mới xác nhận trang hệ thống văn bản chính thức của Sở tiếp tục liệt kê QĐ2133/QĐ-UBND ngày 01/07/2026 là còn hiệu lực và mô tả đây là quy trình nội bộ thuộc thẩm quyền giải quyết của Sở NN&MT. Điều này xác nhận phạm vi của QĐ2133 không mặc nhiên bao gồm tuyến cấp xã.
- Công báo Phú Thọ có bản QĐ1046/QĐ-UBND ngày 18/09/2025 về ủy quyền cho Giám đốc Sở và Chủ tịch UBND xã/phường; cần bóc toàn văn điều khoản và phụ lục để lập ma trận thẩm quyền.
- Trang danh mục của Sở đồng thời liệt kê QĐ1091 và QĐ602 ở trạng thái “còn hiệu lực”; do đó ghi nhận trước đây rằng QĐ602 đã bị thay thế bởi QĐ1091 chưa đủ căn cứ chỉ từ trạng thái trên trang danh mục. Phải đọc điều khoản thay thế/bãi bỏ của bản gốc QĐ1091 và kiểm tra bản QĐ602. Cho đến khi xác minh được, đánh dấu QĐ602/QĐ1091 là “mâu thuẫn trạng thái – cần đối chiếu bản gốc”, không kết luận QĐ602 đã hết hiệu lực chỉ từ báo cáo nghiên cứu.
- Chưa có bản gốc QĐ1773/QĐ-UBND ngày 02/06/2026 và QĐ108/2025/QĐ-UBND được bóc tách trong lần này. Chưa xác định được chúng làm thay đổi trực tiếp thành phần hồ sơ, phí, thời hạn hoặc tuyến giải quyết TTHC 2.001827 như thế nào.
- Mức phí 700.000 đồng/cơ sở xuất hiện trong QĐ1088 năm 2025 là dữ liệu của quyết định công bố tại thời điểm đó; chưa đủ căn cứ khẳng định là mức phí hiện hành ngày 10/11/2026. Phải đối chiếu quy định phí trung ương và quyết định TTHC địa phương mới nhất trước khi cấu hình.

**Kết luận:** VBHN 88 đã cung cấp nền tảng nghiệp vụ đủ để thiết kế khung phân loại, thẩm định, bằng chứng và biểu mẫu. Tuy nhiên, thành phần hồ sơ cụ thể, phí, thẩm quyền/tuyến xử lý và quy trình nội bộ áp dụng tại Phú Thọ vẫn cần hoàn tất đối chiếu Luật ATTP, quyết định địa phương và các bản gốc chưa thu thập. Không dùng riêng VBHN 88 để tuyên bố toàn bộ TTHC địa phương đã được xác minh.

**Không thực hiện thay đổi mã nguồn, registry, Supabase, Vercel hoặc Production trong lần cập nhật này.** Đây là cập nhật tài liệu nghiên cứu/bàn giao; chưa chạy build/test/CI.


### 17.15. Xác minh toàn văn QĐ1046 và QĐ1091: phân tuyến thẩm quyền và quy trình nội bộ Phú Thọ (10/11/2026)

**Nguồn chính thức:** bản Công báo Phú Thọ:
- QĐ1046/QĐ-UBND ngày 18/09/2025: https://congbao.phutho.gov.vn/tmp/Documents/Volumn2025/09/19/doc_219270.pdf
- QĐ1091/QĐ-UBND ngày 22/09/2025: https://congbao.phutho.gov.vn/tmp/Documents/Volumn2025/09/23/doc_219287.pdf

**1. Phân tuyến thẩm quyền theo QĐ1046**
- QĐ1046 ủy quyền nhiệm vụ thuộc thẩm quyền Chủ tịch UBND tỉnh cho Giám đốc Sở NN&MT và Chủ tịch UBND xã/phường; hiệu lực từ ngày ký đến hết ngày 28/02/2027 (Điều 2).
- Phụ lục, mục 1: Giám đốc Sở được ủy quyền cấp Giấy chứng nhận ATTP đối với cơ sở thuộc diện phải cấp giấy có Giấy chứng nhận đăng ký kinh doanh, Giấy chứng nhận đăng ký doanh nghiệp hoặc Giấy chứng nhận đầu tư do cấp tỉnh cấp.
- Phụ lục, mục 9: Chủ tịch UBND xã/phường được ủy quyền cấp Giấy chứng nhận ATTP đối với cơ sở thuộc diện phải cấp giấy có giấy chứng nhận đăng ký kinh doanh, giấy chứng nhận kinh tế trang trại hoặc hợp tác xã do xã/phường cấp.
- Hệ quả thiết kế: phân tuyến không được xác định chỉ bằng địa chỉ cơ sở hoặc tên loại hình. Phải thu thập loại giấy tờ pháp lý của cơ sở, cơ quan cấp giấy, chủ thể đứng tên và kiểm tra đúng điều kiện tại phụ lục QĐ1046. Nếu giấy tờ không khớp hai nhóm hoặc có tình huống đặc thù, chuyển trạng thái “cần xác minh thẩm quyền”, không tự chọn tuyến.
- Mốc hết thời hạn ủy quyền 28/02/2027 là một điều kiện thời gian bắt buộc. Hệ thống phải quản lý hiệu lực theo ngày tiếp nhận/ngày giải quyết và cảnh báo rà soát trước khi hết thời hạn; không mặc định ủy quyền tiếp tục sau ngày này nếu chưa có văn bản mới.

**2. QĐ1091 và hiệu lực thay thế một phần QĐ602**
- QĐ1091 phê duyệt quy trình nội bộ giải quyết TTHC lĩnh vực Quản lý chất lượng nông lâm sản và thủy sản thuộc thẩm quyền các cấp chính quyền Phú Thọ.
- Điều 3 QĐ1091 ghi rõ bãi bỏ 08 quy trình nội bộ giải quyết TTHC số 1–8, Mục I, Phần I kèm QĐ602/QĐ-UBND ngày 11/08/2025.
- Vì vậy, đối với các quy trình cụ thể nằm trong phạm vi 08 quy trình bị bãi bỏ, QĐ1091 thay thế QĐ602. Không diễn đạt rộng rằng toàn bộ QĐ602 bị bãi bỏ nếu quyết định chỉ nêu rõ 08 quy trình nói trên. Việc trang danh mục của Sở cùng hiển thị QĐ602 “còn hiệu lực” và QĐ1091 “còn hiệu lực” có thể do QĐ602 còn các nội dung khác chưa bị bãi bỏ; trạng thái tổng thể trên danh mục không phủ nhận điều khoản bãi bỏ cụ thể của QĐ1091.
- Mục I, Phần I QĐ1091 liệt kê TTHC mã 2.001827 theo tuyến ủy quyền Giám đốc Sở; Mục II liệt kê cùng mã TTHC theo tuyến ủy quyền Chủ tịch UBND xã/phường.

**3. Quy trình nội bộ theo QĐ1091 – tuyến Giám đốc Sở**
Tổng thời gian ghi tại quy trình: 15 ngày, chia thành:
1. Tiếp nhận, kiểm tra, hướng dẫn, số hóa và chuyển xử lý; Trung tâm Phục vụ hành chính công tỉnh hoặc cấp xã nơi nhận: 0,5 ngày.
2. Thẩm định hồ sơ; chuyên viên/lãnh đạo phòng chuyên môn, trạm; lãnh đạo Chi cục trực thuộc Sở; Đoàn đánh giá theo quyết định thành lập: 10 ngày.
3. Lãnh đạo Chi cục xét duyệt, trình lãnh đạo Sở: 01 ngày.
4. Lãnh đạo Sở xét duyệt kết quả TTHC: 02 ngày.
5. Văn thư Sở và chuyên viên Chi cục phát hành/chuyển kết quả: 01 ngày.
6. Trung tâm Phục vụ hành chính công nhận, cập nhật, lưu kho và trả kết quả: 0,5 ngày.

**4. Quy trình nội bộ theo QĐ1091 – tuyến Chủ tịch UBND xã/phường**
Tổng thời gian ghi tại quy trình: 15 ngày, chia thành:
1. Tiếp nhận, kiểm tra, hướng dẫn, số hóa và chuyển xử lý; Trung tâm Phục vụ hành chính công tỉnh hoặc cấp xã nơi nhận: 0,5 ngày.
2. Thẩm định hồ sơ; chuyên viên/lãnh đạo phòng chuyên môn, lãnh đạo UBND xã/phường; Đoàn đánh giá theo quyết định thành lập: 10 ngày.
3. Lãnh đạo phòng chuyên môn xét duyệt, trình lãnh đạo UBND xã/phường: 01 ngày.
4. Lãnh đạo UBND xã/phường xét duyệt kết quả: 02 ngày.
5. Văn thư và chuyên viên phòng chuyên môn phát hành/chuyển kết quả: 01 ngày.
6. Trung tâm Phục vụ hành chính công cấp xã nhận, cập nhật, lưu kho và trả kết quả: 0,5 ngày.

**5. Kiểm soát khi chuyển thành quy trình phần mềm**
- Hai tuyến có cùng tổng thời gian 15 ngày nhưng khác chủ thể xử lý, cấp phê duyệt, văn thư và Trung tâm Phục vụ hành chính công trả kết quả. Phải cấu hình thành hai luồng riêng, không dùng một quy trình chung chỉ thay tên cơ quan ở bước cuối.
- QĐ1091 ghi thời gian thẩm định hồ sơ 10 ngày trong quy trình nội bộ; VBHN 88 Điều 14 quy định tổ chức thẩm định tại cơ sở trong vòng 15 ngày kể từ ngày nhận đủ hồ sơ hợp lệ. Đây là hai mô tả ở hai lớp quy định khác nhau; không tự cộng thành 25 ngày hoặc tự xem 10 ngày là thay thế Điều 14. Cần kiểm tra cách vận hành và đồng hồ thời hạn trên Hệ thống TTHC tỉnh; bảo đảm không làm sai tổng thời hạn TTHC 15 ngày đã công bố tại quy trình địa phương.
- QĐ1091 là bản quy trình nội bộ năm 2025; QĐ2133/QĐ-UBND ngày 01/07/2026 được Sở liệt kê là quy trình nội bộ mới thuộc thẩm quyền Sở. Do đó tuyến Sở cần dùng QĐ2133 làm đầu mối cập nhật sau 01/07/2026; tuyến xã vẫn phải tiếp tục kiểm tra QĐ1091, QĐ1773 và các văn bản sửa đổi khác. Không mặc định QĐ2133 thay thế tuyến xã.
- Không dùng bảng bước/định mức thời gian trên đây làm căn cứ hiện hành sau các quyết định năm 2026 cho đến khi đã đọc bản gốc QĐ2133 và QĐ1773, xác định điều khoản thay thế và đối chiếu dữ liệu TTHC điện tử đang công khai.

**Kết luận cập nhật:** Đã xác minh được căn cứ phân tuyến theo loại giấy tờ đăng ký và cơ quan cấp giấy; đã xác minh QĐ1091 bãi bỏ đúng 08 quy trình thuộc QĐ602 và có hai tuyến xử lý riêng cho mã 2.001827. Đây là cơ sở nghiệp vụ quan trọng để mô hình hóa tuyến Sở/tuyến xã, nhưng cần cập nhật tiếp bằng QĐ2133, QĐ1773 và các quy định phân cấp hiện hành trước khi chốt quy trình phần mềm. Chưa sửa registry, mã nguồn, Supabase hoặc Vercel; chưa chạy build/test/CI.


### 17.16. Đối chiếu phân cấp quản lý theo QĐ108/2025 và cập nhật tình trạng QĐ2133/QĐ1773 (10/11/2026)

**1. QĐ108/2025/QĐ-UBND**
- Tra cứu được toàn văn nội dung QĐ108/2025/QĐ-UBND ngày 27/11/2025; văn bản có hiệu lực từ 15/12/2025. Nguồn hiện truy cập được là bản toàn văn trên Thư Viện Pháp Luật (nguồn thứ cấp), chưa thu thập được bản PDF ký số/Công báo từ nguồn chính thức của tỉnh. Vì vậy nội dung dưới đây là kết quả nghiên cứu sơ bộ, chưa đủ điều kiện nâng trạng thái pháp lý trong registry.
- Điều 3 quy định nguyên tắc: phân cấp quản lý cơ sở giữa cấp tỉnh và cấp xã theo nguyên tắc cấp nào cấp giấy chứng nhận đăng ký kinh doanh/giấy chứng nhận đăng ký đầu tư thì cấp đó quản lý; bảo đảm một cơ sở sản xuất, kinh doanh, một loại sản phẩm chỉ chịu sự quản lý của một cơ quan quản lý nhà nước.
- Điều 4: Sở NN&MT quản lý cơ sở sản xuất, kinh doanh nông lâm thủy sản có giấy chứng nhận đăng ký kinh doanh hoặc giấy chứng nhận đăng ký đầu tư do cấp tỉnh cấp; tiếp nhận và quản lý hồ sơ tự công bố sản phẩm thuộc lĩnh vực NN&MT.
- Điều 5: UBND xã/phường quản lý cơ sở có giấy chứng nhận đăng ký liên hiệp hợp tác xã, giấy chứng nhận đăng ký hợp tác xã hoặc giấy chứng nhận đăng ký kinh doanh do cơ quan đăng ký kinh doanh có thẩm quyền cấp tại địa bàn; đồng thời quản lý cơ sở không thuộc diện cấp Giấy chứng nhận đủ điều kiện ATTP trên địa bàn theo TT17/2018/TT-BNNPTNT.
- Điều 6: Sở có trách nhiệm tổ chức triển khai, kiểm tra/hậu kiểm, xử lý vi phạm, giám sát chất lượng/ATTP đối với cơ sở thuộc Điều 4; tập huấn, hướng dẫn nghiệp vụ cho UBND cấp xã; rà soát, trình Chủ tịch UBND tỉnh công bố TTHC được sửa đổi, bổ sung do phân cấp; kiểm tra việc thực hiện trách nhiệm của cấp xã.
- Điều 9: UBND cấp xã chịu trách nhiệm quản lý, kiểm tra/hậu kiểm, xử lý vi phạm, giám sát đối với cơ sở thuộc Điều 5 và tập huấn/hướng dẫn cơ sở trong phạm vi quản lý.
- Cần phân biệt QĐ108 (phân cấp quản lý nhà nước theo nhóm chủ thể/cơ sở) với QĐ1046 (ủy quyền thực hiện nhiệm vụ cấp Giấy chứng nhận). Không tự suy luận rằng mọi chủ thể thuộc phạm vi quản lý của một cấp thì cấp đó đương nhiên có toàn bộ thẩm quyền cấp giấy trong mọi tình huống; phải kiểm tra đồng thời điều khoản ủy quyền, TTHC công bố và quy trình nội bộ.
- Do nguồn hiện tại là nguồn thứ cấp, toàn bộ nội dung QĐ108 trên chỉ được ghi nhận ở mức “đã tìm thấy nội dung, chờ đối chiếu bản gốc chính thức”. Chưa xác minh tình trạng hiệu lực đến ngày 10/11/2026 bằng dữ liệu chính thức.

**2. QĐ2133/QĐ-UBND ngày 01/07/2026**
- Trang Hệ thống văn bản của Sở NN&MT Phú Thọ hiện liệt kê QĐ2133 là “Còn hiệu lực”, trích yếu: phê duyệt quy trình nội bộ giải quyết TTHC lĩnh vực Quản lý chất lượng nông lâm sản và thủy sản thuộc thẩm quyền giải quyết của Sở NN&MT.
- Nguồn: https://sonnmt.phutho.gov.vn/he-thong-van-ban
- Đây là bằng chứng chính thức về việc văn bản được Sở liệt kê và phạm vi theo trích yếu; chưa thu thập/đọc được bản PDF quyết định và phụ lục quy trình trong lần này. Do đó chưa xác định được mã TTHC, thành phần các bước, vai trò, thời gian từng bước, điều khoản bãi bỏ/thay thế QĐ1091.
- Tạm thời: QĐ2133 là đầu mối bắt buộc phải kiểm tra cho tuyến Sở; không dùng thời gian và các bước tuyến Sở theo QĐ1091 năm 2025 như cấu hình hiện hành trước khi đối chiếu bản QĐ2133.

**3. QĐ1773/QĐ-UBND ngày 02/06/2026**
- Chưa tìm được bản gốc chính thức hoặc bản PDF có thể kiểm chứng trong nguồn đã tra cứu.
- Báo cáo sáng kiến trong Library có nhắc QĐ1773 là văn bản công bố danh mục TTHC sửa đổi, bổ sung thuộc thẩm quyền các cấp; nhưng báo cáo thứ cấp không thay thế quyết định và phụ lục gốc.
- Chưa xác định được QĐ1773 có sửa TTHC 2.001827 hay không; không suy diễn về hồ sơ, thời hạn, phí, cơ quan giải quyết hoặc biểu mẫu.
- Trạng thái: “chưa thu thập bản gốc – chưa xác minh phạm vi ảnh hưởng”.

**4. Ma trận nguyên tắc hiện tại (chưa phải cấu hình pháp lý đã duyệt)**
- Trục A — phân cấp quản lý cơ sở: kiểm tra loại giấy tờ đăng ký, cơ quan cấp, chủ thể đứng tên, địa bàn và loại hoạt động; đối chiếu QĐ108 sau khi có bản gốc.
- Trục B — thẩm quyền thực hiện cấp giấy: kiểm tra văn bản ủy quyền QĐ1046, thời hạn ủy quyền, điều kiện tại phụ lục và quyết định thay thế/gia hạn nếu có.
- Trục C — thủ tục hành chính: kiểm tra bản công bố TTHC mới nhất và mã thủ tục; đối chiếu QĐ548, QĐ1088, QĐ1773 và dữ liệu Cổng DVC.
- Trục D — quy trình nội bộ: tuyến Sở kiểm tra QĐ2133; tuyến xã kiểm tra QĐ1091 và mọi văn bản sửa đổi sau đó.
- Trục E — quản lý cơ sở không thuộc diện cấp giấy: áp dụng nhánh quản lý theo TT17/2018 và QĐ108 sau khi xác minh bản gốc, không đưa các cơ sở này vào quy trình cấp Giấy chứng nhận.
- Trường hợp giấy tờ đăng ký không rõ cơ quan cấp, giấy tờ thuộc loại không được liệt kê, có nhiều địa điểm/hoạt động hoặc có khả năng chồng lấn quản lý: chuyển “CẦN XÁC MINH THẨM QUYỀN”, không tự định tuyến.
- Phải kiểm tra nguyên tắc một cơ sở/một loại sản phẩm/một cơ quan quản lý, tránh tạo hai hồ sơ quản lý trùng ở tỉnh và xã; trường hợp cơ sở nhiều hoạt động/sản phẩm cần có quy tắc phân tách theo loại sản phẩm và thẩm quyền được văn bản cho phép, không tự áp dụng máy móc.

**5. Việc cần làm tiếp**
1. Thu thập PDF chính thức QĐ2133 và lập bảng đối chiếu từng bước với QĐ1091.
2. Thu thập bản gốc QĐ1773, kiểm tra phụ lục và xác định thay đổi cụ thể của TTHC 2.001827.
3. Thu thập bản ký số/Công báo QĐ108/2025, xác minh hiệu lực và đối chiếu với QĐ1046, TT17/2025, TT22/2026.
4. Đối chiếu TTHC trên Cổng DVC tỉnh và CSDL quốc gia với các quyết định công bố gốc; giải quyết các điểm dữ liệu biểu mẫu/phí/thời hạn không thống nhất.
5. Chỉ sau các bước trên mới hoàn thiện bảng quy trình thao tác công chức và đề xuất cấu hình phần mềm.

**Giới hạn thay đổi:** Chỉ cập nhật sổ bàn giao nghiên cứu; không sửa mã nguồn, registry pháp lý, Supabase, Vercel hoặc Production; không chạy build/test/CI.
