import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getLocalChatResponse } from "../src/utils/chatEngine";

describe("getLocalChatResponse", () => {
  it("fails closed when legal AI is unavailable", () => {
    const response = getLocalChatResponse("Thông tư 17/2024 quy định thời hạn bao nhiêu ngày?");

    assert.match(response, /Chưa đủ căn cứ để xác nhận nội dung pháp lý/);
    assert.match(response, /không thực hiện tra cứu văn bản pháp luật trực tiếp/);
    assert.match(response, /nguồn chính thức/);
    assert.match(response, /công chức có thẩm quyền phải kiểm tra và quyết định/);
    assert.doesNotMatch(response, /15 ngày làm việc|30 ngày|Điều 12 Nghị định 15\/2018/);
  });

  it("returns the same cautious fallback regardless of the question", () => {
    assert.equal(
      getLocalChatResponse("Thông tư 17/2024"),
      getLocalChatResponse("Nghị định 30/2020"),
    );
  });
});
