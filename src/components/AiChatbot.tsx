import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, NowcastSummary, MacroScenario } from "../types";
import { Sparkles, Send, Bot, User, RotateCcw, Copy, Check, Lightbulb } from "lucide-react";

interface AiChatbotProps {
  summary: NowcastSummary;
  scenario: MacroScenario;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "model",
    timestamp: "Sekarang",
    content: `Halo! Saya **BI RiskLens Copilot**, asisten intelijen makroprudensial Bank Indonesia dan manajemen risiko kredit perbankan.

Saya dapat membantu Anda menganalisis:
1. **Transmisi Sentimen Berita Keuangan (Deep Learning)** terhadap perilaku kredit debitur.
2. **Nowcasting & Forecasting NPL** menggunakan model ekonometrika (MIDAS, ARDL, Dynamic Factor Model).
3. **Instrumen Makroprudensial BI** (CCyB, RIM, PLM, Insentif Likuiditas KLM, RPIM).
4. **Mitigasi Risiko Kredit & CKPN (IFRS 9 / PSAK 71)** untuk masing-masing klaster bank (KBMI 1–4).

Ada hal spesifik yang ingin Anda diskusikan atau tanyakan terkait kondisi saat ini?`,
    suggestedActions: [
      "Bagaimana transmisi kenaikan BI-Rate 50 bps terhadap NPL UMKM?",
      "Analisis dampak sentimen depresiasi kurs Rupiah ke industri manufaktur",
      "Apakah ambang batas 5% NPL gross terancam dalam skenario stres berat?",
      "Rekomendasikan kebijakan mitigasi makroprudensial BI untuk menjaga intermediasi",
    ],
  },
];

export const AiChatbot: React.FC<AiChatbotProps> = ({ summary, scenario }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          currentContext: {
            nowcastNpl: summary.nowcastGrossNpl,
            baselineNpl: summary.officialLastNpl,
            riskStatus: summary.riskStatus,
            sentimentScore: scenario.sentimentIndex,
            sentimentLabel:
              scenario.sentimentIndex < -0.2
                ? "Sentimen Menekan"
                : scenario.sentimentIndex > 0.2
                ? "Sentimen Optimis"
                : "Netral",
            biRate: scenario.biRate,
            kurs: scenario.kursUsdIdr,
            pdbGrowth: scenario.pdbGrowth,
            inflation: scenario.inflasi,
            vulnerableSectors: summary.sectors
              .filter((s) => s.riskCategory === "Tinggi" || s.riskCategory === "Waspada")
              .map((s) => s.sector)
              .join(", "),
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "Maaf, respon tidak dapat dihasilkan saat ini.";

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        content: replyText,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      const errorReply: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        content:
          "Terjadi kendala jaringan saat menghubungi server AI. Namun, secara umum pengetatan likuiditas dan pelemahan kurs dapat dimitigasi dengan penguatan penyangga likuiditas makroprudensial (PLM) serta restrukturisasi preventif pada debitur sektor rentan.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorReply]);
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
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm flex flex-col h-[680px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              BI RiskLens Copilot
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                Online • Gemini 3.8 Flash
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Asisten Khusus Makroprudensial Bank Indonesia & Risiko Kredit NPL
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title="Reset Percakapan"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? "bg-slate-800 text-white"
                    : "bg-blue-600 text-white shadow-sm"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/80"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>BI Macroprudential Intelligence</span>
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="hover:text-slate-600 flex items-center gap-1"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Disalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested prompt chips */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full px-3 py-1 transition text-left"
                      >
                        💡 {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-slate-100 rounded-2xl rounded-tl-none border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1">BI RiskLens Copilot sedang menyusun analisis makroprudensial...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-slate-200 bg-white rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Tanyakan analisis transmisi risiko, simulasi MIDAS, kebijakan BI, atau mitigasi CKPN..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm p-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
