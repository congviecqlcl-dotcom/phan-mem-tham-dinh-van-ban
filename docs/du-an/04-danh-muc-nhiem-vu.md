# 04. Danh mục nhiệm vụ tiếp tục

## Mục tiêu ưu tiên
Hoàn thành một luồng V1 hẹp: hồ sơ ATTP → tài liệu → OCR xác nhận → căn cứ pháp lý → tiêu chí → bằng chứng → đánh giá → dự thảo báo cáo → công chức rà soát.

## Danh mục công việc
| Mã | Nhiệm vụ | Sản phẩm/điều kiện hoàn thành | Ưu tiên |
|---|---|---|---|
| DG-01 | Chốt quy trình V1 | SOP/sơ đồ; mỗi bước có đầu vào, thao tác, đầu ra, căn cứ, người làm, ngoại lệ | P0 |
| DG-02 | Kiểm kê pháp lý | Danh mục nguồn chính thức, hiệu lực, phạm vi, chuyển tiếp, thẩm quyền | P0 |
| DG-03 | Chuẩn hóa tiêu chí | Tiêu chí nguyên tử, căn cứ, đối tượng, điều kiện, chứng cứ, cách kiểm tra, giới hạn | P0 |
| DG-04 | Làm rõ liên kết dữ liệu | ERD và quyết định dossier-case-assessment, cardinality và vòng đời | P0 |
| DG-05 | Hoàn thiện OCR xác nhận | Lịch sử theo trang, xem bản gốc, xác nhận/từ chối, không ghi đè | P0 |
| DG-06 | Liên kết tài liệu-evidence | Cùng hồ sơ/phiên bản, trang/tệp, phạm vi hỗ trợ và giới hạn | P0 |
| DG-07 | Chuẩn hóa máy quy tắc | Rule/method có phiên bản và phê duyệt; không dùng DRAFT cho kết quả chính thức | P0 |
| DG-08 | Chuẩn hóa trạng thái finding | Điều kiện rõ cho ĐẠT/KHÔNG ĐẠT/CHƯA ĐỦ CĂN CỨ/CẦN XÁC MINH | P0 |
| DG-09 | Dự thảo báo cáo | Mẫu tiếng Việt, dẫn chiếu được, công chức chỉnh sửa/phê duyệt | P1 |
| DG-10 | Nhật ký và phiên bản | Người, thời điểm, hành động, lý do, dữ liệu trước/sau | P1 |
| DG-11 | Rà soát bảo mật | RLS, grants, Storage, RPC, auth; kiểm thử truy cập trái phép | P0 |
| DG-12 | Kiểm thử đầu-cuối | Ca đạt/không đạt/thiếu căn cứ/cần xác minh, OCR lỗi, hồ sơ sửa đổi | P0 |
| DG-13 | Nghiệm thu có kiểm soát | Biên bản công chức nghiệp vụ, giới hạn và lỗi tồn tại | P1 |
| DG-14 | Tài liệu vận hành | Hướng dẫn công chức/quản trị, xử lý lỗi | P1 |

## Trình tự đề xuất
### A. Nghiệp vụ và pháp lý
1. Chốt quy trình chỉ cho thẩm định hồ sơ.
2. Xác định đúng thủ tục, nhóm cơ sở/ngành hàng và cơ quan có thẩm quyền.
3. Kiểm tra pháp luật trên nguồn chính thức; lập danh mục văn bản, điều khoản, hiệu lực/chuyển tiếp.
4. Tách điều khoản thành tiêu chí nguyên tử.
5. Xác định chứng cứ, cách kiểm tra, ngoại lệ và điều kiện kết luận cho từng tiêu chí.

### B. Dữ liệu
1. Thu thập SQL gốc và đối chiếu đủ 47 migration.
2. Đối chiếu schema với mô hình nghiệp vụ và mã frontend/API.
3. Chốt liên kết dossier-case-case_version-assessment_run.
4. Chốt liên kết document-evidence-OCR run/page.
5. Kiểm soát cùng hồ sơ/phiên bản ở finding support.
6. Chỉ lập migration sau khi thiết kế được duyệt.

### C. Chức năng
1. OCR theo trang và xác nhận.
2. Liên kết tài liệu với checklist/evidence.
3. Gói pháp lý và rule/method đã phê duyệt.
4. Đánh giá từng tiêu chí, truy nguyên.
5. Dự thảo báo cáo và lịch sử.

### D. Kiểm thử và nghiệm thu
1. Kiểm thử phân quyền và truy cập tệp chéo.
2. Kiểm thử tài liệu lỗi, OCR sai, thiếu trang, mâu thuẫn.
3. Kiểm thử hồ sơ sửa đổi và lịch sử phiên bản.
4. Kiểm thử đủ bốn trạng thái.
5. Chạy thử có công chức nghiệp vụ và ghi nhận lỗi.

## Điều kiện trước thay đổi kỹ thuật
Không tạo/sửa migration, schema, policy, RPC, code hoặc deploy nếu chưa có thiết kế tác động, xác định dữ liệu bị ảnh hưởng/rollback, test case/tiêu chí nghiệm thu và phê duyệt riêng.

Trạng thái phải cập nhật theo bằng chứng: Chưa bắt đầu / Đang thực hiện / Chờ xác minh / Đã triển khai / Đã kiểm thử / Đã nghiệm thu. Không coi thảo luận hoặc thiết kế sơ bộ là hoàn thành.