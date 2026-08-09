"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  RotateCcw,
  ChevronDown,
  Zap,
  Bookmark,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code2,
  Layers,
  Award,
  Briefcase,
  Cpu,
} from "lucide-react";
import { sendChatMessage } from "@/lib/api/services";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  mode?: string;
  sources?: string[];
}

const CATEGORIZED_PRESETS = [
  { label: "🏢 SMS DataTech Role", query: "What did Harsh build at SMS DataTech?", icon: Briefcase },
  { label: "☁️ AWS Certifications", query: "What are Harsh's AWS certifications?", icon: Award },
  { label: "🐍 Python & Django", query: "What is Harsh's backend tech stack?", icon: Code2 },
  { label: "🤖 AI & Pipelines", query: "Tell me about Harsh's AI and data scraping experience", icon: Cpu },
  { label: "💼 Availability & Resume", query: "Is Harsh available for senior backend roles?", icon: Layers },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Welcome! I'm Harsh's AI Portfolio Copilot. Ask me anything about his backend platform engineering at SMS DataTech in Tokyo, AWS certifications, system architecture, or tech stack!",
      timestamp: "Just now",
      mode: "RAG Engine 2.0",
      sources: ["SiteSettings Schema", "ContentGraph Database", "AWS Certifications"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState("Querying Knowledge Graph...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const getTimeString = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input || "").trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: getTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);
    setStatusStep("Querying Knowledge Graph...");

    const stepTimer1 = setTimeout(() => setStatusStep("Retrieving Context Vectors..."), 700);
    const stepTimer2 = setTimeout(() => setStatusStep("Synthesizing AI Answer..."), 1400);

    try {
      const res = await sendChatMessage(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.reply || "No response generated.",
        timestamp: getTimeString(),
        mode: res.mode ? res.mode.toUpperCase() : "AI RAG 2.0",
        sources: res.sources,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "I couldn't connect to Harsh's backend assistant endpoint right now. Please check back shortly!",
          timestamp: getTimeString(),
        },
      ]);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Conversation reset. How can I help you explore Harsh's engineering background?",
        timestamp: getTimeString(),
        mode: "RAG Engine 2.0",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans print:hidden">
      {/* Ultra-Premium Glassmorphism Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3.5 rounded-2xl bg-[#0d1117]/90 dark:bg-[#161b22]/90 backdrop-blur-xl border border-[#30363d] p-3 pl-4 text-white shadow-2xl hover:border-[#58a6ff] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
          aria-label="Open AI Portfolio Copilot"
        >
          {/* Ambient Glowing Gradient Ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#0969da]/30 via-[#8a2be2]/30 to-[#39d353]/30 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#0969da] to-[#8a2be2] text-white shadow-md">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39d353] border-2 border-[#0d1117]" />
            </span>
          </div>

          <div className="relative flex flex-col items-start pr-1 text-left">
            <span className="text-xs font-bold tracking-tight text-[#f0f6fc] flex items-center gap-1.5">
              <span>Ask Harsh&apos;s AI Copilot</span>
              <Sparkles className="h-3.5 w-3.5 text-[#d29922] animate-pulse" />
            </span>
            <span className="text-[10px] font-mono text-[#8b949e]">
              Online &bull; Live Portfolio Assistant
            </span>
          </div>
        </button>
      )}

      {/* Main Premium Chat Widget Window */}
      {isOpen && (
        <div
          className={`flex flex-col rounded-2xl border border-[#30363d] bg-[#0d1117]/95 dark:bg-[#0d1117]/95 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            isExpanded
              ? "h-[650px] w-[90vw] max-w-[680px]"
              : "h-[560px] w-[375px] sm:w-[440px]"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#30363d] bg-gradient-to-r from-[#161b22] via-[#161b22] to-[#0d1117] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0969da] to-[#8a2be2] text-white shadow-md border border-white/10">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39d353] border-2 border-[#0d1117]" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#f0f6fc] tracking-tight">
                    Harsh&apos;s Portfolio Copilot
                  </h3>
                  <span className="rounded-full bg-[#0969da]/20 px-2 py-0.5 text-[9px] font-mono font-bold text-[#58a6ff] border border-[#58a6ff]/30 flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 text-[#39d353]" />
                    <span>AI RAG 2.0</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#8b949e]">
                  Backend Platform & Cloud Infrastructure Specialist
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse View" : "Expand Full Window"}
                className="p-1.5 rounded-lg text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc] transition-colors"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleClear}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize Window"
                className="p-1.5 rounded-lg text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc] transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs [scrollbar-width:thin]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0969da]/20 to-[#8a2be2]/20 text-[#58a6ff] border border-[#58a6ff]/30 shadow-xs mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div className="flex flex-col space-y-1.5 max-w-[86%]">
                  <div
                    className={`group relative rounded-2xl px-4 py-3.5 whitespace-pre-wrap leading-relaxed shadow-md transition-all ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-[#0969da] to-[#1f6beb] text-white rounded-br-xs font-sans font-medium"
                        : "bg-[#161b22]/95 text-[#c9d1d9] border border-[#30363d] border-l-4 border-l-[#58a6ff] rounded-bl-xs font-sans"
                    }`}
                  >
                    {m.text}

                    {/* Copy Button for Bot Messages */}
                    {m.sender === "bot" && (
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(m.id, m.text)}
                        className="absolute top-2.5 right-2.5 p-1 rounded-md bg-[#21262d] opacity-0 group-hover:opacity-100 hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all duration-150"
                        title="Copy Answer"
                      >
                        {copiedId === m.id ? (
                          <Check className="h-3 w-3 text-[#39d353]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}

                    {/* Source Citation Badges */}
                    {m.sender === "bot" && m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#30363d]/80 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-mono text-[#8b949e] flex items-center gap-1">
                          <Bookmark className="h-3 w-3 text-[#58a6ff]" />
                          <span>Sources:</span>
                        </span>
                        {m.sources.map((src, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md bg-[#388bfd]/15 px-2 py-0.5 font-mono text-[#58a6ff] border border-[#388bfd]/30"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-[9px] font-mono text-[#8b949e] px-1 ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.mode && (
                      <span className="text-[#58a6ff] font-semibold">
                        &bull; {m.mode}
                      </span>
                    )}
                  </div>
                </div>

                {m.sender === "user" && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[#30363d] text-[#f0f6fc] mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Custom Multi-Stage Animated Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-3 text-[#8b949e] bg-[#161b22] p-3.5 rounded-2xl border border-[#30363d] w-fit shadow-md">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#388bfd]/20 text-[#58a6ff]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-[#58a6ff]">{statusStep}</span>
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#58a6ff] animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#58a6ff] animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#58a6ff] animate-bounce" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Categorized Quick Preset Chips Bar */}
          <div className="border-t border-[#30363d] bg-[#161b22]/80 px-3 py-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {CATEGORIZED_PRESETS.map((preset, idx) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(preset.query)}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[11px] font-mono text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all duration-150 disabled:opacity-50"
                  >
                    <IconComp className="h-3 w-3 text-[#58a6ff]" />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-[#30363d] bg-[#0d1117] p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI about Harsh's backend projects, AWS, experience..."
              disabled={loading}
              className="flex-1 bg-[#161b22] rounded-xl border border-[#30363d] px-3.5 py-2 text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#58a6ff] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0969da] to-[#1f6beb] text-white disabled:opacity-40 hover:opacity-90 transition-all shadow-md"
              aria-label="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
