const SESSION_KEY = "docuguard.auth.session";

type AuthSession = { access_token: string; refresh_token?: string; expires_at?: number };
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Chưa cấu hình kết nối xác thực. Quản trị viên cần thiết lập VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.");
  }
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: supabaseAnonKey },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.access_token !== "string") {
    throw new Error("Đăng nhập không thành công. Hãy kiểm tra email, mật khẩu hoặc liên hệ quản trị viên.");
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data as AuthSession));
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
