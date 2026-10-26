import React, { useState } from "react";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import { signInWithPassword } from "../utils/auth";

type Props = { onSignedIn: () => void };

export const LoginScreen: React.FC<Props> = ({ onSignedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await signInWithPassword(email.trim(), password);
      onSignedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đăng nhập lúc này.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-700 p-3 text-white"><LockKeyhole className="h-5 w-5" /></div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">Đăng nhập hệ thống</h1>
            <p className="text-sm text-neutral-500">Công cụ hỗ trợ thẩm định hồ sơ ATTP</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700">Email công vụ</label>
          <input id="login-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700">Mật khẩu</label>
          <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30" />
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {busy ? "Đang xác thực..." : "Đăng nhập"}
        </button>
        <p className="text-xs leading-relaxed text-neutral-500">Chỉ tài khoản đã được kích hoạt và cấp vai trò mới được sử dụng chức năng thẩm định. Không gửi mật khẩu cho người khác.</p>
      </form>
    </main>
  );
};
