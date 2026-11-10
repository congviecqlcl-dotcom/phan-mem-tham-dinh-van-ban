# DOCUGUARD AI — MA TRẬN ÁP DỤNG PHÁP LUẬT VỀ AN TOÀN THỰC PHẨM

**Mã tài liệu:** DG-LEGAL-08  
**Phiên bản:** 2.2-draft  
**Ngày rà soát nguồn ban đầu:** 10/11/2026  
**Trạng thái:** Khung quản trị và danh mục văn bản hạt giống đã tra cứu nguồn chính thức; CHƯA phải ma trận điều khoản hoàn chỉnh hoặc căn cứ để tự động kết luận hồ sơ.

## 1. Mục đích

Tài liệu quy định cách DocuGuard xác định văn bản và điều khoản pháp luật áp dụng cho một trường hợp cụ thể theo:
- Chủ thể và loại hình tổ chức;
- Địa điểm, địa bàn và cấp chính quyền;
- Sản phẩm, thành phần và trạng thái sản phẩm;
- Hoạt động thực tế và công đoạn trong chuỗi cung ứng;
- Quy mô, điều kiện và trường hợp miễn trừ;
- Thời điểm phát sinh hoạt động, nộp hồ sơ hoặc giải quyết thủ tục;
- Phân cấp, ủy quyền và cơ quan có thẩm quyền;
- Phiên bản văn bản, sửa đổi, thay thế, tạm ngưng và quy định chuyển tiếp.

Tài liệu này tách hai việc:
1. **Xác định văn bản có khả năng liên quan:** tìm nguồn và đưa vào danh sách cần đánh giá.
2. **Kích hoạt quy tắc pháp lý:** chỉ thực hiện sau khi điều khoản, hiệu lực, phạm vi, điều kiện, ngoại lệ và thẩm quyền đã được người có trách nhiệm duyệt.

Không được coi việc văn bản có từ khóa “an toàn thực phẩm” là đủ căn cứ để áp dụng cho mọi sản phẩm/cơ sở.

## 2. Phát hiện pháp lý trọng yếu tại ngày rà soát

### 2.1 Nghị định 46/2026/NĐ-CP đang bị tạm ngưng hiệu lực

Nghị định 46/2026/NĐ-CP được ban hành ngày 26/01/2026 và có ngày hiệu lực ghi nhận ban đầu là 26/01/2026. Tuy nhiên, Nghị quyết 15/2026/NQ-CP ngày 06/04/2026 quy định tạm ngưng hiệu lực áp dụng Nghị định 46/2026/NĐ-CP và Nghị quyết 66.13/2026/NQ-CP **cho đến khi Luật An toàn thực phẩm (sửa đổi) và Nghị định hướng dẫn Luật An toàn thực phẩm (sửa đổi) có hiệu lực thi hành**. Nghị quyết 15 thay thế Nghị quyết 09/2026/NQ-CP.

Trong thời gian tạm ngưng, Nghị quyết 15 quy định Nghị định 15/2018/NĐ-CP và các văn bản quy định, hướng dẫn thi hành tiếp tục có hiệu lực. Hồ sơ đã nộp trước ngày Nghị quyết 15 có hiệu lực được tiếp tục giải quyết theo Nghị định 15/2018/NĐ-CP và văn bản hướng dẫn liên quan.

Nguồn chính thức:
- Nghị quyết 15/2026/NQ-CP: https://vanban.chinhphu.vn/?classid=0&docid=217667&pageid=27160
- Bản ký số: https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/15-nqcp.signed.pdf
- Nghị định 46/2026/NĐ-CP: https://vanban.chinhphu.vn/?docid=216827&pageid=27160
- Nghị quyết 09/2026/NQ-CP (văn bản bị Nghị quyết 15 thay thế): https://vanban.chinhphu.vn/?docid=216891&pageid=27160

**Quy tắc hệ thống:** Không kích hoạt các quy tắc nghiệp vụ lấy từ Nghị định 46 hoặc Nghị quyết 66.13 trong thời gian chúng bị tạm ngưng. Vẫn lưu bản văn bản và quan hệ lịch sử để so sánh, đánh giá tác động, nhưng trạng thái phải là `suspended`; không xóa dữ liệu hoặc coi là văn bản chưa từng tồn tại.

