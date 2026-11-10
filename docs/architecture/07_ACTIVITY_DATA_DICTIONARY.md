# DOCUGUARD AI — TỪ ĐIỂN DỮ LIỆU HOẠT ĐỘNG

**Mã tài liệu:** DG-ARCH-07  
**Phiên bản:** 2.2-draft  
**Ngày lập:** 10/11/2026  
**Trạng thái:** Đặc tả nghiệp vụ và dữ liệu; chưa phải danh mục điều kiện pháp lý, định mức kỹ thuật hoặc checklist được cơ quan có thẩm quyền phê duyệt.

## 1. Mục đích

Chuẩn hóa cách DocuGuard mô tả hoạt động thực tế của cơ sở trong chuỗi thực phẩm, từ sản xuất ban đầu đến kinh doanh và dịch vụ hỗ trợ. Mỗi hoạt động phải thể hiện được:
- Ai thực hiện, tại địa điểm nào, trong thời kỳ nào;
- Sản phẩm/nguyên liệu đầu vào và đầu ra;
- Quy trình, công đoạn, nguồn lực, thiết bị và nhân lực;
- Công suất thiết kế, công suất thực tế và cơ sở tính;
- Hồ sơ, dữ liệu vận hành và chứng cứ;
- Các điểm kiểm soát, nguy cơ và giới hạn xác minh;
- Mối liên kết với lô, nhà cung cấp, đơn vị thuê ngoài và khách hàng.

Mã HD01–HD20 kế thừa từ `05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md`; đây là mã nghiệp vụ nội bộ, không phải mã ngành hoặc mã thủ tục pháp lý.

## 2. Nguyên tắc mô hình hóa hoạt động

1. **Hoạt động là việc thực tế được thực hiện**, không chỉ là tên đăng ký hoặc tên gọi trên giấy tờ.
2. **Một cơ sở có nhiều hoạt động; một hoạt động có thể xử lý nhiều sản phẩm.** Quan hệ phải là nhiều-nhiều.
3. **Hoạt động gắn với địa điểm và thời kỳ.** Không gộp các địa điểm khác nhau chỉ vì cùng chủ thể.
4. **Phân biệt hoạt động trực tiếp và thuê ngoài.** Bên giao việc, bên nhận việc, địa điểm thực hiện và trách nhiệm phải được ghi nhận riêng.
5. **Phân biệt công suất thiết kế, công suất khai báo, công suất thực tế và sản lượng giao dịch.** Không dùng thay thế cho nhau.
6. **Định nghĩa rõ mẫu số và thời gian:** kg/giờ, kg/mẻ, con/lứa, tấn/vụ, lít/ngày... phải có cơ sở đo và thời kỳ.
7. **Không suy diễn công suất từ một thông số đơn lẻ.** Phải xét nút thắt của toàn quy trình, số ca, thời gian dừng, thiết bị dùng chung và điều kiện đầu vào.
8. **Không tự tạo định mức:** năng suất, mật độ, tỷ lệ sống, tỷ lệ thu hồi, thời gian chu kỳ, nhiệt độ, độ ẩm và thông số công nghệ cần nguồn phù hợp, điều kiện áp dụng và người duyệt.
9. **Chứng cứ phải chỉ ra điều nó chứng minh.** Hợp đồng không tự chứng minh đã giao hàng; danh mục thiết bị không tự chứng minh thiết bị đang hoạt động.
10. **Phát hiện bất thường không đồng nghĩa vi phạm/gian lận.** Hệ thống chỉ nêu chênh lệch, dữ liệu còn thiếu và việc cần xác minh.
11. **Không tuyên bố đã kiểm tra hiện trường** nếu không có người thực hiện và biên bản/ảnh/dữ liệu hợp lệ.
12. **Mọi cấu hình hoạt động phải có phiên bản**, thời gian hiệu lực và lịch sử thay đổi.

## 3. Mô hình dữ liệu hoạt động

### 3.1 Thực thể chính

| Thực thể | Nội dung |
|---|---|
| ActivityDefinition | Định nghĩa loại hoạt động HD01–HD20 |
| EstablishmentActivity | Hoạt động cụ thể do chủ thể thực hiện tại một địa điểm |
| ActivityPeriod | Thời kỳ hoạt động và trạng thái vận hành |
| ActivityProcess | Quy trình/các công đoạn thuộc hoạt động |
| ActivityInput | Nguyên liệu, vật tư, nước, năng lượng, dịch vụ đầu vào |
| ActivityOutput | Sản phẩm, bán thành phẩm, phụ phẩm, chất thải/đầu ra khác |
| Resource | Nhân lực, mặt bằng, thiết bị, phương tiện, kho |
| CapacityProfile | Hồ sơ năng lực và cách tính công suất |
| ActivityBatch | Mẻ, chuyến, vụ, lứa hoặc đơn vị vận hành phù hợp |
| ActivityEvidence | Tài liệu/chứng cứ liên quan đến hoạt động |
| OutsourcingLink | Quan hệ giao/nhận gia công hoặc thuê dịch vụ |
| ControlPoint | Điểm kiểm soát và thông số cần theo dõi |
| ActivityAssessment | Kết quả đánh giá theo phiên bản quy tắc |

### 3.2 Khóa logic của một hoạt động cụ thể

`Chủ thể + Cơ sở/địa điểm + Mã hoạt động + Sản phẩm/nhóm sản phẩm + Thời kỳ + Phiên bản mô tả`

Khi đánh giá pháp lý, bổ sung phiên bản quy tắc, địa bàn và thời điểm áp dụng. Khi đánh giá kỹ thuật, bổ sung phiên bản quy trình và nguồn tham chiếu.

## 4. Từ điển thuộc tính chung

