import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DocumentAuditor } from './components/DocumentAuditor';
import { ChatAssistant } from './components/ChatAssistant';
import { LegalExplorer } from './components/LegalExplorer';
import { TemplateGenerator } from './components/TemplateGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('auditor');

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col antialiased font-sans">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'auditor' && <DocumentAuditor />}
        {activeTab === 'chat' && <ChatAssistant />}
        {activeTab === 'library' && <LegalExplorer />}
        {activeTab === 'templates' && <TemplateGenerator />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-neutral-800 text-sm">DocuGuard AI</div>
            <div>Hệ thống chuyên gia kiểm tra & thẩm định văn bản ATTP và Thể thức hành chính</div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-neutral-600">
            <span>Cập nhật Thông tư 17/2024/TT-BNNPTNT</span>
            <span>•</span>
            <span>Nghị định 30/2020/NĐ-CP</span>
            <span>•</span>
            <span>NQ 202/2025 & NQ 1676/2025</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/congviecqlcl-dotcom/Ph-nmm-th-m-nh-vnbn-tr-c-khi-ph-th-nh"
              target="_blank"
              rel="noreferrer noopener"
              className="text-neutral-700 hover:text-neutral-900 font-medium underline underline-offset-2 flex items-center gap-1"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcongviecqlcl-dotcom%2FPh-nmm-th-m-nh-vnbn-tr-c-khi-ph-th-nh"
              target="_blank"
              rel="noreferrer noopener"
              className="text-neutral-900 font-semibold hover:text-emerald-700 underline underline-offset-2 flex items-center gap-1"
            >
              Deploy on Vercel
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
