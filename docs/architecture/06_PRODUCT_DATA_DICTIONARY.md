# DOCUGUARD AI — TỪ ĐIỂN DỮ LIỆU SẢN PHẨM

**Mã tài liệu:** DG-ARCH-06  
**Phiên bản:** 2.2-draft  
**Ngày lập:** 10/11/2026  
**Trạng thái:** Đặc tả dữ liệu nghiệp vụ; chưa phải danh mục pháp lý, danh mục mã hàng chính thức hoặc bộ ngưỡng kỹ thuật đã được thẩm định.

## 1. Mục đích

Tài liệu chuẩn hóa cách mô tả sản phẩm thực phẩm để DocuGuard có thể:
- Nhận diện sản phẩm ở các dạng nguyên liệu, bán thành phẩm và thành phẩm;
- Phân biệt tên thương mại, tên thông dụng, loài/giống, thành phần và trạng thái vật lý;
- Liên kết sản phẩm với chủ thể, địa điểm, hoạt động, lô, nguồn cung và chứng cứ;
- Sinh câu hỏi tiếp nhận và tiêu chí kiểm tra phù hợp;
- Đối chiếu điều kiện bảo quản, năng lực, dòng vật chất và truy xuất;
- Mở rộng danh mục mà không phải sửa lõi phần mềm.

Tài liệu kế thừa 16 nhóm sản phẩm SP01–SP16 tại `05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md`. Mã nhóm hiện tại là mã nghiệp vụ nội bộ, không phải mã phân loại pháp lý, mã HS hay mã ngành.

## 2. Nguyên tắc thiết kế

1. **Không đồng nhất tên sản phẩm với bản chất sản phẩm:** “rau sạch”, “thịt sạch”, “đặc sản” có thể là tên thương mại; không tự coi đó là phân loại kỹ thuật hoặc chứng nhận.
2. **Không dùng một trường tên để chứa nhiều thông tin:** tên, loài/giống, thành phần, trạng thái, nguồn gốc và công đoạn phải tách riêng.
3. **Phân biệt sản phẩm và lô:** sản phẩm là định nghĩa tương đối ổn định; lô là lượng hàng cụ thể có nguồn, thời điểm và lịch sử riêng.
4. **Phân biệt nguồn tự sản xuất và nguồn thu mua:** không gán toàn bộ sản lượng bán ra cho năng lực sản xuất của cơ sở.
5. **Một sản phẩm có thể có nhiều dạng và công đoạn:** sản phẩm gốc có thể được rửa, cắt, cấp đông, sấy, lên men, phối trộn hoặc đóng gói; mỗi trạng thái cần định danh riêng khi làm thay đổi đặc tính hoặc yêu cầu kiểm tra.
6. **Thuộc tính có điều kiện:** chỉ yêu cầu trường phù hợp với nhóm sản phẩm và hoạt động; không bắt mọi sản phẩm khai báo mọi thuộc tính.
7. **Đơn vị phải chuẩn hóa:** lưu giá trị gốc, đơn vị gốc, giá trị chuẩn hóa, đơn vị chuẩn hóa và phép quy đổi; không tự quy đổi khi thiếu căn cứ.
8. **Không tự tạo ngưỡng:** nhiệt độ, độ ẩm, thời hạn, năng suất, mật độ, tỷ lệ hao hụt hoặc chỉ tiêu chất lượng phải lấy từ căn cứ phù hợp và còn hiệu lực hoặc nguồn kỹ thuật đã được duyệt.
9. **Không suy diễn khi thiếu dữ liệu:** trường bắt buộc còn thiếu phải tạo trạng thái chưa đủ dữ liệu; không tự điền bằng giá trị phổ biến.
10. **Lưu lịch sử:** thay đổi tên, phân loại, công thức hoặc trạng thái không được làm mất thông tin đã dùng để đánh giá hồ sơ trước đó.

## 3. Mô hình dữ liệu sản phẩm

### 3.1 Các lớp dữ liệu

| Lớp | Ý nghĩa | Ví dụ |
|---|---|---|
| Nhóm sản phẩm | Nhóm phân loại nghiệp vụ cấp cao | SP01 – Rau, củ, quả |
| Định nghĩa sản phẩm | Sản phẩm được nhận diện theo đặc tính ổn định | Cà chua tươi |
| Biến thể sản phẩm | Khác biệt có ý nghĩa về loài/giống, quy cách, trạng thái hoặc công thức | Cà chua giống A; cà chua cắt miếng |
| Trạng thái qua công đoạn | Trạng thái trước/sau một hoạt động | Nguyên liệu → đã rửa → đã cắt → đóng gói |
| Lô | Đơn vị truy xuất của hàng hóa thực tế | Lô thu hoạch ngày X |
| Thành phần cấu thành | Nguyên liệu hoặc thành phần tạo nên sản phẩm hỗn hợp | Bột, đường, dầu, gia vị |
| Điều kiện xử lý/bảo quản | Thông số gắn với sản phẩm và trạng thái cụ thể | Làm lạnh, đông lạnh, khô |
| Hồ sơ chứng cứ | Tài liệu chứng minh thuộc tính hoặc lịch sử | Phiếu nhập, nhật ký, kết quả kiểm nghiệm |

