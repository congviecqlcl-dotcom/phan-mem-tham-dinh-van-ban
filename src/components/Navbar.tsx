import React from 'react';
import { ShieldCheck, FileSearch, MessageSquareText, BookOpen, FileCheck2, Sparkles, Github } from 'lucide-react';

export type ActiveTab = 'auditor' | 'chat' | 'library' | 'templates' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  canManageUsers?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, canManageUsers = false }) => {
  const githubRepoUrl = 'https://github.com/congviecqlcl-dotcom/Ph-nmm-th-m-nh-vnbn-tr-c-khi-ph-th-nh';
  const vercelDeployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(githubRepoUrl)}`;
  const tabClass = (tab: ActiveTab) => activeTab === tab
    ? 'bg-neutral-900 text-white shadow-sm'
    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 tracking-tight text-base sm:text-lg">DocuGuard AI</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3" /> Pháp chế &amp; ATTP
                </span>
              </div>
              <p className="text-xs text-neutral-500 hidden sm:block">Hệ thống thẩm định văn bản hành chính &amp; quy chuẩn an toàn thực phẩm</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <nav className="flex flex-wrap items-center gap-1">
              <button id="nav-tab-auditor" onClick={() => setActiveTab('auditor')} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium ${tabClass('auditor')}`}>
                <FileSearch className="w-4 h-4" /><span>Thẩm định</span>
              </button>
              <button id="nav-tab-chat" onClick={() => setActiveTab('chat')} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium ${tabClass('chat')}`}>
                <MessageSquareText className="w-4 h-4" /><span>Trợ lý</span>
              </button>
              <button id="nav-tab-library" onClick={() => setActiveTab('library')} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium ${tabClass('library')}`}>
                <BookOpen className="w-4 h-4" /><span>Thư viện</span>
              </button>
              <button id="nav-tab-templates" onClick={() => setActiveTab('templates')} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium ${tabClass('templates')}`}>
                <FileCheck2 className="w-4 h-4" /><span>Mẫu chuẩn</span>
              </button>
              {canManageUsers && <button id="nav-tab-admin" onClick={() => setActiveTab('admin')} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium ${tabClass('admin')}`}>
                <ShieldCheck className="w-4 h-4" /><span>Quản trị</span>
              </button>}
            </nav>
            <div className="flex items-center gap-1.5 border-l border-neutral-200 pl-2">
              <a href={githubRepoUrl} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200">
                <Github className="w-3.5 h-3.5" /><span className="hidden lg:inline">GitHub</span>
              </a>
              <a href={vercelDeployUrl} target="_blank" rel="noreferrer noopener" className="rounded-lg bg-black px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800">Vercel</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
