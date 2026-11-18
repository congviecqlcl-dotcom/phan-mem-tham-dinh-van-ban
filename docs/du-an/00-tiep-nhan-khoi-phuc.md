# DOCUGUARD AI — HỒ SƠ TIẾP NHẬN VÀ KHÔI PHỤC DỰ ÁN

**Mã lệnh khôi phục:** `DOCUGUARD-KHOI-PHUC-TOAN-BO`  
**Phiên bản:** 1.1  
**Ngày cập nhật:** 18/11/2026  
**Mục đích:** giúp cuộc trò chuyện mới tiếp nhận dự án liên tục, có kiểm chứng, không làm lại từ đầu.

---

## 1. Câu lệnh sử dụng ở cuộc trò chuyện mới

Sao chép nguyên văn đoạn sau và gửi ở cuộc trò chuyện mới:

> **DOCUGUARD-KHOI-PHUC-TOAN-BO**
>
> Hãy tiếp nhận và khôi phục dự án DocuGuard AI từ toàn bộ bối cảnh, lịch sử trò chuyện, tài liệu trong ChatGPT Library, hồ sơ dự án trên GitHub và các nền tảng được kết nối.
>
> Trước tiên, đọc bộ tài liệu trong `docs/du-an/` của repository `congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban`, đặc biệt:
> - `README.md`
> - `01-tong-quan-du-an.md`
> - `02-kien-truc-va-pham-vi-v1.md`
> - `03-hien-trang-va-ket-qua.md`
> - `04-danh-muc-nhiem-vu.md`
> - `05-rui-ro-va-diem-chua-xac-minh.md`
>
> Sau đó kiểm tra trạng thái hiện tại của GitHub, Supabase và Vercel; không coi ảnh chụp trạng thái cũ là hiện trạng mới. Khôi phục các quyết định nghiệp vụ, pháp lý, kiến trúc, dữ liệu, mã nguồn, nhánh, deployment, lỗi, kiểm thử, việc đã làm và việc còn dang dở.
>
> Giữ nguyên phạm vi V1: hỗ trợ công chức thẩm định hồ sơ cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP thuộc phạm vi quản lý của ngành nông nghiệp. AI chỉ hỗ trợ đọc, trích xuất, đối chiếu, phát hiện thiếu/mâu thuẫn và dự thảo; công chức và người có thẩm quyền xác minh, kết luận, quyết định. Không tự động cấp/từ chối cấp giấy, ký hoặc xử phạt. Giao diện tiếng Việt có dấu. Chỉ dùng pháp luật Việt Nam hiện hành làm căn cứ nghiệp vụ.
>
> Phân biệt rõ: đã thiết kế, đã lập trình, đã triển khai, đã kiểm thử và đã nghiệm thu. Không tự suy diễn, không tạo căn cứ pháp lý hoặc kết quả kiểm thử. Thiếu tài liệu không đồng nghĩa sự việc không xảy ra.
>
> Được chủ động đọc, kiểm tra, phân tích. Không tự ý ghi mã nguồn, tạo/sửa migration, thay đổi schema/dữ liệu/quyền/cấu hình, triển khai, hợp nhất nhánh hoặc xóa tài nguyên nếu chưa được tôi phê duyệt cụ thể.
>
> Ưu tiên tiếp tục các vấn đề P0 đã ghi nhận: quy trình/SOP và căn cứ pháp lý V1; liên kết hồ sơ–đánh giá–bằng chứng; OCR theo trang có xác nhận; RLS/Storage/grants/RPC; kiểm thử truy cập chéo; quy tắc và trạng thái đánh giá; kiểm thử đầu-cuối.
>
> Sau khi tiếp nhận, báo cáo: (A) toàn cảnh và nguyên tắc; (B) việc đã hoàn thành kèm bằng chứng; (C) việc đang làm/tồn đọng; (D) rủi ro và điểm chưa xác minh; (E) nhiệm vụ kế tiếp. Sau đó bắt đầu nhiệm vụ kế tiếp trong phạm vi quyền được cấp. Không yêu cầu tôi nhắc lại thông tin đã có. Nếu thiếu quyền hoặc tài liệu, nêu rõ và tiếp tục phần đã xác minh.

---

## 2. Danh tính và phạm vi dự án