### 3.2 Quan hệ

- Một nhóm sản phẩm có nhiều định nghĩa sản phẩm.
- Một định nghĩa sản phẩm có thể có nhiều biến thể.
- Một biến thể có thể có nhiều trạng thái qua công đoạn.
- Một sản phẩm/lô có thể có nhiều nguồn đầu vào.
- Một sản phẩm có thể được xử lý tại nhiều địa điểm hoặc bởi nhiều đơn vị gia công.
- Một lô đầu ra có thể liên kết với nhiều lô đầu vào; quan hệ phải thể hiện tỷ lệ/khối lượng sử dụng nếu có dữ liệu.
- Một chứng cứ có thể chứng minh nhiều thuộc tính nhưng phải chỉ rõ phạm vi chứng minh.

Không gộp hai lô chỉ vì cùng tên sản phẩm, cùng ngày hoặc cùng nhà cung cấp.

## 4. Từ điển thuộc tính lõi

| Mã thuộc tính | Tên hiển thị | Kiểu dữ liệu | Bắt buộc | Quy tắc |
|---|---|---|---|---|
| product_id | Mã sản phẩm nội bộ | UUID/mã định danh | Có | Duy nhất, không tái sử dụng |
| product_group_code | Mã nhóm sản phẩm | Danh mục | Có | Tham chiếu SP01–SP16 hoặc nhóm mới đã duyệt |
| canonical_name | Tên chuẩn | Văn bản | Có | Tên nhận diện ngắn, không chứa kết luận chứng nhận |
| declared_name | Tên cơ sở kê khai | Văn bản | Có | Giữ nguyên cách ghi trong hồ sơ |
| synonym_names | Tên khác/tên đồng nghĩa | Danh sách văn bản | Không | Ghi nguồn hoặc địa phương sử dụng nếu cần |
| commercial_name | Tên thương mại/nhãn hiệu | Văn bản | Không | Không dùng thay tên bản chất sản phẩm |
| scientific_name | Tên khoa học | Văn bản | Có điều kiện | Dùng khi cần định danh loài; lưu nguồn xác nhận |
| species_code | Mã loài | Danh mục có nguồn | Có điều kiện | Không tự tạo mã ngoài danh mục được quản trị |
| variety_breed | Giống/dòng/giống vật nuôi | Văn bản/danh mục | Có điều kiện | Gắn nguồn giống và bằng chứng nếu có |
| origin_type | Loại nguồn gốc | Enum | Có | Tự sản xuất, thu mua, nhập khẩu, gia công, hỗn hợp, chưa rõ |
| origin_location | Địa điểm/vùng nguồn | Đối tượng địa lý | Có điều kiện | Có thể là vùng trồng, cơ sở nuôi, vùng khai thác, nơi sản xuất |
| raw_material_flag | Là nguyên liệu | Boolean | Có | Theo trạng thái của sản phẩm trong chuỗi |
| semi_finished_flag | Là bán thành phẩm | Boolean | Có | Không đồng thời suy ra thành phẩm |
| finished_food_flag | Là thành phẩm | Boolean | Có | Căn cứ mô tả công đoạn và mục đích lưu thông |
| physical_state | Trạng thái vật lý | Enum/mở rộng | Có | Tươi, sống, khô, đông lạnh, lỏng, bột, nhuyễn, hỗn hợp, khác |
| processing_state | Trạng thái xử lý | Danh mục | Có | Chưa xử lý, đã rửa, cắt, xay, gia nhiệt, lên men, sấy, cấp đông, đóng gói... |
| composition | Thành phần/công thức | Danh sách có định lượng | Có điều kiện | Tổng tỷ lệ và đơn vị phải kiểm tra; không suy diễn thành phần |
| allergen_info | Thông tin chất gây dị ứng | Danh sách/không rõ | Có điều kiện | Chỉ kết luận theo thành phần và căn cứ áp dụng |
| intended_use | Mục đích sử dụng | Enum/văn bản | Có | Dùng trực tiếp, cần chế biến tiếp, làm nguyên liệu, mục đích khác |
| presentation_form | Quy cách/dạng trình bày | Văn bản có cấu trúc | Không | Nguyên con, phi lê, miếng, chai, túi, khay... |
| package_type | Loại bao bì | Danh mục mở | Có điều kiện | Bao bì tiếp xúc trực tiếp/bao bì ngoài phải phân biệt |
| net_quantity | Khối lượng/thể tích tịnh | Decimal + đơn vị | Có điều kiện | Lưu giá trị gốc và đơn vị |
| storage_profile_id | Hồ sơ điều kiện bảo quản | Tham chiếu | Có điều kiện | Phụ thuộc trạng thái, phương pháp và căn cứ |
| shelf_life_value | Thời hạn sử dụng | Decimal/văn bản | Có điều kiện | Không tự đặt; gắn đơn vị, điều kiện và căn cứ xác lập |
| label_version | Phiên bản nhãn | Tham chiếu/tệp | Có điều kiện | Lưu ảnh/tệp và thời điểm áp dụng |
| standard_reference_ids | Căn cứ tiêu chuẩn/quy chuẩn | Danh sách tham chiếu | Có điều kiện | Chỉ gắn văn bản đã xác minh phạm vi và hiệu lực |
| risk_profile_id | Hồ sơ nguy cơ | Tham chiếu | Có điều kiện | Là cấu hình đánh giá, không phải kết luận an toàn |
| data_completeness | Mức độ đầy đủ dữ liệu | Trạng thái tính toán | Có | Có quy tắc tính và danh sách trường thiếu |
| record_status | Trạng thái bản ghi | Enum | Có | Bản nháp, chờ duyệt, đang dùng, ngừng dùng, thay thế |
| valid_from / valid_to | Thời gian hiệu lực bản ghi | Ngày giờ | Có | Quản lý lịch sử thay đổi |