| Mã | Trường | Kiểu | Bắt buộc | Quy tắc |
|---|---|---|---|---|
| activity_instance_id | Mã hoạt động cụ thể | UUID | Có | Duy nhất |
| activity_code | Mã loại hoạt động | Danh mục | Có | HD01–HD20 hoặc mã mới đã duyệt |
| activity_name_declared | Tên hoạt động kê khai | Văn bản | Có | Giữ nguyên nội dung nguồn |
| operator_entity_id | Chủ thể thực hiện | Tham chiếu | Có | Cá nhân/hộ/tổ chức/doanh nghiệp |
| establishment_id | Cơ sở/địa điểm | Tham chiếu | Có | Không dùng địa chỉ trụ sở thay địa điểm thực tế nếu khác |
| site_function | Chức năng địa điểm | Danh mục/văn bản | Có | Sản xuất, kho, sơ chế, chế biến, bán hàng, trung chuyển... |
| activity_mode | Cách thức thực hiện | Enum | Có | Trực tiếp, thuê ngoài, kết hợp, chưa rõ |
| product_variant_ids | Sản phẩm/biến thể | Danh sách tham chiếu | Có điều kiện | Gắn từng sản phẩm với vai trò đầu vào/đầu ra |
| activity_status | Trạng thái hoạt động | Enum | Có | Dự kiến, đang hoạt động, tạm dừng, đã chấm dứt, chưa xác minh |
| valid_from / valid_to | Thời kỳ | Ngày | Có | Không mặc định ngày kê khai là ngày bắt đầu thực tế |
| process_version_id | Phiên bản quy trình | Tham chiếu | Có điều kiện | Lưu lịch sử |
| input_items | Đầu vào | Danh sách cấu trúc | Có | Sản phẩm/vật tư, lượng, đơn vị, nguồn, lô |
| output_items | Đầu ra | Danh sách cấu trúc | Có | Sản phẩm/phụ phẩm, lượng, đơn vị, lô |
| resource_ids | Nguồn lực | Danh sách tham chiếu | Có điều kiện | Nhân lực, thiết bị, mặt bằng, phương tiện |
| capacity_profile_id | Hồ sơ công suất | Tham chiếu | Có điều kiện | Phải nêu công thức và dữ liệu nguồn |
| operating_schedule | Lịch vận hành | Cấu trúc | Có điều kiện | Ca, giờ/ngày, ngày/tháng, mùa vụ |
| batch_or_cycle | Mẻ/lứa/vụ/chuyến | Cấu trúc | Có điều kiện | Chọn đơn vị vận hành phù hợp |
| control_points | Điểm kiểm soát | Danh sách | Có điều kiện | Gắn nguồn và phương pháp đo |
| evidence_ids | Chứng cứ | Danh sách tham chiếu | Có | Mỗi chứng cứ có phạm vi chứng minh |
| outsourcing_links | Quan hệ thuê ngoài | Danh sách tham chiếu | Có điều kiện | Bên giao, bên nhận, công đoạn, địa điểm |
| actual_observation | Dữ liệu thực tế | Cấu trúc | Không | Chỉ ghi dữ liệu đã quan sát/được cung cấp |
| data_gaps | Dữ liệu còn thiếu | Danh sách | Có | Tự động tổng hợp, không được ẩn |
| record_version | Phiên bản bản ghi | Số/chuỗi | Có | Không ghi đè lịch sử |
| reviewer_status | Trạng thái rà soát | Enum | Có | Nháp, chờ rà soát, đã duyệt trong phạm vi, bị từ chối |

## 5. Chuẩn mô tả công suất và năng lực

### 5.1 Bốn khái niệm phải tách biệt

- **Công suất thiết kế:** thông số theo thiết kế/nhà sản xuất/hồ sơ kỹ thuật; phải xác định điều kiện và cấu hình thiết kế.
- **Công suất kê khai:** số liệu do chủ thể khai báo; là dữ liệu đầu vào, chưa mặc nhiên được xác minh.
- **Công suất vận hành thực tế:** sản lượng/khối lượng xử lý được ghi nhận trong một khoảng thời gian xác định.
- **Sản lượng giao dịch:** khối lượng mua, bán, giao nhận hoặc xuất hóa đơn; có thể gồm hàng thu mua, không chỉ hàng cơ sở tự sản xuất.

### 5.2 Trường bắt buộc của một chỉ tiêu công suất

- Đại lượng đo và đơn vị;
- Giá trị và nguồn số liệu;
- Mẫu số thời gian hoặc đơn vị chu kỳ;
- Số ca/ngày, giờ/ca, ngày hoạt động;
- Thiết bị/công đoạn tạo ra giới hạn công suất;
- Điều kiện đầu vào và điều kiện vận hành;
- Thiết bị dùng chung, thời gian vệ sinh/chuyển đổi/dừng máy;
- Phương pháp tính;
- Khoảng thời gian tham chiếu;
- Người xác nhận và chứng cứ.

### 5.3 Phân tích nút thắt

Với quy trình nhiều công đoạn, công suất toàn tuyến không được lấy bằng cách cộng công suất các công đoạn. Phải xác định đơn vị quy đổi tương đương và công đoạn giới hạn. Nếu các công đoạn dùng đơn vị khác nhau, có hao hụt, chuyển trạng thái hoặc thời gian chờ, cần mô hình hóa hệ số chuyển đổi có căn cứ.

Nếu thiếu thông số để tính công suất toàn tuyến, kết quả là “CHƯA ĐỦ CĂN CỨ XÁC ĐỊNH”, không tự chọn giá trị nhỏ nhất hoặc lớn nhất một cách máy móc.

## 6. Từ điển thuộc tính theo hoạt động HD01–HD20