### 2.2 Dự án Luật An toàn thực phẩm (sửa đổi) chưa được coi là luật đã ban hành

Các nguồn của Quốc hội trong tháng 9–11/2026 ghi nhận đây vẫn là dự án luật đang được xem xét, thảo luận và tiếp thu ý kiến. Ngày 07/11/2026, thông tin của Quốc hội cho biết Ban soạn thảo tiếp tục tiếp nhận ý kiến đến hết ngày 09/11/2026 và dự kiến báo cáo tại kỳ họp vào ngày 11/11/2026. Vì vậy, tại thời điểm rà soát 10/11/2026, bản dự thảo không được dùng như quy phạm có hiệu lực.

Nguồn:
- Quốc hội, tin ngày 07/11/2026: https://quochoi.vn/vanphongquochoi/cocautochuc/Pages/trang-chu.aspx?ItemID=102748
- Quốc hội, thông tin ngày 24/10/2026 về việc nghe Tờ trình và Báo cáo thẩm tra: https://quochoi.vn/tintuc/Pages/su-kien-noi-bat.aspx?ItemID=102434
- Cổng dự thảo Quốc hội: https://duthaoonline.quochoi.vn/dt/luat-an-toan-thuc-pham-sua-doi/260731103059615313

**Quy tắc hệ thống:** Dự thảo luật phải được lưu với loại nguồn `draft`, trạng thái `not_in_force`, không sinh nghĩa vụ, điều kiện, thành phần hồ sơ hoặc kết luận vi phạm. Khi luật được thông qua và công bố, phải tạo phiên bản nguồn mới, rà soát điều khoản chuyển tiếp và cập nhật văn bản hướng dẫn trước khi kích hoạt.

### 2.3 Không được suy rộng một quy định phân cấp của địa phương thành quy định toàn quốc

Nghị quyết 19/2025/NQ-HĐND của Thành phố Hồ Chí Minh là ví dụ về tổ chức riêng một Sở An toàn thực phẩm và phân công quản lý trên địa bàn thành phố. Nội dung này không tự động áp dụng cho tỉnh Phú Thọ hoặc địa phương khác.

Đối với từng địa phương, phải xác định:
- Quyết định/quy định chức năng, nhiệm vụ của Sở chuyên môn;
- Quy định tổ chức cơ quan chuyên môn cấp xã theo mô hình chính quyền địa phương hai cấp;
- Văn bản phân cấp, ủy quyền cụ thể;
- Danh mục thủ tục hành chính đã công bố;
- Quyết định giao cơ quan tiếp nhận, thẩm định, cấp giấy và kiểm tra;
- Văn bản chuyển tiếp sau sắp xếp đơn vị hành chính, tổ chức bộ máy.

Nguồn ví dụ TP.HCM: https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=180054&Keyword=

## 3. Mô hình bản ghi văn bản và điều khoản

### 3.1 Bản ghi văn bản (LegalInstrument)

| Trường | Nội dung |
|---|---|
| instrument_id | Mã định danh nội bộ |
| document_number | Số, ký hiệu |
| document_title | Tên đầy đủ |
| document_type | Luật/nghị quyết/nghị định/thông tư/quyết định/văn bản hợp nhất |
| issuing_authority | Cơ quan ban hành |
| issued_date | Ngày ban hành |
| effective_from / effective_to | Thời gian hiệu lực theo nguồn đã xác minh |
| legal_status | Trạng thái pháp lý tại thời điểm tra cứu |
| suspension_periods | Khoảng thời gian tạm ngưng |
| amendment_relations | Văn bản sửa đổi, bổ sung |
| replacement_relations | Văn bản thay thế |
| repeal_relations | Văn bản bãi bỏ toàn bộ/một phần |
| transitional_rules | Điều khoản chuyển tiếp |
| official_source_url | URL nguồn chính thức |
| signed_file_url | URL bản ký số/bản gốc nếu có |
| source_checked_at | Thời điểm kiểm tra nguồn |
| source_hash | Mã băm bản lưu |
| reviewer_id / approved_at | Người duyệt và thời điểm duyệt |
| notes | Giới hạn, điểm chưa xác minh |