**Lưu ý:** “Bắt buộc” ở bảng trên là yêu cầu dữ liệu nội bộ của hệ thống. “Có điều kiện” nghĩa là chỉ bật khi thuộc tính phù hợp với nhóm sản phẩm, hoạt động, mục đích và quy định liên quan. Đây không phải khẳng định về thành phần hồ sơ pháp lý bắt buộc.

## 5. Thuộc tính chuyên biệt theo nhóm sản phẩm

### 5.1 SP01 – Rau, củ, quả
- Loài và giống; bộ phận sử dụng (lá, thân, rễ, củ, quả, hoa, hạt).
- Hình thức canh tác; địa điểm/vùng trồng; diện tích; mùa vụ; ngày gieo trồng và thu hoạch nếu có.
- Sản phẩm nguyên trạng hay đã rửa, phân loại, gọt, cắt, đóng gói.
- Nguồn nước/vật tư và nhật ký liên quan khi thuộc phạm vi kiểm tra.
- Tình trạng tươi, làm mát, sấy hoặc chế biến.
- Dữ liệu khối lượng thu hoạch, loại bỏ, hao hụt và khối lượng đưa vào sơ chế.

Không mặc định một loại rau có cùng chu kỳ, năng suất hoặc điều kiện bảo quản ở mọi vùng và phương thức.

### 5.2 SP02 – Nấm và sản phẩm nấm
- Loài nấm; giống/chủng nếu có căn cứ nhận diện.
- Nấm nuôi trồng hay thu hái tự nhiên.
- Loại giá thể/cơ chất, phương thức và địa điểm nuôi trồng khi áp dụng.
- Dạng tươi, sấy, muối, ngâm, chế biến hoặc phối trộn.
- Thời điểm thu hái, phân loại, xử lý và điều kiện bảo quản.
- Đối với nấm tự nhiên: thông tin nhận diện loài và nguồn xác minh; không suy đoán loài từ tên dân gian không đủ căn cứ.

### 5.3 SP03 – Ngũ cốc và cây lương thực
- Loài, giống, mùa vụ, vùng trồng và thời điểm thu hoạch.
- Dạng thóc, gạo, ngô hạt, bột hoặc sản phẩm đã chế biến.
- Độ ẩm/chỉ tiêu chất lượng chỉ ghi nhận khi có phép đo, phương pháp và nguồn quy chiếu.
- Công đoạn làm sạch, xay xát, nghiền, sấy, phân loại, tồn trữ.
- Khối lượng đầu vào, tạp chất/loại bỏ, tỷ lệ thu hồi và phụ phẩm nếu có chứng cứ.
- Điều kiện kho, thời gian lưu và kiểm soát côn trùng/nấm mốc theo căn cứ áp dụng.