### 6.1 HD01 — Trồng trọt
**Đầu vào:** thửa/vùng trồng; diện tích và diện tích thực canh; loài/giống; nguồn giống; đất/giá thể; nước; phân bón, thuốc bảo vệ thực vật và vật tư khác; lao động; máy móc.  
**Quy trình:** chuẩn bị đất/giá thể → gieo/trồng → chăm sóc → sử dụng vật tư → thu hoạch → phân loại/sơ chế tại chỗ nếu có.  
**Năng lực:** diện tích theo từng cây/vụ; số vụ; lịch mùa vụ; sản lượng theo kỳ; lao động và thiết bị; công suất thu hoạch/sơ chế.  
**Đầu ra:** sản phẩm thu hoạch; loại bỏ; phụ phẩm; khối lượng đưa đi sơ chế/bán; mã lô/vùng trồng.  
**Chứng cứ:** hồ sơ đất/địa điểm khi liên quan; nhật ký sản xuất; hồ sơ giống/vật tư; nhật ký thu hoạch; phiếu cân; giao nhận; dữ liệu vùng trồng.  
**Kiểm tra:** trùng diện tích; thời gian sinh trưởng không phù hợp dữ liệu kê khai; sản lượng thiếu kỳ; vật tư không liên kết lô; chênh lệch giữa thu hoạch và lượng bán. Chỉ cảnh báo để xác minh, không tự kết luận sai phạm.

### 6.2 HD02 — Chăn nuôi
**Đầu vào:** loài/giống; nguồn con giống; số lượng nhập; chuồng trại; diện tích; thức ăn; nước; thuốc thú y/vắc xin; nhân lực; thiết bị.  
**Quy trình:** nhập đàn → nuôi dưỡng/chăm sóc → theo dõi sức khỏe → xuất bán/chuyển đàn/chết loại → vệ sinh chuồng trại.  
**Năng lực:** sức chứa theo cấu hình chuồng; số lứa/năm; thời gian nuôi; số lượng đầu kỳ/nhập/xuất/cuối kỳ; công suất cung cấp thức ăn/nước và xử lý chất thải.  
**Đầu ra:** vật nuôi xuất bán; sản phẩm phụ; hao hụt/chết loại; chất thải và dòng xử lý.  
**Chứng cứ:** hồ sơ đàn; chứng từ con giống/thức ăn; nhật ký chăm sóc và thú y; hồ sơ xuất bán; chứng từ vận chuyển.  
**Kiểm tra:** cân đối đàn; trùng mã/lô; thời gian nuôi và lịch xuất; lượng thức ăn/đầu vào; công suất chuồng. Không áp một mật độ hoặc tỷ lệ sống chung cho mọi loài, lứa và hệ thống nuôi.

### 6.3 HD03 — Nuôi trồng thủy sản
**Đầu vào:** loài nuôi; nguồn giống; ao/lồng/bể; diện tích/thể tích; nước; thức ăn; thuốc/hóa chất; thiết bị sục khí/bơm; nhân lực.  
**Quy trình:** chuẩn bị cơ sở nuôi → thả giống → chăm sóc/quản lý môi trường → thu hoạch → phân loại/bảo quản.  
**Năng lực:** diện tích/thể tích sử dụng; số ao/lồng; số vụ; thời gian nuôi; số lượng thả/thu; công suất thiết bị.  
**Đầu ra:** thủy sản thu hoạch; hao hụt; phụ phẩm; nước thải/bùn thải theo dữ liệu có.  
**Chứng cứ:** nhật ký thả nuôi; nguồn giống; nhật ký thức ăn/vật tư; nhật ký môi trường; phiếu cân; giao nhận.  
**Kiểm tra:** cân đối số lượng thả/thu; chu kỳ; công suất thiết bị; nguồn gốc lô. Không suy ra sản lượng hợp lý nếu thiếu loài, phương thức, thời kỳ và điều kiện môi trường.

### 6.4 HD04 — Khai thác thủy sản
**Đầu vào:** chủ thể; phương tiện; ngư cụ/nghề; chuyến khai thác; vùng/thời gian; nhiên liệu; đá/nước và vật tư bảo quản.  
**Quy trình:** chuẩn bị chuyến → khai thác → phân loại → bảo quản trên phương tiện → cập cảng/bàn giao.  
**Năng lực:** thông số phương tiện; số chuyến; thời gian chuyến; khả năng bảo quản; sản lượng ghi nhận theo chuyến.  
**Đầu ra:** sản phẩm khai thác theo loài/lô; phụ phẩm; sản phẩm loại bỏ.  
**Chứng cứ:** hồ sơ phương tiện/chuyến; nhật ký khai thác; phiếu cân/cảng cá; giao nhận; dữ liệu bảo quản.  
**Kiểm tra:** tính liên tục chuyến; thời gian/vùng khai thác; sản lượng theo chuyến; liên kết lô. Không tự kết luận hợp pháp/không hợp pháp của hoạt động khai thác chỉ từ một trường dữ liệu.

### 6.5 HD05 — Thu hoạch/đánh bắt
**Đầu vào:** vùng/đối tượng thu hoạch; sản phẩm; thời điểm; phương pháp; nhân lực; dụng cụ; vật tư bảo quản.  
**Quy trình:** xác định điểm thu hoạch → thu hoạch/đánh bắt → phân loại → cân/ghi nhận → bảo quản/giao nhận.  
**Năng lực:** diện tích/phạm vi thu hoạch; nhân lực; dụng cụ; thời gian; khối lượng theo đợt.  
**Đầu ra:** lô sản phẩm thu hoạch; sản phẩm loại bỏ; phụ phẩm; khối lượng chuyển công đoạn.  
**Chứng cứ:** nhật ký; phiếu cân; mã lô; biên bản thu hoạch; giao nhận.  
**Kiểm tra:** trùng lô; ngày/giờ; sản lượng và diện tích/đối tượng; thời gian đến bảo quản; không đồng nhất thu hoạch với hoạt động sản xuất ban đầu.