- **Tên:** DocuGuard AI — Công chức điện tử hỗ trợ thẩm định hồ sơ ATTP.
- **Repository:** `congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban`
- **Supabase project:** `nresxqsvdhzqoetsvhhr` — `cong-chuc-tham-dinh-attp-dev`
- **Vercel Project ID:** `prj_Hr9W88C9hproqcHfYwLS8plQQtRT`
- **Phạm vi V1:** hồ sơ ATTP thuộc ngành nông nghiệp quản lý.
- **Nguyên tắc:** AI hỗ trợ; con người chịu trách nhiệm xác minh và quyết định.

Không lưu mật khẩu, API key, JWT, service-role key hoặc dữ liệu hồ sơ cá nhân/doanh nghiệp thật trong tài liệu bàn giao.

## 3. Quyết định nghiệp vụ không được tự ý thay đổi

1. V1 tập trung vào thẩm định hồ sơ đề nghị cấp Giấy chứng nhận cơ sở đủ điều kiện ATTP.
2. Chỉ áp dụng cho nhóm ngành hàng/hoạt động thuộc phạm vi quản lý của ngành nông nghiệp.
3. Không mở rộng sang lĩnh vực Y tế hoặc Công Thương trong V1.
4. Không đưa thanh tra hiện trường, cưỡng chế, xử phạt, cổng tiếp nhận công dân/doanh nghiệp hoặc quản trị doanh nghiệp vào luồng V1.
5. AI không thay thế công chức/người có thẩm quyền; không tự ra quyết định hành chính.
6. Không dùng điểm số rủi ro thay thế điều kiện pháp lý.
7. Mọi nhận định phải truy nguyên được tới căn cứ, tài liệu, vị trí thông tin và giới hạn chứng minh.
8. Thiếu dữ liệu phải thể hiện là chưa có tài liệu chứng minh/chưa đủ căn cứ/cần xác minh, không được suy diễn thành vi phạm hoặc không tồn tại sự việc.
9. Toàn bộ giao diện công chức bằng tiếng Việt có dấu.
10. Không xóa hoặc làm mất mã nguồn, dữ liệu, nhánh hoặc phân hệ ngoài V1; chỉ tạm không đưa vào luồng V1 sau khi đánh giá phụ thuộc.

## 4. Bốn trạng thái hỗ trợ

- `ĐẠT`
- `KHÔNG ĐẠT`
- `CHƯA ĐỦ CĂN CỨ`
- `CẦN XÁC MINH`

Đây là trạng thái hỗ trợ nghiệp vụ, không phải quyết định hành chính chính thức.

## 5. Trạng thái nền tảng đã biết — phải kiểm tra lại trước khi hành động

### GitHub

Repository: `congviecqlcl-dotcom/phan-mem-tham-dinh-van-ban`

Các nhánh từng được ghi nhận gồm:
- `main`
- `feature/admin-role-management-v1`
- `feature/attp-dossier-review-v1`
- `feature/docuguard-v2-hardening`
- `safety-review/attp-audit-hardening`
- `safety-review/legal-rule-warnings`
- `security/supabase-auth-implementation`
- `security/supabase-auth-integration-plan`
- `work/attp-ocr-integration-20261111`
- `docs/project-consolidation-20261118`

**Nhánh tài liệu bàn giao:** `docs/project-consolidation-20261118`.

Tại lần kiểm tra ngày 18/11/2026, nhánh tài liệu có các tệp:
- `docs/du-an/README.md`
- `docs/du-an/01-tong-quan-du-an.md`
- `docs/du-an/02-kien-truc-va-pham-vi-v1.md`
- `docs/du-an/03-hien-trang-va-ket-qua.md`
- `docs/du-an/04-danh-muc-nhiem-vu.md`
- `docs/du-an/05-rui-ro-va-diem-chua-xac-minh.md`

Commit được quan sát gần nhất khi kiểm tra danh mục nhánh: `a90c0ff377643f1d01d356f5b6f014a12a494ca7` (commit ghi nhận tài liệu rủi ro). Đây là nhánh tài liệu riêng, không phải `main`; chưa được coi là đã hợp nhất hoặc phát hành.

### Vercel

Deployment Preview từng quan sát ngày 17/11/2026:
- Deployment: `dpl_9p1Csy57ZdYdb6cUHqMgmykDuAFi`
- Branch: `work/attp-ocr-integration-20261111`
- Commit: `579957b8bfe7a53d9da913a09bce114732e4791f`
- State: `READY`
- SSO protection: bật.