### 5.4 SP04 – Cây công nghiệp/cây gia vị
- Loài, giống, vùng trồng, mùa vụ và bộ phận thu hoạch.
- Dạng nguyên liệu tươi, phơi/sấy, lên men, rang, xay, chiết xuất hoặc phối trộn.
- Công đoạn sơ chế/chế biến và thông số công nghệ có chứng cứ.
- Chỉ tiêu chất lượng, độ ẩm hoặc thành phần chỉ được đánh giá khi có phương pháp đo và chuẩn đối chiếu phù hợp.
- Phân biệt sản phẩm nông sản thô với sản phẩm đã chế biến.

### 5.5 SP05 – Thịt và sản phẩm thịt
- Loài động vật; dạng thịt; nguồn động vật và cơ sở/địa điểm liên quan.
- Trạng thái tươi, làm mát, đông lạnh, rã đông, pha lóc, xay, tẩm ướp, chế biến.
- Liên kết nguồn đàn/lô động vật, hoạt động giết mổ và lô thịt đầu ra khi có dữ liệu.
- Phân biệt thịt nguyên liệu, phụ phẩm dùng làm thực phẩm và sản phẩm chế biến.
- Điều kiện nhiệt độ/thời gian bảo quản, vận chuyển phải gắn loại sản phẩm, trạng thái và căn cứ phù hợp.
- Khối lượng đầu vào, phần thu hồi, phụ phẩm, hao hụt và đầu ra; không dùng một tỷ lệ thu hồi chung cho mọi loài/công nghệ.

### 5.6 SP06 – Trứng và sản phẩm trứng
- Loài gia cầm; nguồn đàn/cơ sở thu gom.
- Trứng nguyên vỏ, đã phân loại, làm sạch, xử lý, bóc vỏ hoặc sản phẩm trứng dạng lỏng/bột.
- Cỡ/khối lượng phân loại nếu có phương pháp và hồ sơ.
- Tình trạng vỏ, ngày thu gom/đóng gói, mã lô.
- Điều kiện bảo quản và vận chuyển theo trạng thái cụ thể.
- Thành phần và xử lý nhiệt đối với sản phẩm trứng chế biến.

### 5.7 SP07 – Sữa và sản phẩm sữa
- Loài cho sữa; nguồn sữa; dạng sữa nguyên liệu.
- Trạng thái xử lý: chưa xử lý, thanh trùng, tiệt trùng, lên men, cô đặc, sấy hoặc phối trộn.
- Thành phần/công thức, chủng men hoặc phụ gia nếu có và có căn cứ.
- Công đoạn tiếp nhận, lọc, xử lý nhiệt, lên men, đồng hóa, đóng gói.
- Điều kiện bảo quản theo loại sản phẩm và trạng thái.
- Liên kết lô sữa nguyên liệu với lô thành phẩm và hồ sơ kiểm soát công đoạn.

### 5.8 SP08 – Thủy sản nuôi trồng
- Loài nuôi; nguồn giống; hình thức nuôi; vùng/cơ sở nuôi.
- Ao, hồ, lồng, bè, bể hoặc hình thức khác; diện tích/thể tích có đơn vị.
- Thời gian thả nuôi, thu hoạch; mật độ và số vụ nếu có dữ liệu.
- Thức ăn, thuốc/hóa chất và nhật ký sử dụng khi thuộc phạm vi.
- Dạng sống, tươi, ướp lạnh, đông lạnh, sơ chế hoặc chế biến.
- Sản lượng thu hoạch, tỷ lệ sống/hao hụt và cỡ thu hoạch chỉ đánh giá theo dữ liệu và nguồn tham chiếu có điều kiện.

### 5.9 SP09 – Thủy sản khai thác
- Loài; dạng sản phẩm; phương tiện/chuyến khai thác liên quan.
- Vùng khai thác, thời gian, nghề/ngư cụ khi dữ liệu được yêu cầu.
- Sản phẩm sống, tươi, ướp lạnh, đông lạnh, phơi/sấy hoặc chế biến.
- Thời gian từ khai thác đến bảo quản; phương pháp bảo quản và lô chuyến biển.
- Hồ sơ nguồn gốc, giao nhận, sản lượng và phân lô.
- Không suy ra tính hợp pháp của khai thác chỉ từ tên loài hoặc địa điểm kê khai.

### 5.10 SP10 – Mật ong/sản phẩm từ ong
- Mật ong, sáp ong dùng làm thực phẩm hoặc sản phẩm khác.
- Nguồn đàn ong, địa điểm/nguồn hoa và thời gian thu hoạch nếu có.
- Dạng mật nguyên liệu, đã lọc, phối trộn, đóng chai hoặc sản phẩm chế biến.
- Chỉ tiêu chất lượng và phương pháp thử khi có kết quả hợp lệ.
- Liên kết lô thu hoạch, lô tiếp nhận, lô phối trộn và lô đóng gói.

