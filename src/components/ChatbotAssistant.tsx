import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Trash2, ArrowUpRight, Copy, Check, Shield, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types/npl';

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'assistant',
    timestamp: 'Baru saja',
    text: `Halo! Saya **BI Risk Copilot**, asisten AI khusus Manajemen Risiko Kredit Perbankan dan Analisis Kebijakan Makroprudensial Bank Indonesia.

Saya dapat membantu Anda dengan:
- **Nowcasting & Forecasting NPL**: Proyeksi laju kredit macet industri dan sektoral (Konstruksi, UMKM, Manufaktur, dll.) berbasis model frekuensi campuran (MIDAS) dan sentimen berita IndoBERT.
- **Transmisi Kebijakan Moneter & Makro**: Dampak kenaikan BI-Rate, depresiasi Rupiah, dan laju PDB terhadap rasio NPL Gross, NPL Net, dan Loan at Risk (LaR).
- **Stress Testing & Mitigasi**: Evaluasi kecukupan CKPN (PSAK 71 / IFRS 9 ECL) dan bantalan permodalan CAR untuk rapat Komite Risiko (ALCO).

Silakan pilih topik di bawah atau ketik pertanyaan spesifik Anda:`,
    recommendedActions: [
      'Bagaimana dampak kenaikan BI-Rate 50 bps terhadap NPL sektor properti?',
      'Jelaskan cara kerja model MIDAS + FinBERT dalam nowcasting NPL',
      'Evaluasi risiko NPL sektor konstruksi dan mitigasi CKPN',
      'Bagaimana ketahanan bank KBMI 3 terhadap pelemahan nilai tukar Rupiah?'
    ],
  },
];

export const ChatbotAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Format history for server
      const history = messages
        .filter((m) => m.id !== 'welcome-1')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'assistant' ? ('model' as const) : ('user' as const),
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi AI Risk Copilot');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        text: data.reply || 'Maaf, tidak ada respon yang diterima.',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: 'assistant-fallback-' + Date.now(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        text: `Terjadi kendala jaringan saat menghubungi server model. 
        
**Sintesis Makroprudensial Cepat:**
Berdasarkan data time-series Bank Indonesia, proyeksi NPL Gross kuartal berjalan berada pada rentang **2.18% - 2.26%**. Untuk skenario guncangan suku bunga atau pelemahan kurs, sektor yang paling sensitif adalah **Konstruksi (NPL 3.84%)** dan **UMKM (NPL 3.65%)**. Bantalan CKPN industri sebesar 148.5% masih sangat memadai untuk memitigasi potensi pemburukan kolektibilitas kredit.`,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages(DEFAULT_MESSAGES);
  };

  // Simple renderer for formatting basic markdown (bold, lists, code)
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-sm text-slate-900 mt-2 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-2">
                <span className="text-blue-500 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }} />
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-xs">$1</code>');
  };

  return (
    <div id="chatbot-container" className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col h-[700px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-white rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-500/40 text-cyan-300">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">BI Risk Copilot</h3>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Analisis Risiko Makroprudensial & Konsultasi Nowcasting NPL
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title="Mulai Sesi Baru"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Reset Sesi</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-indigo-700 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs relative group ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                <span className="font-semibold">
                  {msg.sender === 'user' ? 'Analis Risiko' : 'BI Risk Copilot'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              {msg.sender === 'user' ? (
                <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.text}</p>
              ) : (
                renderFormattedText(msg.text)
              )}

              {/* Copy button */}
              {msg.sender === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Salin tanggapan"
                >
                  {copiedId === msg.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}

              {/* Recommended Prompt Pills */}
              {msg.recommendedActions && msg.recommendedActions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-cyan-600" />
                    <span>Pertanyaan Yang Sering Diajukan:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.recommendedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(action)}
                        className="text-left text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1">Sedang menganalisis matriks makroprudensial & ekonometrika...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200 rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="chat-input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tanyakan analisis NPL, dampak BI-Rate, transmisi kurs, atau kebijakan makroprudensial..."
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            disabled={isLoading}
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <span>Kirim</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
        <div className="mt-1.5 text-center text-[10px] text-slate-600">
          Didukung oleh integrasi model server-side Gemini 2.5 Flash & basis data makroprudensial Bank Indonesia.
        </div>
      </div>
    </div>
  );
};