`READY` chỉ xác nhận trạng thái build/deploy của Preview, không chứng minh kiểm thử nghiệp vụ, bảo mật hoặc nghiệm thu. Không suy diễn Preview là Production đang hoạt động.

### Supabase

- Project ID: `nresxqsvdhzqoetsvhhr`
- Tên: `cong-chuc-tham-dinh-attp-dev`

Các số liệu schema, policy, bảng và bản ghi trong tài liệu `03-hien-trang-va-ket-qua.md` là ảnh chụp tại lần kiểm tra trước; phải truy vấn lại trước khi sửa.

## 6. Các phát hiện kỹ thuật quan trọng cần tiếp tục

### 6.1. Phân quyền và RLS

- Hàm `public.has_app_role(text[])` từng được ghi nhận là `SECURITY DEFINER`, `search_path=public`; ACL khi kiểm tra không cấp `EXECUTE` cho `authenticated`.
- Một số policy của `finding_support_links` và `finding_support_link_review_events` gọi hàm này.
- Không cấp quyền thực thi rộng chỉ để làm hết lỗi; phải xem xét quyền đọc bảng, ngữ cảnh RLS, recursion, `search_path`, owner và nguyên tắc quyền tối thiểu.

### 6.2. Storage và quyền đọc hồ sơ

- Bucket `attp-dossiers-private` là bucket riêng tư, giới hạn 25 MB.
- Policy đọc tài liệu từng có nhánh cho phép truy cập khi `owner_id=auth.uid()` hoặc thư mục đầu tiên khớp ID hồ sơ; nhánh thứ hai cần rà soát vì có thể chưa kiểm tra đầy đủ tư cách người dùng/quyền hồ sơ.
- Không sửa Storage riêng lẻ. Phải đối chiếu đồng bộ chính sách đọc hồ sơ, tài liệu, checklist, liên kết tài liệu và Storage.
- Chưa chốt chính sách dùng chung hồ sơ cho toàn bộ công chức hay phân tách theo người tạo/đơn vị. Phải xác định đúng nhu cầu nghiệp vụ trước khi thiết kế quyền.

### 6.3. OCR

- Đã phát hiện rủi ro luồng PDF OCR có trang lỗi/đọc cần rà soát nhưng nội dung một phần vẫn có thể được ghi vào `extracted_text` khi trạng thái là `NEEDS_OCR`.
- Cần tách lịch sử OCR theo lần chạy và theo trang; giữ bản gốc; ghi lỗi/độ tin cậy; gắn xác nhận với người và thời điểm.
- Chỉ nội dung OCR đã được công chức xác nhận mới được dùng làm đầu vào đánh giá.
- `attp_document_ocr_runs` và `attp_document_ocr_pages` là thiết kế được đề xuất, chưa xác nhận tồn tại trong DB.

### 6.4. RPC `record_finding_support_link_review`

- Hàm từng tham chiếu các cột `app_users.id` và `app_users.auth_user_id` không khớp schema đã quan sát (`user_id`, `display_name`, `is_active`, `created_at`).
- Cần xác minh lại schema và định nghĩa hàm hiện tại; thiết kế kiểm tra người dùng đang hoạt động, vai trò, quyền truy cập hồ sơ, mã quyết định, lý do/phạm vi/giới hạn.
- Nếu triển khai sau này, cần giao dịch nguyên tử, khóa dòng phù hợp, chống cập nhật đồng thời và lưu sự kiện lịch sử.
- Không cấp lại `EXECUTE` trước khi sửa, kiểm thử và được phê duyệt.

### 6.5. Kiểm thử

Các bài kiểm thử auth đã từng được ghi nhận gồm: thiếu bearer, thiếu cấu hình, người dùng không hoạt động, vai trò không cho phép, nhân sự hợp lệ và lỗi tra cứu vai trò. Chưa có bằng chứng đủ về kiểm thử xuyên suốt RLS/Storage/OCR truy cập chéo. Không được tuyên bố test pass nếu chưa chạy và lưu kết quả thực tế.

## 7. Dữ liệu thử nghiệm

Hai bộ dữ liệu từng được quan sát:
- `ATTP-GOLDFRUIT-2026-001`
- `ATTP-SXTT-TEST-001`

Đây là dữ liệu thử nghiệm, không phải hồ sơ thật hoặc kết luận pháp lý đã được phê duyệt. Mọi kết quả từ chúng phải được gắn nhãn thử nghiệm.