### 5.11 SP11 – Lâm sản và sản phẩm tự nhiên
- Tên thông dụng và tên khoa học nếu có thể xác định đáng tin cậy.
- Nguồn thu hái/khai thác, địa điểm, thời gian và chủ thể cung cấp.
- Dạng tươi, khô, sơ chế hoặc chế biến.
- Phương pháp nhận diện, phân loại và kiểm soát nguy cơ đặc thù.
- Chứng cứ nguồn gốc và quyền khai thác/thu hái khi pháp luật yêu cầu.
- Không tự xác nhận loài hoặc nguồn gốc hợp pháp chỉ dựa trên mô tả văn bản.

### 5.12 SP12 – Thực phẩm sơ chế
- Sản phẩm gốc và lô nguyên liệu đầu vào.
- Công đoạn: rửa, làm sạch, cắt, gọt, phân loại, pha lóc, xay hoặc công đoạn sơ chế khác.
- Trạng thái sau sơ chế; tỷ lệ loại bỏ/hao hụt có chứng cứ.
- Nước, dụng cụ, bề mặt tiếp xúc, bao gói và thời gian xử lý.
- Điều kiện bảo quản sau sơ chế; thời hạn sử dụng chỉ khi có căn cứ xác lập.
- Phân biệt sơ chế với chế biến theo định nghĩa và quy định áp dụng, không chỉ dựa vào tên gọi của cơ sở.

### 5.13 SP13 – Thực phẩm chế biến
- Sản phẩm đầu ra; nguyên liệu và bán thành phẩm cấu thành.
- Công thức; định lượng; tỷ lệ thành phần; phụ gia/chất hỗ trợ chế biến nếu có.
- Công nghệ: gia nhiệt, thanh trùng, tiệt trùng, sấy, lên men, đông lạnh, chiết xuất hoặc phương pháp khác.
- Thông số thời gian/nhiệt độ/áp suất/độ ẩm và phương pháp ghi nhận khi có áp dụng.
- Thiết bị, công suất, mẻ sản xuất, điểm kiểm soát và hồ sơ xác nhận quy trình.
- Khối lượng đầu vào, đầu ra, hao hụt, phế phẩm và phụ phẩm.
- Điều kiện bao gói, bảo quản, hạn sử dụng và nhãn theo căn cứ phù hợp.

### 5.14 SP14 – Thực phẩm hỗn hợp/đa thành phần
- Danh sách thành phần, tỷ lệ hoặc khoảng tỷ lệ được khai báo.
- Đơn vị tính, cơ sở tính tỷ lệ (khối lượng, thể tích hoặc cơ sở khác).
- Nhà cung cấp và lô của từng thành phần trọng yếu.
- Chất gây dị ứng và nguy cơ nhiễm chéo khi phù hợp.
- Trình tự phối trộn, công thức phiên bản, sai số định lượng và kiểm soát mẻ.
- Đối chiếu tổng lượng thành phần với lượng thành phẩm, hao hụt và tồn.
- Không tự suy ra công thức đầy đủ từ nhãn nếu nhãn không thể hiện đầy đủ.

### 5.15 SP15 – Thực phẩm bao gói sẵn
Đây là thuộc tính trạng thái/kiểu lưu thông có thể đồng thời gắn với SP01–SP14, không nhất thiết là một họ sản phẩm độc lập.
- Sản phẩm bên trong và trạng thái xử lý.
- Bao bì tiếp xúc trực tiếp, bao bì ngoài, quy cách và khối lượng/thể tích tịnh.
- Nhãn/phiên bản nhãn, mã lô, ngày sản xuất, hạn sử dụng và điều kiện bảo quản nếu có.
- Căn cứ về vật liệu bao gói và yêu cầu ghi nhãn khi áp dụng.
- Phân biệt sản phẩm được đóng gói tại cơ sở với sản phẩm chỉ được lưu thông/bán lại trong bao gói sẵn.

### 5.16 SP16 – Sản phẩm phụ phẩm dùng làm thực phẩm
- Tên phụ phẩm và sản phẩm/hoạt động phát sinh phụ phẩm.
- Nguồn gốc, mục đích sử dụng làm thực phẩm và điều kiện pháp lý tương ứng.
- Công đoạn thu hồi, phân loại, làm sạch, xử lý và bảo quản.
- Thành phần/nguy cơ có liên quan và chứng cứ kiểm soát.
- Khối lượng phát sinh, khối lượng thu hồi, hao hụt và lượng đưa vào sử dụng.
- Không mặc định mọi phụ phẩm đều được phép sử dụng làm thực phẩm.

## 6. Chuẩn hóa đơn vị và số lượng

