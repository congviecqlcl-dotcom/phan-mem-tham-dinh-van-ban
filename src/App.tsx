import React, { useCallback, useEffect, useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DocumentAuditor } from './components/DocumentAuditor';
import { ChatAssistant } from './components/ChatAssistant';
import { LegalExplorer } from './components/LegalExplorer';
import { TemplateGenerator } from './components/TemplateGenerator';
import { AdminUsers } from './components/AdminUsers';
import { LoginScreen } from './components/LoginScreen';
import { getAccessToken, signOut, validateCurrentSession, changeCurrentPassword, authenticatedFetch } from './utils/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('auditor');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let mounted = true;
    validateCurrentSession().then(async (valid) => {
      if (!mounted) return;
      setAuthenticated(valid);
      if (valid) {
        try {
          const response = await authenticatedFetch("/api/session");
          const payload = await response.json().catch(() => ({}));
          if (mounted && response.ok) setIsAdmin(Array.isArray(payload.roles) && payload.roles.includes("QUAN_TRI"));
        } catch {
          if (mounted) setIsAdmin(false);
        }
      }
      if (mounted) setCheckingSession(false);
    });
    return () => { mounted = false; };
  }, []);

  const handleSignedIn = useCallback(() => setAuthenticated(true), []);

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(''); setPasswordMessage('');
    if (newPassword.length < 12) { setPasswordError('Mật khẩu mới phải có ít nhất 12 ký tự.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Mật khẩu xác nhận không khớp.'); return; }
    if (newPassword === currentPassword) { setPasswordError('Mật khẩu mới phải khác mật khẩu hiện tại.'); return; }
    setSavingPassword(true);
    try { await changeCurrentPassword(currentPassword, newPassword); setPasswordMessage('Đã đổi mật khẩu thành công.'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
    catch (error) { setPasswordError(error instanceof Error ? error.message : 'Không đổi được mật khẩu.'); }
    finally { setSavingPassword(false); }
  };

  const handleSignOut = () => {
    signOut();
    setAuthenticated(false);
    setIsAdmin(false);
    setActiveTab('auditor');
  };

  if (checkingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-sm text-neutral-600">Đang kiểm tra phiên đăng nhập...</div>;
  }
  if (!authenticated || !getAccessToken()) {
    return <LoginScreen onSignedIn={handleSignedIn} />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col antialiased font-sans">
      <div className="flex items-center justify-end gap-3 bg-white px-4 py-2 border-b border-neutral-200 text-xs">
        <span className="text-neutral-500">Đã đăng nhập</span>
        <button onClick={handleSignOut} className="font-semibold text-emerald-800 underline">Đăng xuất</button>
      </div>
      {showPasswordForm && <form onSubmit={handlePasswordChange} className="mx-auto mt-4 w-full max-w-xl space-y-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-neutral-900">Đổi mật khẩu</h2>
        <label className="block text-sm">Mật khẩu hiện tại<input type="password" autoComplete="current-password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" /></label>
        <label className="block text-sm">Mật khẩu mới (ít nhất 12 ký tự)<input type="password" autoComplete="new-password" minLength={12} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" /></label>
        <label className="block text-sm">Nhập lại mật khẩu mới<input type="password" autoComplete="new-password" minLength={12} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2" /></label>
        {passwordError && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{passwordError}</p>}
        {passwordMessage && <p role="status" className="rounded bg-emerald-50 p-2 text-sm text-emerald-700">{passwordMessage}</p>}
        <button disabled={savingPassword} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-60">{savingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</button>
      </form>}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} canManageUsers={isAdmin} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'auditor' && <DocumentAuditor />}
        {activeTab === 'chat' && <ChatAssistant />}
        {activeTab === 'library' && <LegalExplorer />}
        {activeTab === 'templates' && <TemplateGenerator />}
        {activeTab === 'admin' && isAdmin && <AdminUsers />}
      </main>
      <footer className="bg-white border-t border-neutral-200 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-neutral-800 text-sm">DocuGuard AI</div>
            <div>Hệ thống chuyên gia kiểm tra & thẩm định văn bản ATTP và Thể thức hành chính</div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-neutral-600">
            <span>Cập nhật Thông tư 17/2024/TT-BNNPTNT</span><span>•</span><span>Nghị định 30/2020/NĐ-CP</span><span>•</span><span>NQ 202/2025 & NQ 1676/2025</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/congviecqlcl-dotcom/Ph-nmm-th-m-nh-vnbn-tr-c-khi-ph-th-nh" target="_blank" rel="noreferrer noopener" className="text-neutral-700 hover:text-neutral-900 font-medium underline underline-offset-2">GitHub Repository</a>
            <span>•</span>
            <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcongviecqlcl-dotcom%2FPh-nmm-th-m-nh-vnbn-tr-c-khi-ph-th-nh" target="_blank" rel="noreferrer noopener" className="text-neutral-900 font-semibold hover:text-emerald-700 underline underline-offset-2">Deploy on Vercel</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