### 3.2 Bản ghi điều khoản (LegalProvision)

| Trường | Nội dung |
|---|---|
| provision_id | Mã điều khoản nội bộ |
| instrument_id | Văn bản cha |
| chapter/article/clause/point | Chương/điều/khoản/điểm |
| exact_text | Trích dẫn nguyên văn |
| text_version | Phiên bản văn bản/điều khoản |
| effective_from / effective_to | Thời gian áp dụng của điều khoản |
| provision_status | Còn hiệu lực/bị sửa đổi/bị bãi bỏ/tạm ngưng/chưa rõ |
| subject_scope | Chủ thể thuộc phạm vi |
| product_scope | Sản phẩm/nhóm sản phẩm |
| activity_scope | Hoạt động/công đoạn |
| geographic_scope | Phạm vi địa lý |
| conditions | Điều kiện kích hoạt |
| exclusions | Trường hợp loại trừ |
| competent_authority | Cơ quan có thẩm quyền |
| required_evidence | Chứng cứ dùng để xác minh |
| linked_rules | Quy tắc nghiệp vụ được tạo từ điều khoản |
| reviewer_status | Chờ rà soát/đã duyệt/từ chối |

### 3.3 Bản ghi quy tắc nghiệp vụ (LegalRule)

Mỗi quy tắc phải có:
- Mã và phiên bản;
- Điều khoản nguồn;
- Mệnh đề pháp lý được chuyển thành điều kiện máy đọc;
- Đối tượng và phạm vi áp dụng;
- Điều kiện kích hoạt và ngoại lệ;
- Dữ liệu đầu vào, kiểu dữ liệu, đơn vị;
- Phép kiểm tra xác định;
- Kết quả có thể trả về;
- Bằng chứng tối thiểu;
- Hành động tiếp theo;
- Ngày bắt đầu/kết thúc áp dụng;
- Người biên soạn, người rà soát pháp lý, người phê duyệt.

Không tạo quy tắc chỉ từ phần tóm tắt văn bản, tin tức, câu trả lời AI hoặc dự thảo.

## 4. Danh mục trạng thái pháp lý

Không dùng một cờ boolean `is_active` duy nhất. Tối thiểu phải hỗ trợ:
- `in_force`: có hiệu lực tại thời điểm xét;
- `not_yet_effective`: đã ban hành nhưng chưa đến ngày hiệu lực;
- `expired`: hết thời hạn hiệu lực;
- `suspended`: tạm ngưng hiệu lực/áp dụng trong khoảng thời gian xác định;
- `partially_amended`: có điều khoản bị sửa đổi; cần quản lý phiên bản từng điều khoản;
- `partially_repealed`: bị bãi bỏ một phần;
- `fully_repealed`: bị bãi bỏ toàn bộ;
- `replaced`: đã bị văn bản khác thay thế;
- `transitional_only`: chỉ còn áp dụng cho trường hợp chuyển tiếp;
- `draft`: dự thảo, chưa phải văn bản có hiệu lực;
- `unknown_pending_verification`: chưa xác minh được trạng thái.

Trạng thái phải được tính tại ngày cần áp dụng, không chỉ tại ngày hệ thống chạy. Một văn bản có thể có hiệu lực tại thời điểm tiếp nhận hồ sơ nhưng đã bị thay thế tại thời điểm thẩm định; hệ thống phải lưu cả hai mốc và áp dụng quy tắc chuyển tiếp tương ứng.

## 5. Danh mục văn bản hạt giống đã tra cứu nguồn chính thức

Các mục dưới đây là danh sách khởi tạo, không phải toàn bộ hệ thống văn bản ATTP. Trạng thái mô tả chỉ phản ánh nội dung đã kiểm tra tại ngày 10/11/2026. Trước khi bật một quy tắc ở cấp điều khoản phải mở bản gốc, kiểm tra toàn bộ văn bản liên quan và được người có trách nhiệm duyệt.

