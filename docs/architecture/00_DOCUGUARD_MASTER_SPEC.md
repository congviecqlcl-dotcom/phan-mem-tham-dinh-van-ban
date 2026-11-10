# DOCUGUARD AI — MASTER SPECIFICATION
**Phiên bản tài liệu:** 2.1-draft  
**Ngày lập:** 10/11/2026  
**Trạng thái:** Kiến trúc nền tảng đã thống nhất về nguyên tắc; nội dung chi tiết tiếp tục được đặc tả, phản biện và kiểm thử.  
**Phạm vi:** Dự án DocuGuard AI – Pháp chế & ATTP trong kho mã nguồn `congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban`.

## 1. Tầm nhìn và mục tiêu
DocuGuard AI là hệ thống hỗ trợ thẩm định hồ sơ, tài liệu và hoạt động sản xuất, sơ chế, chế biến, bảo quản, vận chuyển, phân phối, kinh doanh thực phẩm thuộc phạm vi quản lý. Hệ thống phải kết hợp:
- Pháp luật và thủ tục hành chính;
- Khoa học chuyên ngành, sinh học, nông học, chăn nuôi, thú y, thủy sản, công nghệ thực phẩm;
- Kỹ thuật, công nghệ, công suất và năng lực sản xuất;
- Chứng cứ hồ sơ và dữ liệu hoạt động;
- Kiểm tra chéo chuỗi cung ứng;
- Đánh giá rủi ro và phân luồng xử lý.

Mục tiêu không phải chỉ kiểm tra hồ sơ có đủ giấy tờ hay không. Hệ thống phải đánh giá nội dung kê khai có phù hợp quy định, nguyên lý khoa học, điều kiện kỹ thuật, năng lực và chứng cứ hay không.

## 2. Nguyên tắc kiến trúc không được phá vỡ
1. **Bao quát toàn chuỗi:** không giới hạn một loại thực phẩm, loại hình cơ sở, công đoạn hay biểu mẫu.
2. **Mô hình mở:** sản phẩm, hoạt động, cơ sở và quy tắc phải có thể mở rộng bằng cấu hình/dữ liệu; tránh hard-code từng tình huống.
3. **Một cơ sở – nhiều hoạt động:** một cơ sở có thể đồng thời sản xuất, thu mua, sơ chế, chế biến, bảo quản, vận chuyển và bán hàng.
4. **Một sản phẩm – nhiều nguồn và công đoạn:** phải phân biệt sản phẩm tự sản xuất, sản phẩm thu mua, nguyên liệu, bán thành phẩm và thành phẩm.
5. **Đánh giá nội dung thực chất:** kiểm tra logic, số liệu, năng lực, quy trình, nguồn gốc và tính tương thích giữa các tài liệu.
6. **Pháp lý có căn cứ:** mỗi kết luận pháp lý phải truy xuất được văn bản, điều khoản, phiên bản, thời điểm hiệu lực, đối tượng và điều kiện áp dụng.
7. **Khoa học có điều kiện áp dụng:** không áp một mức năng suất/công suất chung cho mọi giống, vùng sinh thái, mùa vụ, phương thức và điều kiện sản xuất.
8. **Chứng cứ trước kết luận:** mọi phát hiện quan trọng phải liên kết dữ liệu nguồn, trích dẫn, trang/vị trí, phép tính và phương pháp.
9. **Không suy diễn:** thiếu dữ liệu phải trả về “CHƯA ĐỦ CĂN CỨ XÁC ĐỊNH”; không biến nghi vấn thành kết luận vi phạm hoặc gian lận.
10. **AI làm trước – công chức kiểm soát:** AI thực hiện tối đa công việc tự động hóa đáng tin cậy; công chức tập trung vào ngoại lệ, đánh giá chuyên môn, xác minh hiện trường và nội dung thuộc trách nhiệm pháp lý.
11. **Con người xác minh hiện trường:** AI có thể lập kế hoạch, checklist, phân tích ảnh/tài liệu được cung cấp và chỉ ra điểm cần kiểm tra, nhưng không tuyên bố đã trực tiếp xác minh cơ sở.
12. **Quyết định hành chính do người có thẩm quyền:** AI không ban hành hoặc thay thế quyết định.
13. **Tách kết quả nghiệp vụ và trạng thái kỹ thuật:** AI thành công, quy tắc cục bộ, lỗi API, OCR chưa rõ, chưa xử lý phải hiển thị riêng.
14. **An toàn và kiểm toán:** phân quyền, nhật ký, quản lý phiên bản, bảo vệ dữ liệu, truy xuất thao tác và kiểm soát thay đổi.
15. **Ngôn ngữ giao diện:** tiếng Việt có dấu; thuật ngữ rõ ràng, phù hợp công chức Việt Nam.

