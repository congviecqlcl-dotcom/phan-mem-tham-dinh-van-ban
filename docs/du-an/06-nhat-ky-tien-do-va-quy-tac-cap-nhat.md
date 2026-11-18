# Nhật ký tiến độ và quy tắc cập nhật hồ sơ DocuGuard AI

- Phiên bản: 1.0
- Ngày thiết lập: 18/11/2026
- Nhánh áp dụng: `docs/project-consolidation-20261118`
- Mục đích: duy trì một nguồn ghi nhận tiến độ có kiểm chứng để tiếp tục dự án qua các cuộc trò chuyện, không nhầm đề xuất với công việc đã hoàn thành.

## 1. Nguyên tắc ghi nhận

1. Mỗi cập nhật phải có ngày, phạm vi, người/đầu mối thực hiện (nếu biết), kết quả và bằng chứng.
2. Không ghi “đã xong” nếu mới chỉ có thiết kế, trao đổi hoặc đề xuất.
3. Phân biệt rõ các trạng thái:
   - **Đề xuất:** phương án đang được xem xét, chưa được chấp thuận.
   - **Đã thống nhất:** người dùng đã đồng ý về định hướng/phạm vi; chưa đồng nghĩa đã triển khai.
   - **Đã thực hiện:** thao tác đã được thực hiện trên đúng hệ thống/nhánh/môi trường.
   - **Đã kiểm tra:** có kết quả kiểm tra cụ thể, ghi rõ cách kiểm tra và thời điểm.
   - **Đã thử nghiệm:** đã chạy thử theo ca kiểm thử hoặc dữ liệu xác định; phải nêu kết quả.
   - **Đã nghiệm thu:** người có thẩm quyền/chủ thể được giao đã xác nhận đạt tiêu chí; không suy ra từ trạng thái build/deploy.
   - **Bị chặn / Chưa xác minh:** chưa thể tiếp tục hoặc chưa đủ bằng chứng.
4. Mọi số liệu kỹ thuật, trạng thái dịch vụ, nhánh, commit, migration, chính sách RLS, cấu hình và kết quả kiểm thử đều phải gắn với thời điểm kiểm tra.
5. Không đưa bí mật cấu hình, khóa API, mật khẩu, token, dữ liệu cá nhân hoặc hồ sơ thật vào tài liệu này.
6. Không tự suy diễn rằng một thay đổi đã được triển khai trên môi trường khác chỉ vì đã có commit hoặc bản Preview.
7. Mọi thay đổi có tác động tới mã nguồn, dữ liệu, cấu hình, quyền truy cập, triển khai hoặc Production phải tuân thủ cơ chế phê duyệt riêng. Tài liệu này không cấp thêm quyền thực hiện.

## 2. Quy trình cập nhật sau mỗi giai đoạn

### Bước 1 — Chốt phạm vi công việc
- Ghi tên nhiệm vụ và mã nhiệm vụ (nếu có).
- Ghi mục tiêu, đầu vào, đầu ra dự kiến.
- Ghi rõ phần nằm trong V1 và phần ngoài phạm vi.
- Ghi trạng thái phê duyệt: chưa xin ý kiến / đang chờ / đã đồng ý / không đồng ý.

### Bước 2 — Ghi nhận thao tác thực tế
- Nêu hệ thống đã tác động: GitHub, Supabase, Vercel hay tài liệu cục bộ.
- Ghi repository, branch, commit SHA, đường dẫn tệp, project ID hoặc deployment ID khi có.
- Với Supabase, ghi migration/tên bảng/hàm/chính sách đã kiểm tra; không ghi giá trị bí mật.
- Với Vercel, phân biệt Preview và Production; ghi deployment ID, commit và trạng thái.
- Nếu chỉ đọc/kiểm tra, phải ghi rõ **chỉ đọc, không thay đổi**.

### Bước 3 — Đưa bằng chứng
- Liên kết tới commit, tệp, pull request, log, kết quả truy vấn hoặc báo cáo kiểm thử.
- Ghi phương pháp kiểm tra và thời điểm.
- Nếu không thể lưu bằng chứng, ghi rõ giới hạn và chuyển trạng thái thành **Chưa xác minh**.
- Không dùng ảnh chụp màn hình đơn lẻ để khẳng định một chức năng đã vận hành đầy đủ nếu chưa kiểm tra luồng nghiệp vụ.