| Mã | Văn bản | Phạm vi/quan hệ đã xác định | Trạng thái xử lý trong DocuGuard |
|---|---|---|---|
| PL001 | Luật An toàn thực phẩm số 55/2010/QH12 | Luật nền tảng được Nghị định 15/2018, Nghị quyết 15/2026 và văn bản chuyên ngành viện dẫn; dự án sửa đổi đang được xem xét | `baseline_pending_full_status_review`; phải rà soát từng điều và quan hệ luật chuyên ngành |
| PL002 | Nghị định 15/2018/NĐ-CP | Văn bản quy định chi tiết một số điều của Luật ATTP; được Nghị quyết 15/2026 xác định tiếp tục áp dụng trong thời gian Nghị định 46 bị tạm ngưng | `in_force_during_suspension`; tiếp tục rà soát sửa đổi/bãi bỏ từng điều |
| PL003 | Nghị định 46/2026/NĐ-CP | Nghị định hướng dẫn Luật ATTP, ban hành 26/01/2026; bị Nghị quyết 15/2026 tạm ngưng cho đến khi Luật sửa đổi và nghị định hướng dẫn mới có hiệu lực | `suspended`; không kích hoạt quy tắc |
| PL004 | Nghị quyết 09/2026/NQ-CP | Tạm ngưng Nghị định 46 đến hết 15/04/2026, sau đó dự kiến áp dụng lại từ 16/04/2026; đã bị Nghị quyết 15/2026 thay thế | `replaced`; chỉ giữ lịch sử |
| PL005 | Nghị quyết 15/2026/NQ-CP | Tạm ngưng Nghị định 46 và Nghị quyết 66.13 cho đến khi Luật ATTP sửa đổi và nghị định hướng dẫn có hiệu lực; quy định tiếp tục áp dụng Nghị định 15 trong thời gian tạm ngưng; có điều khoản chuyển tiếp cho hồ sơ đã nộp | `in_force` theo nguồn chính thức đã tra cứu; là khóa kiểm soát trạng thái PL002/PL003 |
| PL006 | Nghị quyết 66.13/2026/NQ-CP | Quy định về công bố, đăng ký sản phẩm thực phẩm; bị Nghị quyết 15/2026 tạm ngưng | `suspended`; không kích hoạt quy tắc |
| PL007 | Nghị định 131/2025/NĐ-CP | Phân định thẩm quyền chính quyền địa phương hai cấp trong lĩnh vực quản lý nhà nước của Bộ Nông nghiệp và Môi trường; hiệu lực ghi nhận 01/07/2025 | `candidate_in_force`; phải bóc điều khoản liên quan từng thủ tục/hoạt động |
| PL008 | Nghị định 136/2025/NĐ-CP | Phân quyền, phân cấp trong lĩnh vực nông nghiệp và môi trường; hiệu lực ghi nhận 01/07/2025 | `candidate_in_force`; phải bóc điều khoản và đối chiếu PL007 |
| PL009 | Nghị định 146/2025/NĐ-CP | Phân quyền, phân cấp trong lĩnh vực công nghiệp và thương mại; hiệu lực ghi nhận 01/07/2025 | `candidate_in_force`; phục vụ hoạt động thuộc ngành công thương |
| PL010 | Nghị định 148/2025/NĐ-CP | Phân quyền, phân cấp trong lĩnh vực y tế; hiệu lực ghi nhận 01/07/2025 | `candidate_in_force`; phục vụ hoạt động thuộc ngành y tế |
| PL011 | Thông tư 48/2025/TT-BYT | Phân cấp một số nhiệm vụ và giải quyết thủ tục hành chính ATTP thuộc thẩm quyền Bộ Y tế; ngày ban hành và hiệu lực ghi nhận 30/12/2025 | `candidate_in_force`; phải kiểm tra điều khoản, phạm vi và quan hệ với nghị định phân cấp |
| PL012 | Thông tư 17/2024/TT-BNNPTNT | Sửa đổi một số thông tư về thẩm định, chứng nhận cơ sở sản xuất, kinh doanh thực phẩm nông, lâm, thủy sản; hiệu lực 15/01/2025 | `partially_amended_candidate`; không coi toàn bộ thông tư nền hoặc toàn bộ TT17 có cùng trạng thái |
| PL013 | Thông tư 80/2025/TT-BNNMT | Quy định thẩm định, chứng nhận ATTP thủy sản xuất khẩu; hiệu lực 02/02/2026; bãi bỏ cụ thể Điều 2 TT17/2024 và một số văn bản/điều khoản liên quan theo Điều 36 | `candidate_in_force_scoped`; chỉ áp dụng đúng phạm vi thủy sản xuất khẩu và điều kiện thị trường nhập khẩu |
| PL014 | Dự thảo Luật An toàn thực phẩm (sửa đổi) | Dự án luật đang được hoàn thiện, thảo luận và tiếp thu ý kiến trong tháng 11/2026 | `draft`; chỉ theo dõi thay đổi, tuyệt đối không sinh nghĩa vụ pháp lý |

