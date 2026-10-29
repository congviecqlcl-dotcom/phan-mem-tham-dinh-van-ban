const SESSION_KEY = "docuguard.auth.session";

type AuthSession = { access_token: string; refresh_token?: string; expires_at?: number };
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function requireAuthConfig(): { url: string; anonKey: string } {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Chưa cấu hình kết nối xác thực. Quản trị viên cần thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.");
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

export function getAccessToken(): string | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (!session.access_token) return null;
    return session.access_token;
  } catch {
    return null;
  }
}

export function getAuthConfig() {
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

const PKCE_VERIFIER_KEY = "docuguard.auth.pkce.verifier";
const PKCE_FLOW_KEY = "docuguard.auth.pkce.flow";

export async function requestEmailMagicLink(email: string): Promise<void> {
  const { url, anonKey } = requireAuthConfig();
  const redirectTo = window.location.origin;
  const { verifier, challenge } = await createPkcePair();
  localStorage.setItem(PKCE_VERIFIER_KEY, verifier);
  localStorage.setItem(PKCE_FLOW_KEY, "login");

  const response = await fetch(`${url}/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anonKey },
    body: JSON.stringify({
      email,
      create_user: false,
      code_challenge: challenge,
      code_challenge_method: "s256",
    }),
  });

  if (!response.ok) {
    localStorage.removeItem(PKCE_VERIFIER_KEY);
    localStorage.removeItem(PKCE_FLOW_KEY);
    const data = await response.json().catch(() => ({}));
    const detail = typeof data.message === "string" ? data.message : typeof data.msg === "string" ? data.msg : "";
    const normalizedDetail = detail.toLowerCase();
    if (response.status === 429 || normalizedDetail.includes("rate limit") || normalizedDetail.includes("too many")) {
      throw new Error("Supabase đang giới hạn số email gửi. Vui lòng tạm dừng yêu cầu và thử lại sau; không bấm gửi liên tục.");
    }
    if (normalizedDetail.includes("redirect") || normalizedDetail.includes("allow list")) {
      throw new Error("Địa chỉ Preview chưa được cho phép nhận liên kết đăng nhập. Quản trị viên cần kiểm tra URL Configuration trong Supabase Auth.");
    }
    if (response.status === 400 && (normalizedDetail.includes("user not found") || normalizedDetail.includes("signup") || normalizedDetail.includes("not allowed"))) {
      throw new Error("Không tìm thấy tài khoản được cấp quyền hoặc tài khoản chưa được tạo trong Supabase Auth. Vui lòng liên hệ quản trị viên.");
    }
    throw new Error("Supabase chưa gửi được liên kết đăng nhập. Hãy kiểm tra cấu hình Auth và log lỗi; chỉ tài khoản đã được quản trị viên tạo mới đăng nhập được.");
  }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createPkcePair(): Promise<{ verifier: string; challenge: string }> {
  const random = crypto.getRandomValues(new Uint8Array(32));
  const verifier = toBase64Url(random);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return { verifier, challenge: toBase64Url(new Uint8Array(digest)) };
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { url, anonKey } = requireAuthConfig();
  const redirectTo = window.location.origin;
  const { verifier, challenge } = await createPkcePair();
  localStorage.setItem(PKCE_VERIFIER_KEY, verifier);
  localStorage.setItem(PKCE_FLOW_KEY, "recovery");
  const response = await fetch(`${url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anonKey },
    body: JSON.stringify({ email, code_challenge: challenge, code_challenge_method: "s256" }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const detail = typeof data.message === "string" ? data.message : typeof data.msg === "string" ? data.msg : "";
    if (detail.toLowerCase().includes("redirect") || detail.toLowerCase().includes("allow list")) {
      throw new Error("Địa chỉ ứng dụng chưa được cho phép nhận liên kết đặt lại mật khẩu. Quản trị viên cần bổ sung URL Preview trong Supabase Auth > URL Configuration.");
    }
    throw new Error("Chưa gửi được yêu cầu đặt lại mật khẩu. Vui lòng thử lại hoặc liên hệ quản trị viên.");
  }
}

export type AuthCallbackResult = { kind: "login" | "recovery"; token: string };

export async function resolveAuthCallback(): Promise<AuthCallbackResult | null> {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const url = new URL(window.location.href);

  // Supabase may return recovery credentials in the URL fragment (implicit flow)
  // or in the query string depending on the project's Auth configuration.
  const recoveryType = hash.get("type") === "recovery" || url.searchParams.get("type") === "recovery";
  const recoveryToken = hash.get("access_token") || url.searchParams.get("access_token");
  if (recoveryType && recoveryToken) {
    return { kind: "recovery", token: recoveryToken };
  }

  // Surface callback errors instead of silently falling back to the login form.
  const callbackError = url.searchParams.get("error_description") || url.searchParams.get("error");
  if (callbackError) {
    throw new Error("Liên kết khôi phục không hoàn tất hoặc đã hết hạn. Hãy yêu cầu quản trị viên gửi lại sau khi kiểm tra cấu hình chuyển hướng.");
  }

  const code = url.searchParams.get("code");
  if (!code) return null;

  const verifier = localStorage.getItem(PKCE_VERIFIER_KEY);
  if (!verifier) {
    throw new Error("Không tìm thấy thông tin xác minh của liên kết email. Hãy yêu cầu gửi liên kết mới và mở trên cùng trình duyệt.");
  }

  const flow = localStorage.getItem(PKCE_FLOW_KEY) || "recovery";
  const { url: supabaseUrl, anonKey } = requireAuthConfig();
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anonKey },
    body: JSON.stringify({ auth_code: code, code_verifier: verifier }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.access_token !== "string") {
    localStorage.removeItem(PKCE_VERIFIER_KEY);
    localStorage.removeItem(PKCE_FLOW_KEY);
    throw new Error("Liên kết email không hợp lệ hoặc đã hết hạn. Hãy yêu cầu gửi liên kết mới.");
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data as AuthSession));
  localStorage.removeItem(PKCE_VERIFIER_KEY);
  localStorage.removeItem(PKCE_FLOW_KEY);
  url.searchParams.delete("code");
  window.history.replaceState(null, document.title, url.pathname + url.search + url.hash);

  return { kind: flow === "login" ? "login" : "recovery", token: data.access_token };
}

