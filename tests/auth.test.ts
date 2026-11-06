import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { requireAppRole } from "../server/auth";

const originalFetch = globalThis.fetch;
const originalUrl = process.env.SUPABASE_URL;
const originalKey = process.env.SUPABASE_ANON_KEY;
const userId = "12345678-1234-1234-1234-123456789abc";

function mockResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function runMiddleware(authorization?: string) {
  const req = {
    header: (name: string) => name.toLowerCase() === "authorization" ? authorization : undefined,
  } as any;
  let statusCode = 200;
  let body: any;
  let nextCalled = false;
  const res = {
    status(code: number) { statusCode = code; return this; },
    json(value: unknown) { body = value; return this; },
  } as any;
  const next = () => { nextCalled = true; };
  return {
    promise: requireAppRole(["CONG_CHUC"])(req, res, next),
    get statusCode() { return statusCode; },
    get body() { return body; },
    get nextCalled() { return nextCalled; },
    req,
  };
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = originalUrl;
  if (originalKey === undefined) delete process.env.SUPABASE_ANON_KEY;
  else process.env.SUPABASE_ANON_KEY = originalKey;
});

describe("requireAppRole", () => {
  it("rejects requests without a bearer token", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "public-test-key";
    const result = runMiddleware();
    await result.promise;
    assert.equal(result.statusCode, 401);
    assert.equal(result.nextCalled, false);
  });

  it("fails closed when Supabase is not configured", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    const result = runMiddleware("Bearer test-token");
    await result.promise;
    assert.equal(result.statusCode, 503);
    assert.equal(result.nextCalled, false);
  });

  it("rejects an inactive account", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "public-test-key";
    globalThis.fetch = async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/auth/v1/user")) return mockResponse(200, { id: userId });
      if (url.includes("/rest/v1/app_users")) return mockResponse(200, [{ user_id: userId, is_active: false }]);
      if (url.includes("/rest/v1/user_roles")) return mockResponse(200, [{ role_code: "CONG_CHUC" }]);
      return mockResponse(404, {});
    };
    const result = runMiddleware("Bearer valid-test-token");
    await result.promise;
    assert.equal(result.statusCode, 403);
    assert.equal(result.nextCalled, false);
  });

  it("rejects users without an allowed role", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "public-test-key";
    globalThis.fetch = async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/auth/v1/user")) return mockResponse(200, { id: userId });
      if (url.includes("/rest/v1/app_users")) return mockResponse(200, [{ user_id: userId, is_active: true }]);
      if (url.includes("/rest/v1/user_roles")) return mockResponse(200, [{ role_code: "KHACH" }]);
      return mockResponse(404, {});
    };
    const result = runMiddleware("Bearer valid-test-token");
    await result.promise;
    assert.equal(result.statusCode, 403);
    assert.equal(result.nextCalled, false);
  });

  it("continues only for an active user with an allowed role", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "public-test-key";
    globalThis.fetch = async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/auth/v1/user")) return mockResponse(200, { id: userId });
      if (url.includes("/rest/v1/app_users")) return mockResponse(200, [{ user_id: userId, is_active: true }]);
      if (url.includes("/rest/v1/user_roles")) return mockResponse(200, [{ role_code: "CONG_CHUC" }]);
      return mockResponse(404, {});
    };
    const result = runMiddleware("Bearer valid-test-token");
    await result.promise;
    assert.equal(result.statusCode, 200);
    assert.equal(result.nextCalled, true);
    assert.deepEqual(result.req.authenticatedUser, { id: userId, roles: ["CONG_CHUC"] });
  });

  it("returns 503 rather than granting access when role lookup fails", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "public-test-key";
    globalThis.fetch = async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/auth/v1/user")) return mockResponse(200, { id: userId });
      if (url.includes("/rest/v1/app_users")) return mockResponse(200, [{ user_id: userId, is_active: true }]);
      return mockResponse(403, { message: "RLS denied" });
    };
    const result = runMiddleware("Bearer valid-test-token");
    await result.promise;
    assert.equal(result.statusCode, 503);
    assert.equal(result.nextCalled, false);
  });
});