### Nguồn chính thức cho danh mục hạt giống

- Luật ATTP 55/2010/QH12: cần tiếp tục đối chiếu bản luật và CSDL quốc gia về VBPL để chốt trạng thái, lịch sử sửa đổi và quan hệ luật chuyên ngành; không dùng kết quả tìm kiếm đơn lẻ để khẳng định trạng thái toàn văn.
- Nghị định 15/2018/NĐ-CP: https://vanban.chinhphu.vn/?Pageid=27160&docid=192829
- Nghị định 46/2026/NĐ-CP: https://vanban.chinhphu.vn/?docid=216827&pageid=27160
- Nghị quyết 15/2026/NQ-CP: https://vanban.chinhphu.vn/?classid=0&docid=217667&pageid=27160
- Nghị quyết 09/2026/NQ-CP: https://vanban.chinhphu.vn/?docid=216891&pageid=27160
- Nghị định 131/2025/NĐ-CP: https://vanban.chinhphu.vn/?classid=1&docid=213934&pageid=27160
- Nghị định 136/2025/NĐ-CP: https://vanban.chinhphu.vn/?classid=1&docid=213924&orggroupid=2&pageid=27160
- Nghị định 146/2025/NĐ-CP: https://vanban.chinhphu.vn/?classid=1&docid=213914&pageid=27160
- Nghị định 148/2025/NĐ-CP: https://vanban.chinhphu.vn/?classid=0&docid=213932&pageid=27160
- Thông tư 48/2025/TT-BYT: https://vanban.chinhphu.vn/?classid=1&docid=216428&pageid=27160&typegroupid=6
- Thông tư 17/2024/TT-BNNPTNT: https://vanban.chinhphu.vn/?classid=1&docid=212116&pageid=27160&typegroupid=6
- Thông tư 80/2025/TT-BNNMT (bản gốc tại CSDL quốc gia về VBPL): https://vbpl.vn/FileData/TW/Lists/vbpq/Attachments/186338/VanBanGoc_80-2025-TT-BNNMT.pdf
- Dự thảo luật tại Quốc hội: https://duthaoonline.quochoi.vn/dt/luat-an-toan-thuc-pham-sua-doi/260731103059615313

## 6. Ma trận phân định thẩm quyền: không gán cứng theo ngành một cách giản lược

Việc phân định cơ quan quản lý không thể chỉ dựa trên tên sản phẩm hoặc suy luận “thịt thuộc nông nghiệp, thực phẩm đóng gói thuộc y tế”. Phải kết hợp:
- Nhóm sản phẩm và thành phần;
- Công đoạn/hoạt động thực tế;
- Nguồn gốc sản phẩm;
- Thị trường nội địa hay xuất khẩu/nhập khẩu;
- Loại thủ tục đang xử lý;
- Quy định phân công quản lý của Chính phủ và bộ chuyên ngành;
- Phân cấp, ủy quyền tại địa phương;
- Cơ quan được công bố trong thủ tục hành chính hiện hành.

### 6.1 Các trục ngành cần kiểm tra