### 6.1 Nguyên tắc lưu
Mọi số lượng phải lưu tối thiểu:
- Giá trị kê khai nguyên bản;
- Đơn vị kê khai nguyên bản;
- Giá trị chuẩn hóa (nếu có);
- Đơn vị chuẩn hóa;
- Quy tắc/hệ số quy đổi;
- Nguồn hoặc căn cứ của hệ số;
- Người/hệ thống thực hiện và thời điểm quy đổi.

### 6.2 Không được tự động quy đổi khi
- Đơn vị địa phương không có định nghĩa hoặc hệ số đã được duyệt;
- Khối lượng và thể tích cần mật độ riêng nhưng không có dữ liệu;
- Đơn vị “bao”, “sọt”, “thùng”, “con”, “mẻ” chưa có quy cách xác thực;
- Sản phẩm thay đổi độ ẩm/trạng thái làm thay đổi khối lượng;
- Không rõ số lượng tính theo khối lượng tịnh hay cả bao bì.

### 6.3 Các chiều số lượng thường dùng
- Diện tích: m², ha và đơn vị khác được quản trị;
- Thể tích: m³, lít và đơn vị khác được quản trị;
- Khối lượng: g, kg, tấn;
- Số lượng cá thể/đơn vị: con, quả, trứng, chai, gói;
- Thời gian: giờ, ngày, tháng, vụ, chu kỳ;
- Công suất: đơn vị sản phẩm/giờ, kg/mẻ, lít/ngày… tùy hoạt động.

Danh mục đơn vị và phép quy đổi phải được quản trị tập trung; không nhúng hệ số tùy tiện trong mã nguồn.

## 7. Hồ sơ điều kiện bảo quản

Mỗi hồ sơ bảo quản cần có:
- Đối tượng sản phẩm/biến thể và trạng thái xử lý áp dụng;
- Phương pháp bảo quản (điều kiện thường, làm mát, đông lạnh, đông sâu, sấy/giảm ẩm, bao gói khí quyển điều chỉnh hoặc phương pháp khác);
- Dải thông số yêu cầu nếu có căn cứ: nhiệt độ, độ ẩm, ánh sáng, thông khí, thời gian;
- Phương pháp đo, thiết bị, vị trí đo, tần suất và sai số;
- Bao gói và điều kiện vận chuyển liên quan;
- Nguồn xác lập: văn bản pháp luật, quy chuẩn, tiêu chuẩn, hướng dẫn kỹ thuật, nhãn đã được xác lập hoặc hồ sơ quy trình đã thẩm định;
- Phiên bản, thời gian áp dụng, người duyệt;
- Cảnh báo khi dữ liệu đo không đủ hoặc điều kiện đo không tương đương.

Không được mặc định một mức nhiệt độ hoặc thời hạn cho cả nhóm hàng. Nếu không có căn cứ đủ cụ thể, trạng thái phải là `not_verifiable` hoặc `pending_reference`, không tự sinh ngưỡng.

## 8. Hồ sơ nguy cơ sản phẩm

Hồ sơ nguy cơ là cấu hình hỗ trợ chọn tiêu chí, không phải kết luận sản phẩm nguy hiểm/an toàn. Có thể mô tả:
- Nguy cơ sinh học;
- Nguy cơ hóa học;
- Nguy cơ vật lý;
- Dị ứng và nhiễm chéo;
- Nguy cơ phát sinh trong bảo quản/vận chuyển;
- Nguy cơ liên quan nguồn gốc hoặc gian lận thành phần;
- Công đoạn có thể đưa vào, làm tăng hoặc giảm nguy cơ;
- Biện pháp kiểm soát được cơ sở khai báo;
- Phương pháp/chứng cứ dùng để xác minh;
- Mức độ tin cậy và giới hạn dữ liệu.

Mỗi nguy cơ phải có nguồn khoa học/kỹ thuật hoặc căn cứ pháp lý phù hợp, điều kiện áp dụng và người duyệt. Không dùng nhãn nguy cơ chung để thay thế đánh giá mối nguy theo sản phẩm và quy trình thực tế.

## 9. Liên kết sản phẩm – hoạt động – cơ sở – lô

Mỗi bản ghi liên kết cần tối thiểu:
- Chủ thể;
- Cơ sở/địa điểm;
- Sản phẩm/biến thể;
- Hoạt động;
- Vai trò sản phẩm trong hoạt động (đầu vào, đầu ra, phụ phẩm, hàng hóa kinh doanh);
- Lô đầu vào/đầu ra nếu có;
- Thời gian bắt đầu/kết thúc;
- Nguồn gốc (tự sản xuất, thu mua, nhập khẩu, gia công, hỗn hợp);
- Phiên bản quy tắc đánh giá;
- Tài liệu/chứng cứ liên quan.