## 3. Ba đối tượng gốc phải tách biệt
- **Sản phẩm:** loại thực phẩm, đặc tính, nguồn gốc, dạng nguyên liệu/bán thành phẩm/thành phẩm, điều kiện bảo quản và nguy cơ.
- **Hoạt động:** sản xuất ban đầu, khai thác, thu hoạch, giết mổ, thu mua, tập kết, sơ chế, chế biến, đóng gói, bảo quản, vận chuyển, phân phối, bán buôn/bán lẻ và hoạt động liên quan.
- **Cơ sở/chủ thể:** tổ chức/cá nhân, địa điểm, pháp lý, diện tích, nhân lực, thiết bị, quy trình, công suất, nguồn lực và phạm vi hoạt động.

Ba nhóm phải được liên kết bằng quan hệ nhiều-nhiều; không thiết kế cơ sở chỉ có một sản phẩm hoặc một hoạt động.

## 4. Phạm vi thẩm định
### 4.1 Lớp pháp lý
Xác định văn bản áp dụng theo chủ thể, sản phẩm, hoạt động, quy mô, địa bàn, thời điểm và điều kiện cụ thể. Kiểm tra hiệu lực, sửa đổi, thay thế, bãi bỏ, chuyển tiếp và phân cấp thẩm quyền.

### 4.2 Lớp khoa học – chuyên ngành
Đánh giá tính hợp lý của các khai báo về giống, sinh trưởng, chu kỳ, mật độ, năng suất, sản lượng, tỷ lệ sống/hao hụt, định mức nguyên liệu, tỷ lệ thu hồi, công suất, bảo quản và các chỉ tiêu chuyên ngành khác.

### 4.3 Lớp kỹ thuật – năng lực
Đối chiếu địa điểm, diện tích, mặt bằng, nhân lực, thiết bị, công suất, nguyên liệu đầu vào, quy trình, thời gian vận hành và đầu ra.

### 4.4 Lớp chứng cứ
Đối chiếu đơn đề nghị, bản thuyết minh, hợp đồng, hóa đơn, chứng từ, giấy chứng nhận, nhật ký, kết quả kiểm nghiệm, hồ sơ truy xuất và tài liệu khác. Tài liệu phải được xem xét trong quan hệ với hoạt động mà nó chứng minh.

### 4.5 Lớp chuỗi cung ứng
Kiểm tra cân đối đầu vào – sản xuất – sơ chế/chế biến – hao hụt – tồn kho – đầu ra; đối chiếu nguồn hàng tự sản xuất và nguồn thu mua; nhận diện chênh lệch cần giải trình.

## 5. Chuẩn kết quả
Không sử dụng một nhãn “Đạt/Không đạt” duy nhất cho toàn bộ kết quả AI. Mỗi tiêu chí có một trạng thái:
- `checked_no_issue`: đã kiểm tra, không phát hiện sai lệch trong phạm vi tiêu chí;
- `checked_issue`: đã kiểm tra, có sai lệch/phát hiện;
- `not_verifiable`: chưa đủ dữ liệu hoặc chứng cứ để xác minh;
- `not_applicable`: không áp dụng, phải có lý do;
- `not_processed`: chưa được xử lý.

Phân loại phát hiện:
- Lỗi/sai lệch đã có căn cứ;
- Dấu hiệu bất hợp lý cần xác minh;
- Thiếu chứng cứ;
- Chưa đủ căn cứ xác định;
- Không phát hiện sai lệch trong phạm vi đã kiểm tra.

Mọi báo cáo phải thể hiện phạm vi, số tiêu chí áp dụng, số tiêu chí đã kiểm tra, số có phát hiện, số chưa xác minh, số chưa xử lý và lý do không áp dụng. Không được biến “0 phát hiện” thành tuyên bố “hồ sơ hoàn toàn tuân thủ”.

