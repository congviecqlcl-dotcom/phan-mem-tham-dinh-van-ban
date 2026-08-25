import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Scale, Copy, Check, CornerDownLeft } from 'lucide-react';
import { ChatMessage } from '../types';
import { getLocalChatResponse } from '../utils/chatEngine';

const PRESET_QUESTIONS = [
  'Thông tư 17/2024/TT-BNNPTNT thay đổi cách xếp loại cơ sở và thẩm quyền thế nào?',
  'Cơ sở nào được miễn cấp Giấy chứng nhận đủ điều kiện ATTP theo Điều 12 NĐ 15/2018?',
  'Quy tắc ghi trích yếu và dấu câu trong Nghị định 30/2020/NĐ-CP?',
  'Nội dung bắt buộc ghi nhãn Thực phẩm bảo vệ sức khỏe theo NĐ 111/2021?',
  'Quy trình thu hồi thực phẩm không an toàn trong 24 giờ theo Thông tư 17/2021?',
  'Địa giới hành chính cấp xã mới của tỉnh Phú Thọ theo Nghị quyết 1676/2025?'
];

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Xin chào! Tôi là Trợ lý AI chuyên trách Thẩm định & Pháp lý An toàn thực phẩm.

Tôi đã nắm vững toàn bộ **12 văn bản quy phạm pháp luật** mà bạn cung cấp:
- 📜 **Luật An toàn thực phẩm số 55/2010/QH12**
- 📜 **Nghị định số 15/2018/NĐ-CP** (hướng dẫn thi hành Luật ATTP)
- 📜 **Thông tư số 17/2024/TT-BNNPTNT** (sửa đổi TT 38 & TT 48 - hiệu lực 15/01/2025)
- 📜 **Thông tư số 38/2018/TT-BNNPTNT, 17/2018/TT-BNNPTNT & 17/2021/TT-BNNPTNT**
- 📜 **Nghị định số 43/2017/NĐ-CP & 111/2021/NĐ-CP** (Nhãn hàng hóa)
- 📜 **Nghị định số 181/2013/NĐ-CP** (Quảng cáo thực phẩm, TPCN, thuốc, mỹ phẩm)
- 📜 **Nghị định số 30/2020/NĐ-CP** (Thể thức & kỹ thuật trình bày văn bản hành chính)
- 📜 **Nghị quyết 202/2025/QH15 & 1676/NQ-UBTVQH15** (Sáp nhập & sắp xếp địa giới hành chính mới).

Bạn có thể đặt bất kỳ câu hỏi nào về thẩm quyền, biểu mẫu, quy chuẩn, nhãn mác hoặc yêu cầu kiểm tra tình huống thực tế!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let replyText = '';
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.reply;
        }
      } catch (netErr) {
        console.warn('Network chat error, using local legal engine:', netErr);
      }

      if (!replyText) {
        replyText = getLocalChatResponse(query);
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const fallbackReply = getLocalChatResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Quick Question Chips */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gợi ý câu hỏi nghiệp vụ thường gặp:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-left text-xs bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xl transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group ${
                  msg.sender === 'user'
                    ? 'bg-neutral-900 text-white rounded-tr-none'
                    : 'bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400 border-t border-neutral-100/40">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => copyMessage(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl rounded-tl-none p-4 text-xs text-neutral-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Trợ lý đang tra cứu điều khoản pháp luật...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="chat-input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Đặt câu hỏi về thủ tục ATTP, thể thức NĐ 30, nhãn mác NĐ 111, địa giới hành chính..."
              className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Gửi</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
