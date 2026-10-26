import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runClientAuditEngine } from "../src/utils/auditEngine";

describe("legal heuristic warnings", () => {
  it("does not assert that a cited instrument is expired based on a keyword match", () => {
    const result = runClientAuditEngine(
      "Căn cứ Thông tư số 51/2014/TT-BNNPTNT để rà soát hồ sơ.",
      "cong_van",
    );
    const issue = result.issues.find((item) => item.id === "err-hieu-luc-van-ban");

    assert.ok(issue, "expected a review signal for the cited instrument");
    assert.equal(issue.severity, "warning");
    assert.match(issue.title, /Cần xác minh/i);
    assert.match(issue.explanation, /không đủ chứng minh/i);
  });

  it("does not assert that A/B/C classification is repealed from a phrase match alone", () => {
    const result = runClientAuditEngine(
      "Tài liệu lịch sử có nhắc đến xếp loại A, B, C.",
      "bien_ban",
    );
    const issue = result.issues.find((item) => item.id === "err-xeploai-tt17");

    assert.ok(issue, "expected a review signal for the classification phrase");
    assert.equal(issue.severity, "warning");
    assert.match(issue.title, /Cần xác minh/i);
    assert.match(issue.explanation, /không chứng minh/i);
  });
  
  it("treats missing extracted label text as a warning, not a confirmed violation", () => {
    const result = runClientAuditEngine(
      "Thực phẩm bảo vệ sức khỏe dạng viên bổ sung collagen 500 mg.",
      "nhan_hang_hoa",
    );
    const issue = result.issues.find((item) => item.id === "err-nhan-canh-bao-tpcn");

    assert.ok(issue, "expected a review signal for label inspection");
    assert.equal(issue.severity, "warning");
    assert.match(issue.title, /Cần kiểm tra/i);
    assert.match(issue.explanation, /chưa chứng minh/i);
  });

  it("treats potentially misleading advertising phrases as contextual review signals", () => {
    const result = runClientAuditEngine(
      "Bài viết phản bác câu quảng cáo ‘chữa khỏi hoàn toàn’; không khuyến nghị dùng thực phẩm thay thuốc.",
      "nhan_hang_hoa",
    );
    const issue = result.issues.find((item) => item.id === "err-quang-cao-tri-benh");

    assert.ok(issue, "expected a review signal for contextual assessment");
    assert.equal(issue.severity, "warning");
    assert.match(issue.title, /Cần xem xét ngữ cảnh/i);
    assert.match(issue.explanation, /không đủ chứng minh/i);
  });
});