### Bước 4 — Đánh giá kết quả và rủi ro
- Kết quả đạt/chưa đạt so với tiêu chí nào.
- Phần nào chưa làm hoặc chưa đủ căn cứ.
- Rủi ro mới phát hiện; mức độ ảnh hưởng; biện pháp kiểm soát đề xuất.
- Tác động tới phạm vi V1, dữ liệu, bảo mật, phân quyền, pháp lý và khả năng kiểm thử.

### Bước 5 — Chốt việc tiếp theo
- Ghi nhiệm vụ kế tiếp theo thứ tự ưu tiên P0/P1/P2.
- Nêu điều kiện tiên quyết, phụ thuộc, người cần xác nhận và điểm chặn.
- Không tự chuyển sang bước có rủi ro hoặc cần quyền ghi khi chưa có phê duyệt cụ thể.

### Bước 6 — Cập nhật tài liệu bàn giao
- Bổ sung một mục mới vào nhật ký; không xóa lịch sử cũ.
- Nếu thông tin hiện trạng cũ đã lỗi thời, đánh dấu ngày hết giá trị và tạo bản cập nhật có ngày mới.
- Đồng bộ các tài liệu tổng quan/hiện trạng/rủi ro khi thay đổi làm chúng không còn chính xác.
- Kiểm tra liên kết và xác nhận nội dung đã được đọc lại từ GitHub sau khi ghi.

## 3. Mẫu bản ghi tiến độ

Sao chép mẫu dưới đây cho mỗi giai đoạn:

```markdown
## [YYYY-MM-DD] — [Tên giai đoạn/nhiệm vụ]

- Mã nhiệm vụ:
- Trạng thái: Đề xuất / Đã thống nhất / Đã thực hiện / Đã kiểm tra / Đã thử nghiệm / Đã nghiệm thu / Bị chặn / Chưa xác minh
- Mục tiêu:
- Phạm vi:
- Phê duyệt của người dùng: Chưa có / Đã có (nêu rõ nội dung và thời điểm)
- Hệ thống/nhánh/môi trường:
- Thao tác thực tế:
- Kết quả:
- Bằng chứng: (URL, commit SHA, tệp, log, test run...)
- Cách thức và thời điểm kiểm tra:
- Tiêu chí đạt/chưa đạt:
- Vấn đề còn tồn tại:
- Rủi ro và biện pháp kiểm soát:
- Quyết định đã chốt:
- Việc tiếp theo (P0/P1/P2):
- Điều kiện cần người dùng xác nhận:
- Người/đầu mối phụ trách (nếu xác định):
```

## 4. Bảng theo dõi công việc đang mở

| Mã | Công việc | Ưu tiên | Trạng thái | Bằng chứng/đầu mối | Điều kiện tiếp tục |
|---|---|---|---|---|---|
| DG-11 | Kiểm tra lại luồng đăng nhập và khôi phục mật khẩu trên Preview (tiểu việc xác thực) | P0 | Chưa xác minh tại thời điểm lập mẫu | Theo dõi tự động hiện có và deployment thực tế | Kiểm tra đúng nhánh, commit, log và luồng người dùng |
| DG-11 | Rà soát đồng bộ quyền truy cập hồ sơ, tài liệu và Storage (tiểu việc RLS/Storage) | P0 | Chưa xác minh tại thời điểm lập mẫu | Chính sách RLS/Storage và kiểm thử phân quyền | Có ma trận vai trò, chủ hồ sơ và ca kiểm thử chéo người dùng |
| DG-05 | Xử lý tính toàn vẹn OCR theo từng trang và lịch sử xác nhận | P0 | Chưa xác minh tại thời điểm lập mẫu | Mã OCR, cấu trúc dữ liệu và kiểm thử PDF nhiều trang | Không dùng văn bản OCR chưa đầy đủ/chưa xác nhận làm căn cứ đánh giá |
| DG-06 / DG-11 | Kiểm tra RPC ghi nhận rà soát liên kết chứng cứ (liên kết dữ liệu và kiểm soát bảo mật) | P0 | Chưa xác minh tại thời điểm lập mẫu | Định nghĩa hàm, schema thực tế, quyền thực thi và kiểm thử | Xác minh đúng cột, khóa, phạm vi hồ sơ và tính nguyên tử trước mọi sửa đổi |
| DG-12 | Hoàn thiện bộ kiểm thử nghiệp vụ ATTP V1 | P0 | Chưa xác minh tại thời điểm lập mẫu | Bộ dữ liệu thử và tiêu chí nghiệm thu | Tách dữ liệu thử khỏi hồ sơ thật; có kết quả mong đợi được duyệt |