| Trục quản lý | Nhóm văn bản hạt giống | Nội dung phải bóc tách |
|---|---|---|
| Y tế | Nghị định 148/2025/NĐ-CP; Thông tư 48/2025/TT-BYT; Nghị định 15/2018 và văn bản liên quan | Nhóm sản phẩm, công bố/đăng ký, cơ sở sản xuất, quảng cáo, kiểm nghiệm, thủ tục và nhiệm vụ được phân cấp |
| Nông nghiệp và môi trường | Nghị định 131/2025/NĐ-CP; Nghị định 136/2025/NĐ-CP; Thông tư chuyên ngành; TT17/2024 và văn bản còn hiệu lực | Sản xuất ban đầu, trồng trọt, chăn nuôi, nuôi trồng/khai thác, giết mổ, sơ chế/chế biến nông lâm thủy sản, kiểm tra/chứng nhận |
| Công thương | Nghị định 146/2025/NĐ-CP và văn bản hướng dẫn | Hoạt động sản xuất, kinh doanh thực phẩm thuộc phạm vi phân công ngành công thương; quản lý thị trường và các nhiệm vụ được phân cấp |
| Địa phương | Quyết định chức năng Sở; quyết định phân cấp/ủy quyền; công bố TTHC; quy chế phối hợp | Cơ quan tiếp nhận, thẩm định, cấp, kiểm tra, hậu kiểm và xử lý theo từng thủ tục/địa bàn |

**Không được áp dụng Nghị quyết 19/2025/NQ-HĐND của TP.HCM như quy định tổ chức bộ máy của tỉnh Phú Thọ.** Phải lập một cấu hình địa phương riêng cho Phú Thọ từ các văn bản địa phương còn hiệu lực.

### 6.2 Cấu hình địa phương Phú Thọ

Các trường cần thu thập và duyệt:
- Quyết định quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Sở Nông nghiệp và Môi trường tỉnh Phú Thọ;
- Quyết định chức năng, nhiệm vụ của các chi cục/đơn vị chuyên môn liên quan;
- Quy định nhiệm vụ cơ quan chuyên môn cấp xã trong lĩnh vực nông nghiệp, y tế, công thương;
- Quyết định phân cấp/ủy quyền theo từng nhóm thủ tục;
- Danh mục thủ tục hành chính và quy trình nội bộ được công bố;
- Quyết định giao cơ quan giải quyết, người ký, thời hạn, phí/lệ phí và biểu mẫu;
- Văn bản chuyển tiếp và xử lý hồ sơ khi tổ chức bộ máy thay đổi.

Khi chưa có đủ văn bản, kết quả cơ quan có thẩm quyền phải là `authority_unknown` hoặc `pending_local_instrument`; không suy ra thẩm quyền chỉ từ tên đơn vị.

## 7. Quy trình xác định văn bản áp dụng

1. Chốt ngày cần xác định pháp luật áp dụng: ngày nộp hồ sơ, ngày phát sinh hành vi, ngày kiểm tra hoặc ngày ra quyết định.
2. Xác định chủ thể, loại cơ sở, địa điểm và địa bàn.
3. Xác định sản phẩm, thành phần, trạng thái và nguồn gốc.
4. Xác định hoạt động thực tế và công đoạn; tách công đoạn thuê ngoài.
5. Xác định loại yêu cầu: điều kiện cơ sở, công bố/đăng ký sản phẩm, kiểm tra nhà nước, chứng nhận, quảng cáo, ghi nhãn, truy xuất, xử lý vi phạm...
6. Truy xuất văn bản cấp luật và văn bản hướng dẫn theo đúng lĩnh vực.
7. Kiểm tra trạng thái văn bản tại ngày cần áp dụng, gồm sửa đổi, bãi bỏ, thay thế, tạm ngưng và chuyển tiếp.
8. Xác định điều khoản cụ thể, chủ thể, sản phẩm, hoạt động và ngoại lệ.
9. Xác định cơ quan có thẩm quyền trung ương/địa phương và căn cứ phân cấp/ủy quyền.
10. Xác định hồ sơ, chứng cứ và điều kiện cần kiểm tra.
11. Chuyển chuyên viên pháp lý/người được phân công duyệt quy tắc mới hoặc thay đổi.
12. Chỉ sau khi duyệt mới phát hành phiên bản quy tắc dùng trong đánh giá tự động.

