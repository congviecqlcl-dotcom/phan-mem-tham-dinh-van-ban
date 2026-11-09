# Sổ đăng ký căn cứ pháp lý có phiên bản

## Mục tiêu
Lưu trạng thái pháp lý theo từng văn bản và từng điều khoản để trợ lý không dùng danh mục tên văn bản như bằng chứng về hiệu lực hoặc nội dung. Dữ liệu trong thư mục này là nguồn quản trị; chưa tự động trở thành căn cứ pháp lý đã xác minh cho đến khi có người có thẩm quyền rà soát và phê duyệt.

## Nguyên tắc bắt buộc
1. Không có bản gốc/nguồn chính thức và người rà soát thì trạng thái mặc định là `CHUA_XAC_MINH`.
2. Không suy luận hiệu lực từ tên văn bản, kết quả tìm kiếm, câu trả lời AI hoặc văn bản dẫn chiếu.
3. Lưu riêng ngày ban hành, ngày có hiệu lực, ngày hết hiệu lực (nếu có), thời điểm tra cứu, phạm vi lãnh thổ, đối tượng và lĩnh vực áp dụng.
4. Ghi quan hệ sửa đổi, bổ sung, thay thế, bãi bỏ, đình chỉ, tiếp tục hiệu lực và chuyển tiếp theo từng điều/khoản khi có thể xác định.
5. Văn bản sửa đổi không mặc nhiên thay thế toàn bộ văn bản gốc. Trạng thái phải được quản lý ở cấp văn bản và cấp điều khoản.
6. Thủ tục hành chính địa phương là lớp dữ liệu riêng: quyết định công bố TTHC, quyết định quy trình nội bộ, mã TTHC, cơ quan tiếp nhận, cơ quan giải quyết, thời hạn, phí, biểu mẫu, ngày áp dụng.
7. Chỉ nội dung có trạng thái `DA_XAC_MINH` và có nguồn chính thức, ngày kiểm tra, người rà soát mới được dùng để tạo khẳng định pháp lý. Các trạng thái khác phải được trình bày là chưa xác minh.
8. Không dùng nội dung do AI sinh làm nguồn gốc pháp lý.

## Trạng thái chuẩn
- `CHUA_XAC_MINH`: mới ghi nhận tên/số hiệu; chưa đối chiếu bản gốc.
- `CAN_DOI_CHIEU`: có tài liệu nhưng chưa đủ để kết luận hiệu lực/phạm vi.
- `DA_XAC_MINH`: đã đối chiếu nguồn chính thức, nội dung và thời điểm áp dụng; có người rà soát.
- `HET_HIEU_LUC_TOAN_BO`
- `HET_HIEU_LUC_MOT_PHAN`
- `BI_THAY_THE`
- `BI_BAI_BO`
- `TAM_NGUNG_HIEU_LUC`
- `TIEP_TUC_HIEU_LUC`
- `CO_QUY_DINH_CHUYEN_TIEP`

## Quy trình cập nhật
1. Tiếp nhận văn bản hoặc thông tin thay đổi.
2. Thu thập bản gốc từ Công báo, Cơ sở dữ liệu quốc gia về văn bản pháp luật, cơ quan ban hành hoặc cổng thông tin chính thức.
3. Kiểm tra chữ ký/số hiệu, ngày ban hành, hiệu lực, phạm vi, điều khoản thi hành và chuyển tiếp.
4. So sánh với phiên bản trước; lập quan hệ thay đổi theo điều/khoản.
5. Người rà soát pháp chế xác nhận; người phê duyệt chịu trách nhiệm chốt trạng thái.
6. Chỉ sau phê duyệt mới chuyển dữ liệu sang `DA_XAC_MINH`.
7. Kiểm thử câu trả lời AI bằng tình huống có văn bản cũ, văn bản mới, chuyển tiếp và ngoại lệ.
8. Lưu nhật ký thay đổi, người thực hiện, người duyệt và thời điểm.

## Quy tắc sử dụng trong AI
- Nếu không có bản ghi `DA_XAC_MINH` còn áp dụng tại ngày giải quyết: AI phải nói chưa đủ căn cứ.
- Nếu có nhiều văn bản liên quan: hiển thị thứ bậc, quan hệ sửa đổi/thay thế và điều khoản chuyển tiếp; không tự chọn một văn bản chỉ vì mới hơn.
- Nếu chưa đủ dữ kiện phân loại hoạt động: hỏi hoặc liệt kê dữ kiện thiếu; không kết luận diện miễn/cấp giấy.
- Không tự tạo thời hạn, phí, cơ quan, biểu mẫu, thành phần hồ sơ hoặc tên trạng thái xử lý.
- Phân biệt thủ tục pháp luật, thủ tục hành chính đã công bố và quy trình nội bộ của cơ quan.

## Dữ liệu khởi tạo
Tệp `registry.json` chỉ ghi nhận danh mục văn bản cần thu thập. Mọi bản ghi khởi tạo đều ở trạng thái `CHUA_XAC_MINH`; tuyệt đối không xem đó là dữ liệu pháp lý đã thẩm định.