### 6.6 HD06 — Giết mổ
**Đầu vào:** động vật sống; nguồn cung; hồ sơ nhận diện lô; khu vực/line; nhân lực; thiết bị; nước; vật tư vệ sinh; phương tiện vận chuyển.  
**Quy trình:** tiếp nhận → kiểm tra theo quy trình áp dụng → lưu giữ/chờ → giết mổ → xử lý thân thịt/phụ phẩm → kiểm soát và bàn giao.  
**Năng lực:** số lượng/khối lượng theo ca hoặc ngày; dây chuyền; thời gian hoạt động; công suất từng công đoạn; năng lực làm mát/lưu giữ.  
**Đầu ra:** thân thịt/sản phẩm thịt; phụ phẩm; sản phẩm loại bỏ; chất thải.  
**Chứng cứ:** nguồn động vật; phiếu tiếp nhận; hồ sơ kiểm soát thú y theo phạm vi; nhật ký ca; phiếu cân; vệ sinh; giao nhận.  
**Kiểm tra:** cân đối số lượng động vật vào và sản phẩm/phụ phẩm ra; thời gian vận hành; tách lô; đối chiếu công suất dây chuyền. Không tự kết luận đạt yêu cầu kiểm soát thú y nếu thiếu hồ sơ có thẩm quyền.

### 6.7 HD07 — Thu gom/tập kết
**Đầu vào:** nhà cung cấp; nguồn hàng; sản phẩm; địa điểm tập kết; phương tiện; nhân lực; bao bì/thùng chứa.  
**Quy trình:** tiếp nhận → kiểm tra thông tin → cân/đếm → phân lô → lưu giữ ngắn hạn → xuất chuyển.  
**Năng lực:** diện tích/dung tích điểm tập kết; công suất tiếp nhận; thời gian lưu; số lượt xe/ngày; năng lực phân loại.  
**Đầu ra:** lô hàng nhập/tập kết; lô hàng xuất; hàng loại bỏ/hoàn trả.  
**Chứng cứ:** phiếu nhập/xuất; cân; nhà cung cấp; giao nhận; nhật ký kho; dữ liệu lô.  
**Kiểm tra:** nguồn hàng không rõ; lô bị gộp; tồn kho âm; thời gian lưu không khớp; khối lượng nhập/xuất. Không coi địa điểm tập kết là cơ sở sản xuất nếu không có hoạt động đó.

### 6.8 HD08 — Thu mua
**Đầu vào:** nhà cung cấp; sản phẩm; hợp đồng/đơn hàng; giá và số lượng; địa điểm giao; tiêu chí nhận hàng.  
**Quy trình:** đặt mua → xác nhận nguồn → nhận hàng → cân/kiểm tra → lập chứng từ → nhập kho/chuyển thẳng.  
**Năng lực:** lượng mua theo kỳ; khả năng tiếp nhận; vốn/đơn hàng không tự chứng minh năng lực bảo quản.  
**Đầu ra:** hàng mua; hàng trả lại; chênh lệch cân/đếm; dữ liệu công nợ/giao nhận nếu được cung cấp.  
**Chứng cứ:** hợp đồng; hóa đơn; phiếu cân; phiếu giao nhận; chứng từ thanh toán; hồ sơ nhà cung cấp.  
**Kiểm tra:** trùng hóa đơn/phiếu; một lô bán nhiều lần; lượng mua không khớp nhập kho; ngày tháng bất hợp lý. Hợp đồng riêng lẻ không chứng minh giao dịch đã thực hiện.

### 6.9 HD09 — Sơ chế
**Đầu vào:** nguyên liệu/lô; nước; vật tư; bao bì; thiết bị; nhân lực; khu vực sơ chế.  
**Quy trình:** tiếp nhận → phân loại → rửa/làm sạch → cắt/gọt/pha lóc → để ráo/làm mát → đóng gói hoặc chuyển công đoạn.  
**Năng lực:** kg/giờ hoặc kg/mẻ theo từng công đoạn; số bàn/line; thiết bị; thời gian vệ sinh/chuyển đổi; kho đầu vào/đầu ra.  
**Đầu ra:** sản phẩm sơ chế; phần loại bỏ; phụ phẩm; nước thải; hao hụt.  
**Chứng cứ:** quy trình; nhật ký; thiết bị; phiếu cân đầu vào/đầu ra; hồ sơ vệ sinh; lô.  
**Kiểm tra:** cân đối khối lượng; nước và bề mặt tiếp xúc; phân luồng sống/chín khi liên quan; thời gian chờ; điều kiện bảo quản sau sơ chế.

### 6.10 HD10 — Chế biến
**Đầu vào:** nguyên liệu; thành phần; phụ gia/chất hỗ trợ nếu có; bao bì; nước/năng lượng; thiết bị; nhân lực.  
**Quy trình:** tiếp nhận → chuẩn bị → định lượng → xử lý công nghệ → làm nguội/ổn định → đóng gói → bảo quản. Cấu hình thực tế tùy sản phẩm.  
**Năng lực:** kg/mẻ, mẻ/ca, sản lượng/ca; công suất từng thiết bị; thời gian chu trình; nút thắt dây chuyền.  
**Đầu ra:** thành phẩm; bán thành phẩm; phụ phẩm; phế phẩm; hao hụt.  
**Chứng cứ:** công thức; quy trình; nhật ký mẻ; thông số thiết bị; kiểm soát công đoạn; phiếu cân; nhãn; kết quả kiểm nghiệm khi có.  
**Kiểm tra:** phiên bản công thức; tổng định lượng; thông số thời gian/nhiệt độ; cân đối nguyên liệu – thành phẩm; truy xuất lô; không tự xác nhận hiệu lực quy trình nếu chưa có phương pháp/chứng cứ phù hợp.

### 6.11 HD11 — Phối trộn/công thức
**Đầu vào:** danh sách thành phần; lô nguyên liệu; định lượng; thiết bị cân/đong; công thức phiên bản.  
**Quy trình:** cấp phát → cân/đong → phối trộn → kiểm tra đồng nhất → chuyển công đoạn.  
**Năng lực:** kg/mẻ; số mẻ; thời gian trộn; dung tích thiết bị; độ chính xác thiết bị định lượng.  
**Đầu ra:** hỗn hợp/bán thành phẩm; phần dư; phần loại bỏ.  
**Chứng cứ:** công thức; phiếu cân; lệnh sản xuất; nhật ký mẻ; hiệu chuẩn/kiểm tra thiết bị nếu áp dụng.  
**Kiểm tra:** tổng tỷ lệ; sai lệch cân; lô thành phần; thay đổi công thức; thành phần không truy xuất được. Không suy ra công thức bí mật hoặc thành phần không thể hiện trong tài liệu.

