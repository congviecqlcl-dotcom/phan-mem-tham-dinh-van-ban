import { describe, expect, it } from "bun:test";
import {
  createLocalFallbackResponse,
  LOCAL_FALLBACK_NOTICE,
} from "../server/audit-fallback";

describe("createLocalFallbackResponse", () => {
  it("marks a local-rule fallback as not successful AI audit", () => {
    const auditResult = { status: "CAN_XAC_MINH" };
    const result = createLocalFallbackResponse("doc-1", "ho-so.pdf", auditResult);

    expect(result.success).toBe(false);
    expect(result.source).toBe("local_fallback");
    expect(result.sourceNotice).toBe(LOCAL_FALLBACK_NOTICE);
    expect(result.auditResult).toBe(auditResult);
    expect(result.id).toBe("doc-1");
    expect(result.name).toBe("ho-so.pdf");
  });

  it("preserves missing identifiers without changing the fallback source", () => {
    const result = createLocalFallbackResponse(undefined, undefined, null);

    expect(result.success).toBe(false);
    expect(result.source).toBe("local_fallback");
    expect(result.id).toBeUndefined();
    expect(result.name).toBeUndefined();
    expect(result.auditResult).toBeNull();
  });
});
