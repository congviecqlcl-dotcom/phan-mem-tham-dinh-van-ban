import React, { useEffect, useState } from "react";
import { Mail, LoaderCircle } from "lucide-react";
import {
  resolveAuthCallback,
  requestEmailMagicLink,
  updatePasswordWithRecoveryToken,
  validateCurrentSession,
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
  const [resolvingCallback, setResolvingCallback] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return query.has("code") ||
      query.get("type") === "recovery" ||
      query.has("access_token") ||
      hash.get("type") === "recovery" ||
      hash.has("access_token");
  });

  useEffect(() => {
    let active = true;
    resolveAuthCallback()
      .then(async (result) => {
        if (!active || !result) return;
        if (result.kind === "recovery") {
          setRecoveryToken(result.token);
          return;
        }
        const allowed = await validateCurrentSession();
        if (!active) return;
        if (allowed) {
          onSignedIn();
        } else {
          setError("Tài khoản chưa được quản trị viên kích hoạt hoặc chưa được cấp vai trò. Vui lòng liên hệ quản trị viên hệ thống.");
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Không thể xác minh liên kết email.");
      })
      .finally(() => { if (active) setResolvingCallback(false); });
    return () => { active = false; };
  }, [onSignedIn]);

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
        setNotice("Đã cập nhật mật khẩu. Đăng nhập thông thường vẫn thực hiện bằng liên kết gửi qua email.");
      } else {
        await requestEmailMagicLink(email.trim());
        setNotice("Nếu email thuộc tài khoản đã được quản trị viên cấp, liên kết đăng nhập sẽ được gửi đến hộp thư. Hãy kiểm tra cả thư rác.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thực hiện yêu cầu lúc này.");
    } finally {
      setBusy(false);
    }
  };

  const title = resolvingCallback ? "Đang xác minh liên kết" : recoveryToken ? "Đặt mật khẩu mới" : "Đăng nhập hệ thống";

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-700 p-3 text-white"><Mail className="h-5 w-5" /></div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">{title}</h1>
            <p className="text-sm text-neutral-500">Công cụ hỗ trợ thẩm định hồ sơ ATTP</p>
          </div>
        </div>

        {resolvingCallback && <p role="status" className="text-sm text-neutral-600">Đang xác minh liên kết email...</p>}

        {!resolvingCallback && !recoveryToken && (
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700">Email công vụ</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
            <p className="text-xs leading-relaxed text-neutral-500">Chỉ tài khoản do quản trị viên tạo, kích hoạt và cấp vai trò mới được sử dụng hệ thống. Không có chức năng tự đăng ký.</p>
          </div>
        )}

        {!resolvingCallback && recoveryToken && (
          <>
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700">Mật khẩu mới (ít nhất 8 ký tự)</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700">Nhập lại mật khẩu mới</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>
          </>
        )}

        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}

        {!resolvingCallback && (
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {busy ? "Đang xử lý..." : recoveryToken ? "Cập nhật mật khẩu" : "Gửi liên kết đăng nhập"}
          </button>
        )}
      </form>
    </main>
  );
};