**Quy tắc mã:** sử dụng mã nhiệm vụ chuẩn DG-01 đến DG-14 tại `04-danh-muc-nhiem-vu.md`. Một mã có thể xuất hiện ở nhiều tiểu việc; `DG-06 / DG-11` thể hiện công việc đồng thời thuộc liên kết dữ liệu và rà soát bảo mật. Không tạo mã DG-001, DG-002... song song.

**Lưu ý:** Các dòng trên là danh sách việc cần kiểm tra tiếp theo được kế thừa từ hồ sơ bàn giao tại thời điểm 18/11/2026; trạng thái phải được kiểm tra lại trước khi coi là hiện trạng mới. Không được hiểu các mục này là đã được thực hiện hoặc đã xác nhận lỗi hiện tại.

## 5. Quy tắc duy trì nguồn sự thật

- **GitHub:** nguồn xác định phiên bản mã nguồn và tài liệu đã commit. Luôn ghi đúng repository, branch và commit SHA.
- **Supabase:** nguồn xác định trạng thái dữ liệu, schema, migration, RLS, Storage và RPC tại thời điểm truy vấn. Không lấy mô tả trong tài liệu thay cho kiểm tra trực tiếp.
- **Vercel:** nguồn xác định deployment và môi trường. Build thành công/READY không đồng nghĩa kiểm thử nghiệp vụ hoặc nghiệm thu.
- **Tài liệu pháp luật:** phải xác minh văn bản gốc, hiệu lực, sửa đổi/bãi bỏ, phạm vi điều chỉnh, thẩm quyền và thời điểm áp dụng trước khi dùng trong quy tắc thẩm định.
- **Cuộc trò chuyện:** chỉ là nơi thống nhất yêu cầu và quyết định; không thay thế bằng chứng kỹ thuật hoặc pháp lý.

Khi có mâu thuẫn, ghi nhận mâu thuẫn và kiểm tra nguồn gốc; không tự chọn dữ liệu thuận tiện hơn.

## 6. Checklist trước khi kết thúc một phiên làm việc

- [ ] Đã ghi rõ việc nào chỉ đề xuất, việc nào được người dùng đồng ý.
- [ ] Đã ghi chính xác thao tác đã thực hiện và thao tác chưa thực hiện.
- [ ] Đã lưu commit SHA/đường dẫn/log/test result khi có.
- [ ] Đã ghi các điểm chưa xác minh và rủi ro.
- [ ] Đã cập nhật việc tiếp theo theo thứ tự ưu tiên.
- [ ] Không đưa bí mật hoặc dữ liệu hồ sơ thật vào tài liệu.
- [ ] Không thực hiện thay đổi vượt quá phạm vi phê duyệt.
- [ ] Đã đọc lại tài liệu sau khi cập nhật để xác nhận nội dung.

## 7. Lệnh tiếp nối cho cuộc trò chuyện mới

Người dùng có thể gửi:

**DOCUGUARD-CAP-NHAT-TIEN-DO**

Yêu cầu trợ lý:
1. Đọc hồ sơ dự án trong `docs/du-an/`, đặc biệt tài liệu tiếp nhận/khôi phục và nhật ký tiến độ này.
2. Kiểm tra trạng thái GitHub, Supabase và Vercel hiện tại theo quyền truy cập chỉ đọc trước khi kết luận.
3. So sánh hiện trạng mới với bản ghi gần nhất; chỉ ra thay đổi, điểm lệch và nội dung đã cũ.
4. Không lặp lại việc đã hoàn thành; không coi đề xuất là quyết định hoặc triển khai.
5. Đề xuất bản ghi tiến độ mới theo mẫu ở Mục 3.
6. Chỉ ghi tài liệu lên GitHub sau khi người dùng chấp thuận chính xác nội dung/phạm vi ghi.
7. Không sửa mã nguồn, DB, cấu hình, quyền truy cập, deployment hoặc Production nếu chưa có phê duyệt cụ thể.

## 8. Giới hạn và hiệu lực

Tài liệu này là quy trình quản trị tiến độ, không phải đặc tả nghiệp vụ, căn cứ pháp lý, biên bản nghiệm thu hay giấy ủy quyền kỹ thuật. Mỗi bản ghi chỉ có giá trị đối với sự kiện và bằng chứng được nêu tại thời điểm tương ứng.

**Nguyên tắc cuối:** Ghi đúng sự thật, giữ lịch sử, chứng minh bằng bằng chứng, xác minh trước khi hành động và giữ nguyên quyền quyết định của người dùng.