Ví dụ: cùng một doanh nghiệp có thể trồng rau tại địa điểm A, thu mua rau tại địa điểm B, sơ chế tại địa điểm C và phân phối tại địa điểm D. Không được gán các hoạt động này vào một địa chỉ duy nhất nếu chứng cứ thể hiện khác nhau.

## 10. Quy tắc kiểm tra chất lượng dữ liệu

| Mã kiểm tra | Nội dung | Kết quả khi có vấn đề |
|---|---|---|
| PDQ01 | Thiếu tên kê khai hoặc nhóm sản phẩm | Thiếu dữ liệu bắt buộc |
| PDQ02 | Tên thương mại bị dùng làm tên bản chất mà chưa rõ sản phẩm | Cần xác minh định danh |
| PDQ03 | Có loài/giống nhưng không có nguồn nhận diện khi cần | Chưa đủ căn cứ xác định |
| PDQ04 | Sản phẩm có nhiều trạng thái nhưng không phân biệt | Yêu cầu tách biến thể/trạng thái |
| PDQ05 | Thành phần không có đơn vị/cơ sở tính | Không thể kiểm tra công thức |
| PDQ06 | Tổng tỷ lệ thành phần không khớp | Sai lệch số học hoặc cần giải trình; không tự kết luận gian lận |
| PDQ07 | Số lượng không có đơn vị hoặc quy cách | Không thể chuẩn hóa |
| PDQ08 | Quy đổi đơn vị không có căn cứ | Không thực hiện quy đổi |
| PDQ09 | Điều kiện bảo quản thiếu nguồn hoặc sai đối tượng áp dụng | Chưa đủ căn cứ xác định |
| PDQ10 | Hạn sử dụng không gắn điều kiện bảo quản/phương pháp xác lập | Cần bổ sung căn cứ |
| PDQ11 | Nguồn tự sản xuất và thu mua bị gộp | Yêu cầu tách nguồn |
| PDQ12 | Lô đầu vào/đầu ra thiếu liên kết | Hạn chế khả năng truy xuất |
| PDQ13 | Nhãn không cùng phiên bản/thời kỳ sản phẩm | Cần xác minh phiên bản |
| PDQ14 | Thuộc tính chuyên biệt không phù hợp nhóm sản phẩm | Cảnh báo cấu hình |
| PDQ15 | Bản ghi bị thay đổi nhưng không có lịch sử | Lỗi kiểm soát dữ liệu |

Các kiểm tra PDQ chỉ phát hiện chất lượng dữ liệu hoặc điểm cần xác minh. Không tự động chuyển thành kết luận vi phạm pháp luật.

## 11. Trạng thái dữ liệu

- `draft`: bản ghi đang nhập, chưa dùng đánh giá.
- `pending_review`: chờ người có trách nhiệm rà soát.
- `approved_for_use`: được duyệt sử dụng trong phạm vi xác định.
- `active`: đang được sử dụng.
- `superseded`: đã có phiên bản thay thế.
- `inactive`: ngừng sử dụng nhưng giữ lịch sử.
- `rejected`: không được chấp nhận; phải lưu lý do.

Trạng thái bản ghi sản phẩm không đồng nghĩa với kết luận pháp lý về việc sản xuất/kinh doanh sản phẩm.

## 12. Dữ liệu đầu vào và đầu ra của phân hệ

### Đầu vào
- Tên và mô tả sản phẩm trong hồ sơ;
- Danh sách nguyên liệu/thành phần;
- Tài liệu nguồn gốc, nhãn, quy cách;
- Thông tin loài/giống, vùng/địa điểm;
- Trạng thái xử lý và công đoạn;
- Số lượng, đơn vị, thời kỳ;
- Điều kiện bảo quản và vận chuyển;
- Chứng cứ kèm theo và nguồn trích xuất.

### Đầu ra
- Hồ sơ sản phẩm chuẩn hóa;
- Danh sách thuộc tính đã xác minh/chưa xác minh;
- Quan hệ sản phẩm – biến thể – trạng thái – lô;
- Câu hỏi còn thiếu để yêu cầu bổ sung;
- Cảnh báo chất lượng dữ liệu;
- Các tiêu chí cần sinh theo sản phẩm và hoạt động;
- Liên kết tới căn cứ pháp lý/khoa học/kỹ thuật đã được duyệt;
- Báo cáo phạm vi dữ liệu và độ tin cậy, không kết luận thay người có thẩm quyền.

## 13. Tiêu chí nghiệm thu