Nếu một trong các bước 1–9 chưa rõ, không được tự động kết luận nghĩa vụ hoặc cơ quan có thẩm quyền.

## 8. Quy tắc chuyển tiếp và xử lý hồ sơ

Bản ghi phải hỗ trợ tối thiểu:
- Hồ sơ nộp trước ngày văn bản mới có hiệu lực;
- Hồ sơ nộp trong khoảng thời gian văn bản bị tạm ngưng;
- Hồ sơ nộp sau khi văn bản có hiệu lực trở lại hoặc có văn bản thay thế;
- Hoạt động phát sinh trước ngày thay đổi nhưng được kiểm tra sau ngày thay đổi;
- Giấy chứng nhận đã cấp theo văn bản cũ còn thời hạn;
- Điều khoản cũ bị thay thế một phần;
- Cơ quan giải quyết thủ tục thay đổi do phân cấp/sắp xếp bộ máy.

Không tự động chuyển hồ sơ cũ sang quy định mới chỉ vì ngày thẩm định mới hơn ngày hiệu lực. Phải đọc điều khoản chuyển tiếp của văn bản liên quan và xác định sự kiện pháp lý làm mốc.

## 9. Kiểm soát rủi ro pháp lý

| Mã | Rủi ro | Kiểm soát bắt buộc |
|---|---|---|
| LAR01 | Dùng văn bản đã bị tạm ngưng | Kiểm tra chuỗi trạng thái và ngày áp dụng |
| LAR02 | Dùng dự thảo như luật có hiệu lực | Loại nguồn `draft` không được kích hoạt quy tắc |
| LAR03 | Dùng văn bản hợp nhất như văn bản ban hành mới | Lưu quan hệ với văn bản gốc và sửa đổi |
| LAR04 | Chỉ kiểm tra hiệu lực văn bản, không kiểm tra điều khoản | Quản lý trạng thái ở cấp điều/khoản/điểm |
| LAR05 | Áp dụng quy định của địa phương khác | Bắt buộc khớp địa bàn |
| LAR06 | Gán thẩm quyền theo tên ngành/sản phẩm | Kiểm tra thủ tục, hoạt động và văn bản phân cấp |
| LAR07 | Bỏ sót quy định chuyển tiếp | Kiểm tra mốc sự kiện pháp lý |
| LAR08 | Trích dẫn sai điều/khoản hoặc sai phiên bản | Lưu bản gốc, trích đoạn, mã băm và vị trí |
| LAR09 | Văn bản sửa đổi nhưng quy tắc cũ vẫn chạy | Cơ chế phụ thuộc và vô hiệu hóa phiên bản quy tắc |
| LAR10 | Dùng văn bản chuyên ngành ngoài phạm vi | Kiểm tra sản phẩm, hoạt động, thị trường và chủ thể |
| LAR11 | Tự suy diễn nghĩa vụ từ tin tức/tóm tắt | Chỉ dùng văn bản quy phạm và nguồn chính thức |
| LAR12 | Xác định sai cơ quan ký/quyết định | Tách cơ quan tiếp nhận, thẩm định, cấp, kiểm tra và người có thẩm quyền |

## 10. Trạng thái kiểm tra quy tắc pháp lý

Mỗi tiêu chí pháp lý có trạng thái riêng:
- `checked_no_issue`: đã kiểm tra trong phạm vi, không phát hiện sai lệch;
- `checked_issue`: đã kiểm tra, có sai lệch;
- `not_verifiable`: thiếu dữ liệu/căn cứ;
- `not_processed`: chưa xử lý;
- `not_applicable`: không áp dụng, có căn cứ;
- `scope_unknown`: chưa xác định được phạm vi;
- `pending_legal_review`: chờ người có chuyên môn pháp lý duyệt.

Không dùng kết quả AI để thay thế quyết định của cơ quan hoặc người có thẩm quyền.

## 11. Ưu tiên hoàn thiện tiếp theo