## 8. Thứ tự công việc kế tiếp

**P0 — phải xử lý trước khi coi V1 đủ an toàn để chạy thử nghiệp vụ:**

1. Chốt SOP thẩm định hồ sơ V1: đầu vào, thao tác công chức, đầu ra, căn cứ, người chịu trách nhiệm, ngoại lệ.
2. Kiểm kê căn cứ pháp lý từ nguồn chính thức: hiệu lực, sửa đổi, thay thế, chuyển tiếp, thẩm quyền, phạm vi ngành hàng và thủ tục cụ thể.
3. Chuẩn hóa tiêu chí nguyên tử: căn cứ, đối tượng, điều kiện, chứng cứ cần có, cách kiểm tra, giới hạn chứng minh.
4. Đối chiếu toàn bộ SQL migration gốc với schema thực tế; hiện chưa có đủ SQL body để tuyên bố đã đối chiếu đủ.
5. Chốt mô hình liên kết `attp_dossiers` → `cases`/`case_versions`/`assessment_runs` và tài liệu → evidence.
6. Hoàn thiện thiết kế OCR theo trang và xác nhận.
7. Rà soát đồng bộ Auth/API/RLS/grants/Storage/RPC; kiểm thử truy cập chéo.
8. Chuẩn hóa rule/method có phiên bản và phê duyệt; không dùng quy tắc `DRAFT` cho kết quả chính thức.
9. Kiểm thử đủ bốn trạng thái hỗ trợ, OCR lỗi/thiếu trang, tài liệu mâu thuẫn, hồ sơ sửa đổi.
10. Chỉ sau khi có thiết kế tác động, phương án rollback, test case và phê duyệt mới tạo migration/sửa mã/đổi quyền.

**P1 — sau khi P0 đạt:**
- Dự thảo báo cáo tiếng Việt theo mẫu được duyệt.
- Nhật ký thao tác và phiên bản.
- Hướng dẫn công chức và quản trị.
- Chạy thử có giám sát, lập biên bản nghiệm thu và danh sách giới hạn.

## 9. Quyền thao tác và cơ chế phê duyệt

Được chủ động:
- Đọc repository, nhánh, commit, mã nguồn, issue, workflow và deployment.
- Đọc schema, policy, function, logs và dữ liệu cần thiết trong Supabase nếu quyền kết nối cho phép.
- Đọc trạng thái Vercel, Preview, build và logs.
- Phân tích, đề xuất thiết kế, lập checklist, test case và tài liệu.

Cần phê duyệt cụ thể trước khi:
- Commit/push, tạo hoặc sửa file trên GitHub, mở PR, merge, đổi nhánh.
- Chạy SQL/migration, sửa schema, dữ liệu, policy, grants, RPC hoặc Storage.
- Thay đổi Auth, secrets, biến môi trường hoặc cấu hình.
- Deploy, promote Production, rollback hoặc xóa tài nguyên.

Không bao giờ:
- Đưa secrets vào tài liệu, chat, log hoặc mã frontend.
- Tự ký, tự quyết định hành chính, tự cấp/từ chối giấy.
- Xóa dữ liệu/nhánh/migration chỉ vì chưa dùng.
- Dùng pháp luật nước ngoài làm căn cứ nghiệp vụ V1.

## 10. Quy tắc cập nhật hồ sơ bàn giao

Sau mỗi giai đoạn:
1. Ghi ngày giờ và nguồn kiểm tra.
2. Ghi rõ thao tác chỉ đọc hay có thay đổi.
3. Ghi commit SHA, deployment ID, migration version hoặc mã kiểm thử nếu có.
4. Phân loại trạng thái: Chưa bắt đầu / Đang thực hiện / Chờ xác minh / Đã triển khai / Đã kiểm thử / Đã nghiệm thu.
5. Ghi vấn đề mới, quyết định mới và việc kế tiếp.
6. Không đánh dấu hoàn thành chỉ vì đã thảo luận hoặc đã viết thiết kế.
7. Không ghi thông tin bí mật hoặc dữ liệu hồ sơ thật.

---

**Nguyên tắc tối cao:** Tiếp tục một dự án duy nhất, giữ nguyên quyết định đã thống nhất, kiểm tra hiện trạng trước khi hành động, có bằng chứng cho mọi tuyên bố và không thực hiện thay đổi ngoài quyền được phê duyệt.
