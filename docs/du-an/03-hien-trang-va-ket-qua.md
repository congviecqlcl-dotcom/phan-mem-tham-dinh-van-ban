# 03. Hiện trạng và kết quả đã thực hiện

> Tổng hợp các lần kiểm tra kỹ thuật đã ghi nhận, chủ yếu đến 17-11-2026. Không phải báo cáo nghiệm thu và không thay thế kiểm tra trực tiếp mới.

## Môi trường đã biết
- GitHub: congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban
- Supabase project: nresxqsvdhzqoetsvhhr (cong-chuc-tham-dinh-attp-dev)
- Vercel Project ID: prj_Hr9W88C9hproqcHfYwLS8plQQtRT
- Nhánh Production đã biết: main

Không lưu khóa API, mật khẩu, JWT, service-role key hoặc biến môi trường trong hồ sơ.

## Nhánh đã quan sát
main; feature/admin-role-management-v1; feature/attp-dossier-review-v1; feature/docuguard-v2-hardening; safety-review/attp-audit-hardening; safety-review/legal-rule-warnings; security/supabase-auth-implementation; security/supabase-auth-integration-plan; work/attp-ocr-integration-20261111.

Danh sách là ảnh chụp nhánh được truy vấn, không xác nhận nhánh nào là nguồn chuẩn hoặc đã đồng bộ.

## Preview đã ghi nhận ngày 17-11-2026
- Deployment: dpl_9p1Csy57ZdYdb6cUHqMgmykDuAFi
- Branch: work/attp-ocr-integration-20261111
- Commit: 579957b8bfe7a53d9da913a09bce114732e4791f
- State: READY
- URL: https://phan-mem-tham-dinh-van-ctwcq45km-tuan-s-projects19.vercel.app
- Alias: https://phan-mem-tham-dinh-van-ban-git-work-at-c287ac-tuan-s-projects19.vercel.app
- SSO protection enabled.

READY chỉ xác nhận build/deploy Preview hoàn tất, không chứng minh kiểm thử nghiệp vụ, bảo mật hoặc nghiệm thu. Đợt lập hồ sơ này không triển khai ứng dụng.

## Mã nguồn đã quan sát
- src/App.tsx nạp sáu nhóm: thẩm định văn bản, hồ sơ ATTP, trợ lý AI, thư viện pháp lý, mẫu chuẩn, quản trị người dùng.
- src/components/AttpDossierReview.tsx có luồng tạo hồ sơ, checklist mặc định, tải tài liệu lên kho riêng tư, liên kết tài liệu với mục kiểm tra và hiển thị tài liệu.
- src/utils/auth.ts có đăng nhập mật khẩu, đổi mật khẩu, liên kết đăng nhập email và khôi phục mật khẩu.
- server.ts có API xử lý tài liệu, trạng thái AI, trò chuyện, phiên và quản trị người dùng.
- Mã giao diện dùng JWT người dùng khi gọi API hồ sơ; đường dẫn upload bắt đầu bằng UUID hồ sơ; giới hạn tệp ghi nhận 25 MB.

Các quan sát chứng minh có thành phần mã, không chứng minh mọi luồng hoạt động đúng trong thực tế.

## Cơ sở dữ liệu đã kiểm tra
- Migration ledger: 47 migration, từ 20261007101514 đến 20261106074057.
- Schema public: 64 bảng, 6 view.
- RLS bật trên 64 bảng; ghi nhận 73 policy.
- Số bản ghi tại thời điểm kiểm tra: attp_dossiers 1; attp_dossier_documents 7; attp_dossier_checklist_items 7; attp_dossier_document_links 0; assessment_runs 2; findings 10.
- Bucket riêng tư attp-dossiers-private, giới hạn tệp 25 MB.

Giới hạn: cây nhánh repository được rà soát chưa có tệp SQL migration/schema tương ứng. Ledger chỉ có tên và phiên bản, không có SQL body. Chưa thể tuyên bố đã đối chiếu đủ 47 migration với mã nguồn SQL gốc.

## Dữ liệu thử nghiệm
**ATTP-GOLDFRUIT-2026-001:** run AR-GOLDFRUIT-001, IN_PROGRESS, 5 câu hỏi, 6 findings. Ghi nhận vấn đề liên kết hóa đơn với lô nhập, sự kiện nhận/lưu kho/bán, phạm vi sản phẩm, diện tích/công suất/khu vực và hồ sơ nhân sự.

**ATTP-SXTT-TEST-001:** run AR-ATTP-TEST-001, IN_PROGRESS, 3 câu hỏi, 4 findings. Ghi nhận vấn đề dữ liệu năng suất, sự kiện sử dụng thuốc BVTV, phạm vi đăng ký thuốc và nguồn/nội dung sử dụng nước. Một số rule/method còn DRAFT.

Đây là dữ liệu thử nghiệm, không phải hồ sơ thật hoặc kết luận pháp lý đã được chấp nhận. Thiếu chứng cứ trong bộ dữ liệu không chứng minh sự việc không xảy ra ngoài thực tế.

## Kết quả bảo mật/toàn vẹn cần xử lý
- Advisor từng cảnh báo leaked password protection chưa bật, 24 khóa ngoại chưa có chỉ mục và 52 chỉ mục chưa được dùng. Không xóa chỉ mục chỉ dựa vào thống kê này.
- has_app_role bị từ chối EXECUTE trong ngữ cảnh authenticated ở lần thử trước; không cấp quyền rộng khi chưa phân tích.
- record_finding_support_link_review có truy vấn tham chiếu cột app_users không khớp cấu trúc đã quan sát; EXECUTE authenticated đã bị thu hồi ở migration được kiểm tra.
- Một số hàm refresh có side effect và quyền EXECUTE rộng; không gọi trong audit chỉ đọc.
- Một số attp_* có grants rộng dù RLS bật; cần đánh giá least privilege.
- Chưa chứng minh nhật ký bất biến.
- Một số đường dẫn Storage cũ không thống nhất quy ước thư mục UUID hồ sơ.
- Chính sách liên kết finding/evidence còn điểm cần rà soát về cùng hồ sơ/phiên bản và xác thực rule/method.

## Kết luận trạng thái
**Đã có:** nền tảng hồ sơ ATTP, lưu tài liệu riêng tư, checklist, cụm dữ liệu đánh giá/pháp lý, một số API và luồng xác thực, dữ liệu thử nghiệm.

**Chưa đủ bằng chứng hoàn thành:** kết nối xuyên suốt hồ sơ → đánh giá → bằng chứng → yêu cầu pháp lý → báo cáo; OCR có xác nhận theo trang; bảo mật/ủy quyền toàn diện; kiểm thử đầu-cuối; nghiệm thu nghiệp vụ.

Không suy diễn Preview READY = nghiệm thu; migration applied = chức năng đúng; RLS enabled = không có lỗ hổng; OCR có văn bản = chính xác.