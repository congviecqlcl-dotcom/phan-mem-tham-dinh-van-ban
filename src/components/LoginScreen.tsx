import React, { useEffect, useState } from "react";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import {
  resolveRecoveryAccessToken,
  requestPasswordReset,
  signInWithPassword,
  updatePasswordWithRecoveryToken,
} from "../utils/auth";

type Props = { onSignedIn: () => void };

export const LoginScreen: React.FC<Props> = ({ onSignedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);
  const [resolvingRecovery, setResolvingRecovery] = useState(() => new URLSearchParams(window.location.search).has("code"));
  const [forgotMode, setForgotMode] = useState(false);

  useEffect(() => {
    let active = true;
    resolveRecoveryAccessToken()
      .then((token) => { if (active) setRecoveryToken(token); })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Không thể xác minh liên kết đặt lại mật khẩu.");
      })
      .finally(() => { if (active) setResolvingRecovery(false); });
    return () => { active = false; };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (recoveryToken) {
        if (password.length < 8) {
          throw new Error("Mật khẩu mới cần có ít nhất 8 ký tự.");
        }
        if (password !== confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp.");
        }
        await updatePasswordWithRecoveryToken(recoveryToken, password);
        setRecoveryToken(null);
        setPassword("");
        setConfirmPassword("");
        setForgotMode(false);
        setNotice("Đã cập nhật mật khẩu. Bạn có thể đăng nhập bằng mật khẩu mới.");
      } else if (forgotMode) {
        await requestPasswordReset(email.trim());
        setNotice("Nếu email này thuộc tài khoản đã đăng ký, hướng dẫn đặt lại mật khẩu sẽ được gửi đến hộp thư. Hãy kiểm tra cả thư rác.");
      } else {
        await signInWithPassword(email.trim(), password);
        onSignedIn();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thực hiện yêu cầu lúc này.");
    } finally {
      setBusy(false);
    }
  };

  const title = resolvingRecovery ? "Đang xác minh liên kết" : recoveryToken ? "Đặt mật khẩu mới" : forgotMode ? "Quên mật khẩu" : "Đăng nhập hệ thống";

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-700 p-3 text-white"><LockKeyhole className="h-5 w-5" /></div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">{title}</h1>
            <p className="text-sm text-neutral-500">Công cụ hỗ trợ thẩm định hồ sơ ATTP</p>
          </div>
        </div>
        {resolvingRecovery && <p role="status" className="text-sm text-neutral-600">Đang xác minh liên kết đặt lại mật khẩu...</p>}
        {!resolvingRecovery && !recoveryToken && (
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700">Email công vụ</label>
            <input id="login-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30" />
          </div>
        )}
        {!resolvingRecovery && (!forgotMode || recoveryToken) && (
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700">{recoveryToken ? "Mật khẩu mới (ít nhất 8 ký tự)" : "Mật khẩu"}</label>
            <input id="login-password" type="password" autoComplete={recoveryToken ? "new-password" : "current-password"} required minLength={recoveryToken ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30" />
          </div>
        )}
        {!resolvingRecovery && recoveryToken && (
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700">Nhập lại mật khẩu mới</label>
            <input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30" />
          </div>
        )}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
        <button type="submit" disabled={busy || resolvingRecovery} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {busy ? "Đang xử lý..." : recoveryToken ? "Cập nhật mật khẩu" : forgotMode ? "Gửi hướng dẫn đặt lại" : "Đăng nhập"}
        </button>
        {!resolvingRecovery && !recoveryToken && (
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => { setForgotMode(!forgotMode); setError(""); setNotice(""); }} className="font-medium text-emerald-800 underline underline-offset-2">
              {forgotMode ? "Quay lại đăng nhập" : "Quên mật khẩu?"}
            </button>
          </div>
        )}
        {!resolvingRecovery && !recoveryToken && !forgotMode && <p className="text-xs leading-relaxed text-neutral-500">Chỉ tài khoản đã được kích hoạt và cấp vai trò mới được sử dụng chức năng thẩm định. Không gửi mật khẩu cho người khác.</p>}
      </form>
    </main>
  );
};