export async function updatePasswordWithRecoveryToken(token: string, password: string): Promise<void> {
  const { url, anonKey } = requireAuthConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const detail = typeof data.message === "string" ? data.message : typeof data.msg === "string" ? data.msg : "";
    if (response.status === 401 || detail.toLowerCase().includes("expired") || detail.toLowerCase().includes("invalid")) {
      throw new Error("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Hãy yêu cầu gửi liên kết mới.");
    }
    throw new Error("Chưa cập nhật được mật khẩu. Vui lòng thử lại hoặc yêu cầu gửi liên kết mới.");
  }
  window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
}

export async function validateCurrentSession(): Promise<boolean> {
  const token = getAccessToken();
  if (!token || !supabaseUrl || !supabaseAnonKey) return false;
  try {
    const headers = { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` };
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers });
    if (!userResponse.ok) {
      signOut();
      return false;
    }

    const user = await userResponse.json() as { id?: unknown };
    if (typeof user.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(user.id)) {
      signOut();
      return false;
    }

    const [accountResponse, rolesResponse] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/app_users?user_id=eq.${encodeURIComponent(user.id)}&select=user_id,is_active&limit=1`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/user_roles?user_id=eq.${encodeURIComponent(user.id)}&select=role_code`, { headers }),
    ]);
    if (!accountResponse.ok || !rolesResponse.ok) {
      signOut();
      return false;
    }

    const accounts = await accountResponse.json() as Array<{ user_id: string; is_active: boolean }>;
    const roleRows = await rolesResponse.json() as Array<{ role_code: string }>;
    const hasValidRole = roleRows.some((row) =>
      row.role_code === "CONG_CHUC" || row.role_code === "LANH_DAO" || row.role_code === "QUAN_TRI",
    );
    if (accounts.length !== 1 || accounts[0].is_active !== true || !hasValidRole) {
      signOut();
      return false;
    }
    return true;
  } catch {
    // A failed validation must not grant access to protected UI.
    signOut();
    return false;
  }
}

export function signOut(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