### 6.12 HD12 — Đóng gói/bao gói
**Đầu vào:** sản phẩm; bao bì tiếp xúc; bao bì ngoài; nhãn; mã lô; thiết bị đóng gói.  
**Quy trình:** cấp sản phẩm → chuẩn bị bao bì → định lượng → đóng kín → in/ghi mã → kiểm tra → nhập kho.  
**Năng lực:** đơn vị/giờ; khối lượng/giờ; số line; tốc độ và thời gian dừng; quy cách sản phẩm.  
**Đầu ra:** đơn vị bao gói; bao bì lỗi; sản phẩm rơi vãi/loại bỏ.  
**Chứng cứ:** quy cách bao bì; hồ sơ nhà cung cấp; mẫu nhãn; nhật ký đóng gói; mã lô; phiếu cân.  
**Kiểm tra:** khớp sản phẩm – nhãn – khối lượng; truy xuất lô; bao bì tiếp xúc; số lượng bao gói và lượng sản phẩm cấp vào.

### 6.13 HD13 — Bảo quản/lưu kho
**Đầu vào:** sản phẩm/lô; kho; kệ/pallet; thiết bị đo; hệ thống làm mát/làm lạnh nếu có; nhân lực.  
**Quy trình:** tiếp nhận → phân khu → xếp kho → theo dõi điều kiện → xuất kho → vệ sinh.  
**Năng lực:** dung tích hữu dụng; tải trọng; diện tích; số vị trí; tốc độ nhập/xuất; công suất thiết bị; điều kiện vận hành.  
**Đầu ra:** tồn kho theo lô; hàng xuất; hàng hư hỏng/loại bỏ; chênh lệch kiểm kê.  
**Chứng cứ:** sơ đồ kho; sổ kho; nhật ký nhiệt độ/độ ẩm; thiết bị đo; phiếu nhập/xuất; kiểm kê.  
**Kiểm tra:** tồn âm; lô quá hạn theo dữ liệu có căn cứ; điều kiện đo; hàng sống/chín hoặc hàng tương kỵ lưu chung khi có rủi ro; sức chứa thực tế. Không suy ra điều kiện đạt chỉ từ việc có thiết bị lạnh.

### 6.14 HD14 — Vận chuyển
**Đầu vào:** sản phẩm/lô; phương tiện; tải trọng; thùng/khoang; thiết bị đo; tuyến đường; thời gian; đơn vị vận tải.  
**Quy trình:** nhận hàng → kiểm tra phương tiện → xếp hàng → vận chuyển → giao nhận → xử lý sai lệch.  
**Năng lực:** tải trọng hữu ích; thể tích; số chuyến; thời gian tuyến; điều kiện bảo quản; khả năng vệ sinh.  
**Đầu ra:** lô giao nhận; chứng từ giao hàng; hàng trả lại/hư hỏng nếu có.  
**Chứng cứ:** hồ sơ phương tiện; lệnh điều xe; nhật ký hành trình; nhiệt độ (nếu áp dụng); phiếu giao nhận; hóa đơn vận tải.  
**Kiểm tra:** tải trọng; thời gian; điều kiện vận chuyển; lô giao nhận; chênh lệch lượng đi/đến. Không coi đăng ký phương tiện là chứng minh phương tiện đáp ứng mọi điều kiện của từng loại hàng.

### 6.15 HD15 — Trung chuyển
**Đầu vào:** lô hàng; điểm trung chuyển; phương tiện đến/đi; khu vực lưu tạm; thiết bị bốc xếp; nhân lực.  
**Quy trình:** tiếp nhận → dỡ/chuyển tải → lưu tạm → phân tuyến → xếp lại → bàn giao.  
**Năng lực:** lượng hàng/giờ; diện tích/dung tích lưu tạm; số cửa xuất nhập; thời gian lưu; năng lực duy trì điều kiện bảo quản.  
**Đầu ra:** lô chuyển tiếp; hàng sai lệch/loại bỏ; thời gian và chứng từ bàn giao.  
**Chứng cứ:** phiếu nhập/xuất; mã lô; nhật ký thời gian; hồ sơ phương tiện; dữ liệu bảo quản.  
**Kiểm tra:** thời gian lưu; mất liên kết lô; trộn lẫn; chênh lệch lượng; gián đoạn điều kiện bảo quản.

### 6.16 HD16 — Phân phối/bán buôn
**Đầu vào:** nguồn hàng; nhà cung cấp; hợp đồng/đơn hàng; kho; phương tiện; khách hàng.  
**Quy trình:** đặt hàng → nhận hàng → lưu kho → soạn hàng → xuất bán → giao nhận.  
**Năng lực:** lượng nhập/xuất; dung tích kho; số đơn/ca; khả năng giao nhận; tỷ lệ hàng tự sản xuất và thu mua.  
**Đầu ra:** hàng bán; tồn kho; hàng trả lại; hàng hư hỏng/loại bỏ.  
**Chứng cứ:** hóa đơn; phiếu nhập/xuất; đơn hàng; phiếu giao nhận; sổ kho; dữ liệu nhà cung cấp/khách hàng.  
**Kiểm tra:** hàng bán vượt nguồn có thể giải trình; tồn kho; trùng hóa đơn; nguồn tự sản xuất bị gộp với thu mua; không tự kết luận gian lận từ chênh lệch đơn lẻ.

