"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  RotateCcw,
  ChevronDown,
  Zap,
  CheckCircle2,
  Bookmark,
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

const PRESET_QUESTIONS = [
  "What did Harsh build at SMS DataTech?",
  "What are Harsh's AWS certifications?",
  "What is Harsh's core tech stack?",
  "Where did Harsh graduate from?",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I'm Harsh's AI Assistant. Ask me anything about his backend engineering at SMS DataTech in Tokyo, AWS certifications, technical skills, or portfolio projects!",
      timestamp: "Just now",
      mode: "RAG Engine",
      sources: ["SiteSettings Model", "ContentGraph Database"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getTimeString = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

    try {
      const res = await sendChatMessage(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.reply || "No reply generated.",
        timestamp: getTimeString(),
        mode: res.mode ? res.mode.toUpperCase() : "AI RAG",
        sources: res.sources,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Sorry, I couldn't reach Harsh's backend AI assistant.",
          timestamp: getTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Chat context reset. What would you like to ask Harsh's AI assistant?",
        timestamp: getTimeString(),
        mode: "RAG Engine",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans print:hidden">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 rounded-full bg-[#161b22] dark:bg-[#21262d] border border-[#30363d] p-3 pl-4 text-white shadow-xl hover:shadow-2xl hover:border-[#58a6ff] transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Ask AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="h-5 w-5 text-[#58a6ff]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#39d353]" />
            </span>
          </div>

          <div className="flex flex-col items-start pr-1 text-left">
            <span className="text-xs font-bold tracking-tight text-[#f0f6fc] flex items-center gap-1.5">
              <span>Ask AI About Harsh</span>
              <Sparkles className="h-3 w-3 text-[#d29922]" />
            </span>
            <span className="text-[10px] font-mono text-[#8b949e]">
              Online &bull; Instant Resume QA
            </span>
          </div>
        </button>
      )}

      {/* Main Chat Modal Window */}
      {isOpen && (
        <div className="flex h-[540px] w-[375px] sm:w-[420px] flex-col rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#d0d7de]/80 dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#0969da]/10 dark:bg-[#388bfd]/20 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 dark:border-[#58a6ff]/30">
                <Bot className="h-4 w-4" />
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39d353] border-2 border-[#161b22]" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] tracking-tight">
                    Ask AI Assistant
                  </h3>
                  <span className="rounded-full bg-[#0969da]/10 dark:bg-[#388bfd]/20 px-2 py-0.5 text-[9px] font-mono font-bold text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 dark:border-[#58a6ff]/30 flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5" />
                    <span>RAG ACTIVE</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
                  Harsh Tripathi &bull; Software Engineer (Backend & Cloud)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-[#57606a] dark:text-[#8b949e] hover:bg-[#d0d7de]/50 dark:hover:bg-[#30363d] hover:text-[#24292f] dark:hover:text-[#f0f6fc] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Window"
                className="p-1.5 rounded-lg text-[#57606a] dark:text-[#8b949e] hover:bg-[#d0d7de]/50 dark:hover:bg-[#30363d] hover:text-[#24292f] dark:hover:text-[#f0f6fc] transition-colors"
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
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[#0969da]/10 dark:bg-[#388bfd]/15 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#58a6ff]/20 shadow-xs mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div className="flex flex-col space-y-1.5 max-w-[85%]">
                  <div
                    className={`rounded-2xl px-4 py-3 whitespace-pre-wrap leading-relaxed shadow-xs transition-all ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-[#0969da] to-[#1f6beb] text-white rounded-br-xs font-sans"
                        : "bg-[#f6f8fa] dark:bg-[#161b22] text-[#24292f] dark:text-[#c9d1d9] border border-[#d0d7de]/80 dark:border-[#30363d]/80 border-l-2 border-l-[#0969da] dark:border-l-[#58a6ff] rounded-bl-xs font-sans"
                    }`}
                  >
                    {m.text}

                    {/* Source Citation Badges */}
                    {m.sender === "bot" && m.sources && m.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-1">
                          <Bookmark className="h-3 w-3 text-[#0969da] dark:text-[#58a6ff]" />
                          <span>Sources:</span>
                        </span>
                        {m.sources.map((src, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md bg-[#0969da]/10 dark:bg-[#58a6ff]/15 px-1.5 py-0.5 font-mono text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#58a6ff]/20"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-[9px] font-mono text-[#57606a] dark:text-[#8b949e] px-1 ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.mode && (
                      <span className="text-[#0969da] dark:text-[#58a6ff] font-semibold">
                        &bull; {m.mode}
                      </span>
                    )}
                  </div>
                </div>

                {m.sender === "user" && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[#afb8c1]/20 dark:bg-[#6e7681]/40 text-[#24292f] dark:text-[#c9d1d9] mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Custom Animated Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-3 text-[#57606a] dark:text-[#8b949e] bg-[#f6f8fa] dark:bg-[#161b22] p-3 rounded-2xl border border-[#d0d7de]/80 dark:border-[#30363d]/80 w-fit">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0969da]/10 dark:bg-[#388bfd]/15 text-[#0969da] dark:text-[#58a6ff]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <span>Querying PostgreSQL database</span>
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0969da] dark:bg-[#58a6ff] animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0969da] dark:bg-[#58a6ff] animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0969da] dark:bg-[#58a6ff] animate-bounce" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Questions Bar */}
          <div className="border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 bg-[#f6f8fa]/60 dark:bg-[#161b22]/60 px-3 py-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {PRESET_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="whitespace-nowrap rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] px-2.5 py-1 text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-all duration-150 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Harsh's experience, AWS, skills..."
              disabled={loading}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-[#24292f] dark:text-[#f0f6fc] placeholder-[#8b949e] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0969da] hover:bg-[#0860c4] text-white disabled:opacity-40 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
