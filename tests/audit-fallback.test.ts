import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createLocalFallbackResponse,
  LOCAL_FALLBACK_NOTICE,
} from "../server/audit-fallback";

describe("createLocalFallbackResponse", () => {
  it("marks a local-rule fallback as not successful AI audit", () => {
    const auditResult = { status: "CAN_XAC_MINH" };
    const result = createLocalFallbackResponse("doc-1", "ho-so.pdf", auditResult);

    assert.equal(result.success, false);
    assert.equal(result.source, "local_fallback");
    assert.equal(result.sourceNotice, LOCAL_FALLBACK_NOTICE);
    assert.equal(result.auditResult, auditResult);
    assert.equal(result.id, "doc-1");
    assert.equal(result.name, "ho-so.pdf");
  });

  it("preserves missing identifiers without changing the fallback source", () => {
    const result = createLocalFallbackResponse(undefined, undefined, null);

    assert.equal(result.success, false);
    assert.equal(result.source, "local_fallback");
    assert.equal(result.id, undefined);
    assert.equal(result.name, undefined);
    assert.equal(result.auditResult, null);
  });
});