### 6.17 HD17 — Bán lẻ
**Đầu vào:** hàng hóa; nguồn cung; địa điểm bán; quầy/kệ/tủ; thiết bị bảo quản; nhân viên.  
**Quy trình:** nhận hàng → kiểm tra → trưng bày/lưu giữ → bán → xử lý hàng trả lại/hết hạn/hư hỏng.  
**Năng lực:** sức chứa; diện tích trưng bày; lượng bán/ngày; số điểm bán; điều kiện bảo quản.  
**Đầu ra:** hàng bán; tồn; hàng hủy/trả; dữ liệu lô và khách hàng theo phạm vi có.  
**Chứng cứ:** hóa đơn mua; phiếu nhập; sổ bán hàng; nhãn; nhật ký bảo quản; kiểm kê.  
**Kiểm tra:** nguồn hàng; tình trạng bao gói/nhãn; điều kiện trưng bày; lô; thời hạn; không mặc định mọi cơ sở bán lẻ có cùng nghĩa vụ pháp lý.

### 6.18 HD18 — Kinh doanh trực tuyến
**Đầu vào:** chủ thể bán; nền tảng/kênh bán; danh mục sản phẩm; nguồn hàng; địa điểm lưu hàng; đơn vị giao nhận.  
**Quy trình:** đăng sản phẩm → tiếp nhận đơn → xác nhận tồn/nguồn → đóng gói → giao hàng → xử lý đổi trả/khiếu nại.  
**Năng lực:** lượng đơn; năng lực kho/đóng gói; khả năng giao hàng; nguồn cung; địa điểm thực hiện các công đoạn.  
**Đầu ra:** đơn hàng; hàng giao; hàng hoàn; thông tin truy xuất và phản hồi.  
**Chứng cứ:** dữ liệu gian hàng/đơn hàng; hóa đơn; phiếu kho; thông tin sản phẩm/nhãn; giao nhận; hợp đồng nền tảng/dịch vụ nếu liên quan.  
**Kiểm tra:** phân biệt chủ thể bán và nền tảng; địa điểm thực tế lưu hàng; nguồn hàng; nội dung công bố; đơn hàng và lượng xuất. Không suy ra địa điểm sản xuất từ địa chỉ gian hàng.

### 6.19 HD19 — Gia công/thuê ngoài
**Đầu vào:** bên giao việc; bên nhận; sản phẩm/lô; công đoạn thuê; nguyên liệu/bao bì; quy cách; tiêu chuẩn kỹ thuật; trách nhiệm các bên.  
**Quy trình:** thỏa thuận → bàn giao đầu vào → thực hiện công đoạn → kiểm tra/bàn giao → xử lý sai lệch.  
**Năng lực:** năng lực bên nhận; công suất được phân bổ; lịch sản xuất; thiết bị; thời gian; khả năng truy xuất riêng lô.  
**Đầu ra:** sản phẩm sau gia công; phế phẩm/hao hụt; hồ sơ bàn giao và xác nhận.  
**Chứng cứ:** hợp đồng gia công; phụ lục quy cách; phiếu giao nhận; lệnh sản xuất; nhật ký mẻ; biên bản nghiệm thu; hóa đơn dịch vụ.  
**Kiểm tra:** công đoạn và địa điểm thực tế; quyền kiểm soát; lô trước/sau; trách nhiệm chất lượng; không gán hoạt động của bên nhận thành hoạt động thực hiện tại cơ sở bên giao.

### 6.20 HD20 — Dịch vụ hỗ trợ khác
Chỉ tạo cấu hình HD20 khi mô tả rõ dịch vụ, vai trò trong chuỗi thực phẩm và cơ sở xác định phạm vi quản lý. Không dùng HD20 như một “rổ chứa” để né phân loại hoạt động cụ thể.

**Trường cần bổ sung:** loại dịch vụ; bên cung cấp/nhận; sản phẩm/lô có tiếp xúc; địa điểm; quy trình; nhân lực; thiết bị; công suất; đầu vào/đầu ra; trách nhiệm; chứng cứ; quy tắc pháp lý được duyệt.  
**Điều kiện kích hoạt:** người quản trị nghiệp vụ phải duyệt mô tả, phạm vi và bộ tiêu chí; nếu chưa rõ thì trạng thái `scope_unknown`, không tự sinh checklist pháp lý.

## 7. Bộ hồ sơ nguồn lực

### 7.1 Nhân lực
- Mã người/vị trí (hạn chế dữ liệu cá nhân, chỉ thu thập trường cần thiết);
- Vai trò trong hoạt động;
- Số lượng theo ca;
- Năng lực/chuyên môn/đào tạo khi có yêu cầu áp dụng;
- Thời gian tham gia và chứng cứ;
- Không suy ra năng lực từ chức danh hoặc một giấy xác nhận đơn lẻ.

### 7.2 Mặt bằng và địa điểm
- Mã địa điểm; loại khu vực; diện tích/dung tích; công năng;
- Sơ đồ phân khu và luồng di chuyển;
- Quyền sử dụng/thuê/mượn nếu liên quan;
- Dữ liệu ảnh/biên bản hiện trường có người lập, ngày giờ và nguồn;
- Phân biệt khai báo, tài liệu và quan sát thực địa.

### 7.3 Máy móc, thiết bị, phương tiện
- Mã thiết bị; tên; nhà sản xuất/model nếu có;
- Công dụng và công đoạn;
- Thông số kỹ thuật; công suất định mức; điều kiện định mức;
- Số lượng; trạng thái sử dụng; lịch bảo trì;
- Thiết bị đo: dải đo, độ chính xác, hiệu chuẩn/kiểm tra khi áp dụng;
- Chứng cứ: nhãn máy, tài liệu kỹ thuật, ảnh, nhật ký vận hành;
- Không coi ảnh thiết bị là bằng chứng đủ về công suất vận hành thực tế.

### 7.4 Nguyên liệu và vật tư
- Tên/mã; nhà cung cấp; nguồn gốc;
- Lô; lượng; đơn vị; thời điểm;
- Chỉ tiêu/điều kiện tiếp nhận;
- Hồ sơ kèm theo;
- Mục đích sử dụng và hoạt động liên quan.