## 6. Phân luồng người xử lý
- AI xử lý kiểm tra cơ học, đối chiếu, phép tính, kiểm tra logic và phân tích tài liệu trong phạm vi có thể kiểm chứng.
- Công chức xem xét kết quả, xử lý ngoại lệ, đánh giá chuyên môn và quyết định nội dung theo phân công.
- Người được giao nhiệm vụ trực tiếp kiểm tra hiện trường thực hiện xác minh thực tế.
- Người có thẩm quyền quyết định hành chính.

## 7. Nguyên tắc phát triển
- Hoàn thiện bản đồ nghiệp vụ trước khi mở rộng lập trình.
- Quy tắc pháp lý/khoa học được quản lý như dữ liệu có phiên bản, nguồn, phạm vi, ngày hiệu lực và người duyệt.
- Không tự động áp dụng quy tắc khi chưa xác định được đối tượng và phạm vi.
- Thử nghiệm bằng bộ hồ sơ chuẩn, tình huống biên và ca sai lệch đã biết.
- Không đưa lên Production, thay đổi Supabase hoặc hợp nhất PR nếu chưa được chủ dự án phê duyệt.
- Mọi thay đổi phải có kiểm thử, ghi nhận tác động và cập nhật tài liệu bàn giao.

## 8. Tiêu chí thành công cấp sản phẩm
1. Tiếp nhận được hồ sơ gồm nhiều loại tài liệu và tài liệu ghép.
2. Nhận diện sản phẩm, chủ thể, cơ sở và nhiều hoạt động.
3. Không bỏ sót trang/tài liệu âm thầm; lưu vết OCR và độ không chắc chắn.
4. Xác định căn cứ pháp lý có hiệu lực và đúng phạm vi.
5. Đánh giá logic khoa học, kỹ thuật và năng lực có nguồn tham chiếu.
6. Đối chiếu chéo số liệu và chuỗi cung ứng.
7. Mỗi phát hiện quan trọng có bằng chứng truy xuất.
8. Tách biệt kết quả AI và kết quả quy tắc cục bộ/lỗi kỹ thuật.
9. Không khẳng định tuân thủ tuyệt đối khi phạm vi chưa được kiểm tra đầy đủ.
10. Công chức không phải đọc lại toàn bộ hồ sơ một cách máy móc khi các kiểm tra tự động đã hoàn thành và có bằng chứng; vẫn có quyền xem tài liệu gốc và kiểm tra theo mức rủi ro.
11. Không thay thế xác minh hiện trường hoặc thẩm quyền quyết định.
12. Có thể bổ sung nhóm sản phẩm/hoạt động mới mà không viết lại lõi.

## 9. Tài liệu liên kết
- `01_BUSINESS_DOMAIN_MAP.md`: mô hình miền nghiệp vụ.
- `02_LEGAL_SCIENCE_KNOWLEDGE.md`: quản trị tri thức pháp lý và khoa học.
- `03_TECHNICAL_ARCHITECTURE.md`: kiến trúc kỹ thuật.
- `04_PROJECT_STATE_AND_HANDOVER.md`: trạng thái và bàn giao xuyên phiên.
- `05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md`: ma trận sản phẩm × hoạt động × điều kiện thẩm định.\n- `06_PRODUCT_DATA_DICTIONARY.md`: từ điển dữ liệu sản phẩm, thuộc tính chuyên biệt SP01–SP16, trạng thái, nguồn gốc, đơn vị, bảo quản và kiểm soát chất lượng dữ liệu.\n- `07_ACTIVITY_DATA_DICTIONARY.md`: từ điển hoạt động HD01–HD20, đầu vào/đầu ra, quy trình, nguồn lực, công suất, chứng cứ và kiểm soát bất thường.\n- `08_LEGAL_APPLICABILITY_MATRIX.md`: ma trận trạng thái văn bản, phạm vi điều khoản, thời điểm áp dụng, chuyển tiếp và phân định thẩm quyền; có danh mục văn bản hạt giống và các điểm cần rà soát tiếp.

Tài liệu này là chuẩn kiến trúc cấp cao. Khi có mâu thuẫn, phải ghi nhận và trình chủ dự án xem xét; không tự ý xóa hoặc thay đổi nguyên tắc đã được chốt.
