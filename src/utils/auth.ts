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

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const { url, anonKey } = requireAuthConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anonKey },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.access_token !== "string") {
    // Keep the message generic so the UI does not disclose account existence.
    throw new Error("Đăng nhập không thành công. Hãy kiểm tra email, mật khẩu hoặc dùng chức năng quên mật khẩu.");
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data as AuthSession));
}

const PKCE_VERIFIER_KEY = "docuguard.auth.pkce.verifier";

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

export async function resolveRecoveryAccessToken(): Promise<string | null> {
  try {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hash.get("type") === "recovery" && hash.get("access_token")) {
      return hash.get("access_token");
    }

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return null;

    const verifier = localStorage.getItem(PKCE_VERIFIER_KEY);
    if (!verifier) {
      throw new Error("Không tìm thấy thông tin xác minh của liên kết đặt lại mật khẩu. Hãy yêu cầu gửi liên kết mới trên cùng trình duyệt.");
    }

    const { url: supabaseUrl, anonKey } = requireAuthConfig();
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: anonKey },
      body: JSON.stringify({ auth_code: code, code_verifier: verifier }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || typeof data.access_token !== "string") {
      localStorage.removeItem(PKCE_VERIFIER_KEY);
      throw new Error("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Hãy yêu cầu gửi liên kết mới.");
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data as AuthSession));
    sessionStorage.removeItem(PKCE_VERIFIER_KEY);
    url.searchParams.delete("code");
    window.history.replaceState(null, document.title, url.pathname + url.search + url.hash);
    return data.access_token;
  } catch (error) {
    throw error;
  }
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
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    if (response.ok) return true;
  } catch {
    // A failed validation must not grant access to protected UI.
  }
  signOut();
  return false;
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