## 8. Chuẩn chứng cứ theo hoạt động

Mỗi chứng cứ cần có:
- Mã tài liệu và loại tài liệu;
- Bên phát hành/lập;
- Ngày lập, thời kỳ được chứng minh;
- Đối tượng được chứng minh (chủ thể, địa điểm, hoạt động, sản phẩm, lô, thiết bị);
- Trang/vị trí trích dẫn;
- Trích đoạn nguyên văn hoặc dữ liệu trích xuất;
- Phương thức tiếp nhận (bản gốc, bản sao, bản điện tử, ảnh, OCR, khai báo);
- Độ tin cậy trích xuất và giới hạn;
- Người kiểm tra/xác nhận;
- Phiên bản và trạng thái.

Một tài liệu có thể liên quan nhiều hoạt động nhưng phải tạo liên kết cụ thể cho từng hoạt động. Không dùng một hợp đồng hoặc giấy chứng nhận để chứng minh những nội dung nằm ngoài phạm vi tài liệu.

## 9. Sinh checklist theo hoạt động

Quy trình hệ thống:
1. Xác định chủ thể và địa điểm.
2. Xác định hoạt động thực tế, thời kỳ và vai trò của cơ sở.
3. Xác định sản phẩm/biến thể và vai trò đầu vào/đầu ra.
4. Lấy thuộc tính bắt buộc của hoạt động; liệt kê trường còn thiếu.
5. Lấy cấu hình nguồn lực, quy trình và công suất.
6. Tải phiên bản quy tắc pháp lý đã được xác minh theo chủ thể, địa bàn, thời gian, sản phẩm và hoạt động.
7. Tải tham chiếu khoa học/kỹ thuật có điều kiện áp dụng phù hợp.
8. Sinh tiêu chí và chỉ rõ nguồn của từng tiêu chí.
9. Liên kết chứng cứ hiện có; đánh dấu tiêu chí thiếu chứng cứ.
10. Thực hiện kiểm tra tự động có thể lặp lại: logic, số học, thời gian, trùng lặp, cân đối dòng vật chất.
11. Phân loại kết quả: đã kiểm tra không phát hiện sai lệch; đã kiểm tra có phát hiện; chưa thể xác minh; không áp dụng; chưa xử lý.
12. Chuyển ngoại lệ cho công chức/người có chuyên môn; tạo nhiệm vụ xác minh hiện trường nếu cần.
13. Lưu nhật ký, phiên bản dữ liệu và quy tắc.

Nếu không xác định được phạm vi pháp lý, checklist phải hiển thị `scope_unknown` hoặc `pending_input`, không tự kết luận nghĩa vụ.

## 10. Kiểm soát tính hợp lý và chống gian lận

Hệ thống có thể kiểm tra:
- Một lô đầu vào xuất hiện trùng ở nhiều hồ sơ hoặc nhiều giao dịch;
- Thời gian nhập – sản xuất – xuất không thể đồng thời đúng theo dữ liệu kê khai;
- Sản lượng vượt dữ liệu năng lực được chứng minh;
- Tồn kho âm hoặc cân đối vật chất không khớp;
- Một thiết bị/nhân lực bị khai báo sử dụng đồng thời ở các địa điểm;
- Chênh lệch giữa phiếu cân, hóa đơn, nhật ký và dữ liệu kho;
- Lô đầu ra không có lô đầu vào/nguồn hợp lý;
- Hoạt động thuê ngoài nhưng không có địa điểm/bên nhận tương ứng.

Mỗi cảnh báo phải kèm:
1. Dữ liệu so sánh;
2. Phép tính/quy tắc;
3. Khoảng thời gian và đơn vị;
4. Giả định;
5. Mức độ đầy đủ của dữ liệu;
6. Giải thích hợp lý có thể có;
7. Tài liệu cần yêu cầu;
8. Việc cần xác minh.

**Cấm:** tự kết luận giả mạo, gian lận, vi phạm hoặc cố ý khai sai chỉ từ một cảnh báo tự động.

## 11. Trạng thái áp dụng và trạng thái kết quả

### Trạng thái áp dụng
- `applicable`: đã xác định tiêu chí áp dụng.
- `not_applicable`: không áp dụng, phải nêu căn cứ/lý do.
- `scope_unknown`: chưa đủ dữ liệu xác định phạm vi.
- `pending_input`: chờ bổ sung đầu vào.
- `superseded`: cấu hình đã được phiên bản mới thay thế.

### Trạng thái kiểm tra
- `checked_no_issue`: đã kiểm tra, không phát hiện sai lệch trong phạm vi tiêu chí.
- `checked_issue`: đã kiểm tra, có phát hiện.
- `not_verifiable`: chưa đủ dữ liệu/chứng cứ.
- `not_processed`: chưa xử lý.

Không gộp hai nhóm trạng thái này thành một trường duy nhất.

## 12. Kiểm tra chất lượng dữ liệu hoạt động

| Mã | Kiểm tra | Hành động |
|---|---|---|
| ADQ01 | Không có địa điểm thực hiện cụ thể | Yêu cầu xác định địa điểm |
| ADQ02 | Không rõ hoạt động trực tiếp hay thuê ngoài | Yêu cầu phân định vai trò |
| ADQ03 | Thiếu thời kỳ hoạt động | Không tính công suất theo kỳ |
| ADQ04 | Công suất không có đơn vị/mẫu số | Không dùng để đối chiếu |
| ADQ05 | Trộn công suất thiết kế với thực tế | Tách chỉ tiêu và nguồn |
| ADQ06 | Thiếu số ca/giờ vận hành | Đánh dấu dữ liệu công suất chưa đủ |
| ADQ07 | Thiết bị không gắn công đoạn | Yêu cầu liên kết |
| ADQ08 | Sản phẩm đầu ra không liên kết đầu vào | Cảnh báo truy xuất |
| ADQ09 | Lô bị gộp giữa nhiều nguồn | Tách luồng nguồn/lô |
| ADQ10 | Thuê ngoài không có bên nhận/địa điểm | Yêu cầu bổ sung chứng cứ |
| ADQ11 | Một nguồn lực khai báo đồng thời nhiều nơi | Cảnh báo trùng lịch, yêu cầu giải trình |
| ADQ12 | Thời gian quy trình không hợp lý theo dữ liệu kê khai | Nêu mâu thuẫn, không tự kết luận |
| ADQ13 | Thiếu chứng cứ cho thông số kỹ thuật | Chưa đủ căn cứ xác định |
| ADQ14 | Cân đối đầu vào/đầu ra không khớp | Nêu phép tính và chênh lệch |
| ADQ15 | Thay đổi quy trình nhưng không có phiên bản | Lỗi quản trị thay đổi |

