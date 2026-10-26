import type { NextFunction, Request, Response } from "express";

export type AppRole = "CONG_CHUC" | "LANH_DAO" | "QUAN_TRI";

export interface AuthenticatedRequest extends Request {
  authenticatedUser?: { id: string; roles: AppRole[] };
}

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

function authUnavailable(res: Response) {
  return res.status(503).json({
    error: "Dịch vụ xác thực chưa được cấu hình đầy đủ. Vui lòng liên hệ quản trị hệ thống.",
  });
}

/**
 * Validate the bearer token with Supabase Auth, then read the active account
 * and role assignments under the user's own JWT (never trust client-supplied roles).
 * Fail closed if configuration, identity, account status, or role lookup is unavailable.
 */
export function requireAppRole(allowedRoles: AppRole[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return authUnavailable(res);

    const authorization = req.header("authorization") || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({ error: "Bạn cần đăng nhập để sử dụng chức năng này." });
    }

    try {
      const token = match[1];
      const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000),
      });
      if (!userResponse.ok) {
        return res.status(401).json({ error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại." });
      }

      const user = await userResponse.json() as { id?: unknown };
      if (typeof user.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(user.id)) {
        return res.status(401).json({ error: "Không xác định được tài khoản đăng nhập." });
      }

      const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` };
      const [accountResponse, rolesResponse] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/app_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id,is_active&limit=1`, {
          headers, signal: AbortSignal.timeout(5000),
        }),
        fetch(`${SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${encodeURIComponent(user.id)}&select=role_code`, {
          headers, signal: AbortSignal.timeout(5000),
        }),
      ]);

      if (!accountResponse.ok || !rolesResponse.ok) {
        console.error("Không thể xác minh trạng thái hoặc vai trò tài khoản qua Supabase.");
        return res.status(503).json({ error: "Không thể xác minh quyền truy cập lúc này. Vui lòng thử lại sau." });
      }

      const accounts = await accountResponse.json() as Array<{ user_id: string; is_active: boolean }>;
      const roleRows = await rolesResponse.json() as Array<{ role_code: string }>;
      if (accounts.length !== 1 || accounts[0].is_active !== true) {
        return res.status(403).json({ error: "Tài khoản chưa được kích hoạt hoặc đã bị khóa." });
      }

      const validRoles = roleRows.map((row) => row.role_code).filter(
        (role): role is AppRole => role === "CONG_CHUC" || role === "LANH_DAO" || role === "QUAN_TRI",
      );
      if (!validRoles.some((role) => allowedRoles.includes(role))) {
        return res.status(403).json({ error: "Tài khoản chưa được cấp quyền sử dụng chức năng này." });
      }

      req.authenticatedUser = { id: user.id, roles: validRoles };
      return next();
    } catch {
      console.error("Dịch vụ xác thực Supabase không phản hồi hoặc xảy ra lỗi kết nối.");
      return res.status(503).json({ error: "Không thể xác minh quyền truy cập lúc này. Vui lòng thử lại sau." });
    }
  };
}
