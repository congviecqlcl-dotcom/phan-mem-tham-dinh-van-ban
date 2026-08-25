import React from 'react';
import { ShieldCheck, FileSearch, MessageSquareText, BookOpen, FileCheck2, Sparkles, Github, ExternalLink } from 'lucide-react';

export type ActiveTab = 'auditor' | 'chat' | 'library' | 'templates';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const githubRepoUrl = 'https://github.com/congviecqlcl-dotcom/Ph-nmm-th-m-nh-vnbn-tr-c-khi-ph-th-nh';
  const vercelDeployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(githubRepoUrl)}`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 tracking-tight text-base sm:text-lg">
                  DocuGuard AI
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3" /> Pháp chế & ATTP
                </span>
              </div>
              <p className="text-xs text-neutral-500 hidden sm:block">
                Hệ thống thẩm định văn bản hành chính & quy chuẩn an toàn thực phẩm
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Quick Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center gap-1 sm:gap-1.5">
              <button
                id="nav-tab-auditor"
                onClick={() => setActiveTab('auditor')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'auditor'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <FileSearch className="w-4 h-4" />
                <span>Thẩm định</span>
              </button>

              <button
                id="nav-tab-chat"
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <MessageSquareText className="w-4 h-4" />
                <span className="hidden sm:inline">Trợ lý</span>
              </button>

              <button
                id="nav-tab-library"
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'library'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden md:inline">Thư viện 12 VB</span>
                <span className="md:hidden">Thư viện</span>
              </button>

              <button
                id="nav-tab-templates"
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'templates'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span className="hidden md:inline">Tạo mẫu chuẩn</span>
                <span className="md:hidden">Mẫu chuẩn</span>
              </button>
            </nav>

            {/* GitHub & Vercel Quick Actions */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200">
              <a
                id="btn-link-github"
                href={githubRepoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors border border-neutral-200"
                title="Mở mã nguồn trên GitHub"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">GitHub</span>
              </a>

              <a
                id="btn-link-vercel"
                href={vercelDeployUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-black hover:bg-neutral-800 transition-colors shadow-sm"
                title="Triển khai miễn phí lên Vercel chỉ với 1 cú nhấp"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M24 22.525H0l12-21.05 12 21.05z" />
                </svg>
                <span className="hidden lg:inline">Deploy Vercel</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