## 13. Dữ liệu đầu vào và đầu ra của phân hệ

**Đầu vào:** thông tin chủ thể/địa điểm; mã hoạt động; sản phẩm; quy trình; đầu vào/đầu ra; nhân lực; thiết bị; công suất; lịch vận hành; chứng cứ; quy tắc pháp lý và tham chiếu kỹ thuật đã duyệt.

**Đầu ra:** bản ghi hoạt động chuẩn hóa; sơ đồ công đoạn; hồ sơ nguồn lực; hồ sơ công suất có phương pháp; danh sách thiếu dữ liệu; checklist theo hoạt động; cảnh báo logic; liên kết lô và chuỗi cung ứng; nhiệm vụ xác minh; báo cáo phạm vi và trạng thái kiểm tra.

## 14. Tình huống kiểm thử ban đầu

| Mã | Tình huống | Kết quả mong đợi |
|---|---|---|
| ADT01 | Một cơ sở trồng và sơ chế cùng sản phẩm | Tạo hai hoạt động liên kết cùng địa điểm, không gộp |
| ADT02 | Doanh nghiệp thuê đơn vị khác chế biến | Ghi nhận bên giao, bên nhận, địa điểm và lô riêng |
| ADT03 | Công suất khai báo chỉ có kg/ngày, không có giờ/ca | Không suy ra công suất giờ |
| ADT04 | Thiết bị có công suất định mức nhưng không có nhật ký vận hành | Phân biệt thiết kế với thực tế |
| ADT05 | Một dây chuyền có ba công đoạn với đơn vị khác nhau | Yêu cầu quy đổi có căn cứ và xác định nút thắt |
| ADT06 | Sản lượng bán gồm hàng tự sản xuất và thu mua | Tách hai nguồn trước khi so với năng lực sản xuất |
| ADT07 | Lô đầu vào xuất hiện ở hai địa điểm cùng thời gian | Cảnh báo trùng và yêu cầu giải trình |
| ADT08 | Hoạt động không có địa chỉ thực tế | `scope_unknown`/thiếu dữ liệu địa điểm |
| ADT09 | Kho có thiết bị lạnh nhưng không có dữ liệu đo | Không kết luận điều kiện bảo quản đạt |
| ADT10 | Dữ liệu sản lượng vượt công suất kê khai | Nêu phép tính, giả định và yêu cầu xác minh |
| ADT11 | Thiếu chứng từ giao nhận dù có hợp đồng | Không coi giao dịch đã thực hiện |
| ADT12 | Một người/thiết bị được kê khai tại hai nơi cùng thời điểm | Cảnh báo xung đột nguồn lực, không kết luận gian lận |
| ADT13 | Hoạt động thu mua bị khai nhầm thành sản xuất | Yêu cầu phân loại lại vai trò |
| ADT14 | Cơ sở đổi quy trình giữa kỳ nhưng không lưu phiên bản | Cảnh báo thiếu lịch sử quy trình |
| ADT15 | Cân đối vật chất âm/dương bất thường do sai đơn vị | Dừng kết luận, kiểm tra đơn vị và quy đổi |

## 15. Tiêu chí nghiệm thu

1. Mô hình hóa đủ HD01–HD20, có thể mở rộng không sửa lõi.
2. Mỗi hoạt động gắn chủ thể, địa điểm, sản phẩm và thời kỳ.
3. Phân biệt hoạt động trực tiếp, thuê ngoài và kết hợp.
4. Tách đầu vào, đầu ra, phụ phẩm, hao hụt và chất thải.
5. Có hồ sơ nhân lực, mặt bằng, thiết bị, phương tiện.
6. Tách công suất thiết kế, kê khai, thực tế và sản lượng giao dịch.
7. Mọi phép tính công suất có đơn vị, thời kỳ, nguồn và phương pháp.
8. Có thể xác định nút thắt quy trình khi đủ dữ liệu.
9. Không tự tạo ngưỡng kỹ thuật hoặc kết luận pháp lý.
10. Mọi cảnh báo có bằng chứng, phép tính và hành động tiếp theo.
11. Phân biệt trạng thái áp dụng với trạng thái kiểm tra.
12. Có lịch sử phiên bản và kiểm toán thay đổi.
13. Có bộ kiểm thử ADT01–ADT15.
14. Có thể sinh checklist động từ hoạt động, sản phẩm, địa điểm và phiên bản quy tắc.
15. Chưa xác minh thì phải thể hiện rõ “CHƯA ĐỦ CĂN CỨ XÁC ĐỊNH”.

## 16. Tài liệu liên quan

- `00_DOCUGUARD_MASTER_SPEC.md`
- `01_BUSINESS_DOMAIN_MAP.md`
- `02_LEGAL_SCIENCE_KNOWLEDGE.md`
- `05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md`
- `06_PRODUCT_DATA_DICTIONARY.md`

Tài liệu tiếp theo: `08_LEGAL_APPLICABILITY_MATRIX.md`. Chỉ xây dựng nội dung quy tắc pháp lý sau khi tra cứu văn bản chính thức, hiệu lực, sửa đổi/thay thế, phân cấp thẩm quyền và điều kiện áp dụng theo thời điểm.