### P0 — Khóa trạng thái văn bản
1. Hoàn thiện bản ghi Luật 55/2010/QH12 và Nghị định 15/2018/NĐ-CP, bao gồm lịch sử sửa đổi, văn bản liên quan và điều khoản chuyển tiếp.
2. Lập đầy đủ quan hệ Nghị quyết 15/2026 ↔ Nghị định 46/2026 ↔ Nghị quyết 66.13/2026.
3. Theo dõi tiến trình dự án Luật ATTP sửa đổi và nghị định hướng dẫn; chỉ cập nhật khi có văn bản chính thức.
4. Xác minh trạng thái hiện hành của từng thông tư, quy chuẩn, quyết định chuyên ngành.

### P1 — Ma trận điều khoản và thẩm quyền
5. Bóc điều/khoản/điểm của Nghị định 131, 136, 146, 148 và Thông tư 48/2025/TT-BYT.
6. Bóc từng điều khoản TT17/2024 và các thông tư nền; xác định chính xác phần còn hiệu lực/bị thay thế/bị bãi bỏ.
7. Hoàn thiện cấu hình địa phương Phú Thọ từ nguồn địa phương chính thức.
8. Ánh xạ thủ tục hành chính đến cơ quan tiếp nhận, thẩm định, cấp và kiểm tra.

### P2 — Sinh quy tắc và kiểm thử
9. Tạo rule theo từng tổ hợp chủ thể × địa điểm × hoạt động × sản phẩm × thời điểm.
10. Kiểm thử hồ sơ trước/sau mốc thay đổi văn bản và trường hợp chuyển tiếp.
11. Kiểm thử trường hợp nhiều ngành, nhiều hoạt động, nhiều địa điểm và thuê ngoài.
12. Có người rà soát pháp lý và người phê duyệt trước khi kích hoạt quy tắc.

## 12. Tiêu chí nghiệm thu

1. Mọi văn bản có nguồn chính thức, bản lưu và metadata.
2. Trạng thái được tính theo thời điểm, không dùng cờ hiệu lực đơn giản.
3. Quan hệ sửa đổi, thay thế, bãi bỏ, tạm ngưng và chuyển tiếp được lưu đầy đủ.
4. Có trạng thái riêng cho văn bản và từng điều khoản.
5. Dự thảo không thể sinh nghĩa vụ pháp lý.
6. Văn bản tạm ngưng không thể kích hoạt quy tắc.
7. Điều khoản địa phương chỉ áp dụng đúng địa bàn.
8. Thẩm quyền được xác định theo quy định và thủ tục cụ thể.
9. Mỗi quy tắc có trích dẫn nguyên văn, nguồn, điều kiện, ngoại lệ và chứng cứ.
10. Có lịch sử phiên bản và người duyệt.
11. Có cơ chế rà soát lại khi văn bản thay đổi.
12. Thiếu căn cứ phải trả về “CHƯA ĐỦ CĂN CỨ XÁC ĐỊNH”.

## 13. Giới hạn của bản dự thảo này

- Chưa bóc tách toàn bộ điều/khoản/điểm của các văn bản liệt kê.
- Chưa xác minh toàn bộ lịch sử sửa đổi, bãi bỏ và văn bản hợp nhất của từng văn bản.
- Chưa hoàn thành ma trận thẩm quyền riêng của tỉnh Phú Thọ.
- Chưa ánh xạ đầy đủ từng thủ tục hành chính và quy trình nội bộ.
- Chưa có quy tắc pháp lý nào trong tài liệu này được phê duyệt để tự động đưa ra kết luận chính thức.
- Danh mục hạt giống không phải danh mục pháp luật đầy đủ.

## 14. Tài liệu liên quan

- `00_DOCUGUARD_MASTER_SPEC.md`
- `01_BUSINESS_DOMAIN_MAP.md`
- `02_LEGAL_SCIENCE_KNOWLEDGE.md`
- `05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md`
- `06_PRODUCT_DATA_DICTIONARY.md`
- `07_ACTIVITY_DATA_DICTIONARY.md`

Tài liệu tiếp theo: `09_SCIENCE_TECHNICAL_REFERENCE_MATRIX.md`. Phần khoa học/kỹ thuật phải quản lý nguồn, điều kiện áp dụng, phương pháp đo, đơn vị, sai số và giới hạn; tuyệt đối không biến giá trị tham khảo thành ngưỡng pháp lý.