1. Tạo được sản phẩm thuộc cả 16 nhóm SP01–SP16 và cho phép mở rộng nhóm mới có kiểm soát.
2. Phân biệt tên kê khai, tên chuẩn, tên thương mại, tên khoa học và tên đồng nghĩa.
3. Phân biệt sản phẩm, biến thể, trạng thái qua công đoạn và lô.
4. Một sản phẩm có thể liên kết nhiều cơ sở, hoạt động, nguồn và lô.
5. Lưu được nguồn gốc tự sản xuất/thu mua/nhập khẩu/gia công/hỗn hợp.
6. Hỗ trợ thành phần/công thức có định lượng và đơn vị.
7. Không tự quy đổi đơn vị nếu thiếu hệ số có căn cứ.
8. Điều kiện bảo quản và hạn sử dụng luôn gắn đối tượng, trạng thái, điều kiện và nguồn.
9. Có lịch sử phiên bản và người duyệt.
10. Thiếu dữ liệu phải hiển thị rõ, không tự điền hoặc kết luận thay.
11. Có thể sinh câu hỏi và checklist theo thuộc tính thực tế.
12. Mọi phát hiện có khả năng truy xuất về dữ liệu nguồn hoặc quy tắc đã dùng.

## 14. Tình huống kiểm thử dữ liệu ban đầu

| Mã | Tình huống | Kết quả mong đợi |
|---|---|---|
| PDT01 | Cơ sở kê khai “rau sạch” nhưng không nêu loài/sản phẩm cụ thể | Giữ nguyên tên kê khai; yêu cầu định danh, không tự gắn chứng nhận |
| PDT02 | Cùng sản phẩm có nguồn tự trồng và thu mua | Tạo hai luồng nguồn riêng |
| PDT03 | Thịt tươi và thịt đông lạnh cùng tên thương mại | Tách trạng thái/biến thể có ý nghĩa |
| PDT04 | Sản phẩm phối trộn có công thức và nhiều lô nguyên liệu | Lưu thành phần, tỷ lệ, liên kết lô |
| PDT05 | Số lượng ghi “20 sọt” nhưng chưa có quy cách sọt | Không quy đổi sang kg |
| PDT06 | Hồ sơ ghi hạn sử dụng nhưng không có căn cứ xác lập | Đánh dấu chưa đủ căn cứ |
| PDT07 | Thủy sản nuôi khai báo loài và sản lượng nhưng thiếu thời kỳ | Yêu cầu bổ sung thời kỳ, không đánh giá năng suất |
| PDT08 | Nấm tự nhiên chỉ có tên địa phương mơ hồ | Không tự xác định loài |
| PDT09 | Nhãn thay đổi giữa hai thời kỳ | Lưu hai phiên bản, không ghi đè |
| PDT10 | Một cơ sở gia công sản phẩm cho nhiều chủ thể | Tách quan hệ bên giao, bên nhận, cơ sở và lô |
| PDT11 | Sản phẩm bao gói sẵn đồng thời thuộc nhóm thịt/chế biến | Cho phép nhiều nhãn phân loại, không tạo bản sao sản phẩm sai lệch |
| PDT12 | Phụ phẩm được khai báo làm thực phẩm | Yêu cầu xác định nguồn, mục đích, xử lý và căn cứ áp dụng |

## 15. Những nội dung chưa được phép tự động kết luận

- Sản phẩm được phép lưu thông chỉ vì đã tạo được bản ghi sản phẩm.
- Sản phẩm an toàn chỉ vì không có cảnh báo dữ liệu.
- Cơ sở đủ điều kiện chỉ vì có nhãn, chứng nhận hoặc tài liệu được tải lên.
- Loài/giống, vùng nguồn gốc hoặc tính hợp pháp của nguồn hàng chỉ từ tên kê khai.
- Năng suất, sản lượng, tỷ lệ hao hụt, thời hạn sử dụng hoặc điều kiện bảo quản khi thiếu dữ liệu và nguồn phù hợp.
- Vi phạm, gian lận hoặc giả mạo chỉ từ một chênh lệch dữ liệu.

## 16. Tài liệu liên quan

- `00_DOCUGUARD_MASTER_SPEC.md`
- `01_BUSINESS_DOMAIN_MAP.md`
- `02_LEGAL_SCIENCE_KNOWLEDGE.md`
- `03_TECHNICAL_ARCHITECTURE.md`
- `05_PRODUCT_ACTIVITY_ASSESSMENT_MATRIX.md`

Tài liệu tiếp theo: `07_ACTIVITY_DATA_DICTIONARY.md`, mô tả đầu vào, nguồn lực, công suất, quy trình, chứng cứ và đầu ra theo từng hoạt động HD01–HD20.
