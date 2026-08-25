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
      <footer className="bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            DocuGuard AI — Hệ thống chuyên gia kiểm tra & thẩm định văn bản ATTP và Thể thức hành chính
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Cập nhật Thông tư 17/2024/TT-BNNPTNT</span>
            <span>•</span>
            <span>Nghị định 30/2020/NĐ-CP</span>
            <span>•</span>
            <span>NQ 202/2025 & NQ 1676/2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
