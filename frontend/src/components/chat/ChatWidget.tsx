"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  FileText,
  Mail,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { LinkedinIcon } from "@/components/icons/SocialIcons";
import {
  streamChatMessage,
  ChatMessage,
  ChatActionCard,
} from "@/lib/api/services";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  mode?: string;
  sources?: string[];
  actions?: ChatActionCard[];
  suggestions?: string[];
  isStreaming?: boolean;
}

function parseInlineFormatting(text: string): React.ReactNode[] {
  // Regex to split by links [label](url), bold **bold**, code `code`, italic *italic*
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];

    if (token.startsWith("[") && token.endsWith(")")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        const isInternal = url.startsWith("/");
        if (isInternal) {
          parts.push(
            <Link
              key={`link-${match.index}`}
              href={url}
              className="text-[#0969da] dark:text-[#58a6ff] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {label}
            </Link>
          );
        } else {
          parts.push(
            <a
              key={`ext-${match.index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0969da] dark:text-[#58a6ff] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity inline-flex items-center gap-0.5"
            >
              <span>{label}</span>
              <ArrowUpRight className="h-3 w-3 inline-block opacity-70" />
            </a>
          );
        }
      } else {
        parts.push(token);
      }
    } else if (token.startsWith("**") && token.endsWith("**")) {
      const boldText = token.slice(2, -2);
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-[#1f2328] dark:text-[#f0f6fc]">
          {boldText}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      const codeText = token.slice(1, -1);
      parts.push(
        <code
          key={`code-${match.index}`}
          className="rounded-md bg-[#0969da]/10 dark:bg-[#388bfd]/15 px-1.5 py-0.5 font-mono text-[11px] text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#388bfd]/30"
        >
          {codeText}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      const italicText = token.slice(1, -1);
      parts.push(
        <em key={`italic-${match.index}`} className="italic text-[#24292f] dark:text-[#c9d1d9]">
          {italicText}
        </em>
      );
    } else {
      parts.push(token);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function renderRichMessage(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let currentBulletGroup: React.ReactNode[] = [];

  const flushBullets = (keyPrefix: number) => {
    if (currentBulletGroup.length > 0) {
      renderedElements.push(
        <div key={`bullets-group-${keyPrefix}`} className="space-y-1.5 my-2 pl-0.5">
          {currentBulletGroup}
        </div>
      );
      currentBulletGroup = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBullets(lineIdx);
      return;
    }

    // Check for bullet lines: "- item", "• item", "* item"
    const bulletMatch = /^[-*•]\s+(.*)$/.exec(trimmed);
    if (bulletMatch) {
      const itemContent = bulletMatch[1];
      currentBulletGroup.push(
        <div key={`bullet-${lineIdx}`} className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed text-[#24292f] dark:text-[#c9d1d9]">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0969da] dark:bg-[#58a6ff] flex-shrink-0 shadow-xs" />
          <div className="flex-1">{parseInlineFormatting(itemContent)}</div>
        </div>
      );
    } else {
      flushBullets(lineIdx);
      // Section header detection (e.g. "**Key Engineering Focus**:")
      const isHeader = /^(\*\*.*\*\*|###.*):?$/.test(trimmed);
      if (isHeader) {
        renderedElements.push(
          <div key={`head-${lineIdx}`} className="pt-1.5 pb-0.5 text-xs sm:text-[13px] font-semibold text-[#1f2328] dark:text-[#f0f6fc]">
            {parseInlineFormatting(trimmed)}
          </div>
        );
      } else {
        renderedElements.push(
          <p key={`line-${lineIdx}`} className="text-xs sm:text-[13px] leading-relaxed text-[#24292f] dark:text-[#c9d1d9]">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      }
    }
  });

  flushBullets(lines.length);

  return <div className="space-y-2">{renderedElements}</div>;
}

function ActionCardIcon({ name, isPrimary }: { name?: string; isPrimary?: boolean }) {
  const iconClass = isPrimary
    ? "h-3.5 w-3.5 text-white"
    : "h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]";

  switch (name) {
    case "FileText":
      return <FileText className={iconClass} />;
    case "Mail":
      return <Mail className={isPrimary ? "h-3.5 w-3.5 text-white" : "h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]"} />;
    case "Linkedin":
    case "linkedin":
      return <LinkedinIcon className={isPrimary ? "h-3.5 w-3.5 text-white fill-current" : "h-3.5 w-3.5 text-[#0a66c2] fill-current"} />;
    case "TrendingUp":
      return <TrendingUp className={iconClass} />;
    case "Briefcase":
      return <Briefcase className={iconClass} />;
    case "Award":
      return <Award className={isPrimary ? "h-3.5 w-3.5 text-white" : "h-3.5 w-3.5 text-[#d29922] dark:text-[#e3b341]"} />;
    case "Layers":
      return <Layers className={isPrimary ? "h-3.5 w-3.5 text-white" : "h-3.5 w-3.5 text-[#8a2be2] dark:text-[#bc8cff]"} />;
    case "Zap":
      return <Zap className={isPrimary ? "h-3.5 w-3.5 text-white" : "h-3.5 w-3.5 text-[#d29922] dark:text-[#e3b341]"} />;
    default:
      return <ArrowUpRight className={iconClass} />;
  }
}

function getPresetsForPath(pathname: string) {
  if (pathname.startsWith("/projects")) {
    return [
      { label: "Constellation Homelab", query: "How does Constellation isolate network ports with Cloudflare Tunnels?", icon: Layers, color: "text-[#8a2be2] dark:text-[#bc8cff]" },
      { label: "FinTrack AI Platform", query: "What rule-based AI processing powers FinTrack AI?", icon: TrendingUp, color: "text-[#1f883d] dark:text-[#39d353]" },
      { label: "Career OS Architecture", query: "How is Career OS containerized with Docker and Django?", icon: Code2, color: "text-[#0969da] dark:text-[#58a6ff]" },
      { label: "Projects Tech Stack", query: "What technologies are used across Harsh's projects?", icon: Cpu, color: "text-[#d29922] dark:text-[#e3b341]" },
      { label: "Open Roles & Resume", query: "Is Harsh open to backend and cloud engineering roles?", icon: Briefcase, color: "text-[#1a7f37] dark:text-[#56d364]" },
    ];
  }
  if (pathname.startsWith("/experience")) {
    return [
      { label: "20–30% Performance Gain", query: "How did Harsh achieve 20–30% API performance improvements at SMS DataTech?", icon: Zap, color: "text-[#d29922] dark:text-[#e3b341]" },
      { label: "Celery Task Queues", query: "How did Harsh build asynchronous task queues with Celery at SMS DataTech?", icon: Code2, color: "text-[#0969da] dark:text-[#58a6ff]" },
      { label: "AWS ECS/Fargate IaC", query: "What AWS infrastructure did Harsh deploy using CloudFormation?", icon: Award, color: "text-[#d29922] dark:text-[#e3b341]" },
      { label: "SMS DataTech Progression", query: "Tell me about Harsh's progression from Intern to Software Engineer at SMS DataTech.", icon: Briefcase, color: "text-[#1f883d] dark:text-[#39d353]" },
      { label: "Resume & Contact", query: "How can I contact Harsh regarding full-time engineering roles?", icon: Mail, color: "text-[#8a2be2] dark:text-[#bc8cff]" },
    ];
  }
  if (pathname.startsWith("/skills")) {
    return [
      { label: "AWS Cloud Specialist", query: "What AWS services does Harsh specialize in and hold certifications for?", icon: Award, color: "text-[#d29922] dark:text-[#e3b341]" },
      { label: "Python & Django Stack", query: "What is Harsh's production experience with Python and Django REST Framework?", icon: Code2, color: "text-[#0969da] dark:text-[#58a6ff]" },
      { label: "PostgreSQL & Redis", query: "How does Harsh optimize PostgreSQL queries and Redis caching?", icon: Layers, color: "text-[#8a2be2] dark:text-[#bc8cff]" },
      { label: "AI & Data Scraping", query: "What AI and data extraction platforms has Harsh built?", icon: Cpu, color: "text-[#1f883d] dark:text-[#39d353]" },
      { label: "Open Roles in Tokyo", query: "Is Harsh open to backend and cloud engineering opportunities in Tokyo?", icon: Briefcase, color: "text-[#1a7f37] dark:text-[#56d364]" },
    ];
  }
  if (pathname.startsWith("/timeline")) {
    return [
      { label: "IIIT Nagpur Degree", query: "Tell me about Harsh's computer science degree from IIIT Nagpur.", icon: Award, color: "text-[#0969da] dark:text-[#58a6ff]" },
      { label: "SMS DataTech Milestones", query: "What key milestones did Harsh achieve at SMS DataTech in Tokyo?", icon: Briefcase, color: "text-[#1f883d] dark:text-[#39d353]" },
      { label: "AWS Certifications", query: "What AWS certifications did Harsh earn?", icon: Award, color: "text-[#d29922] dark:text-[#e3b341]" },
      { label: "Open Opportunities", query: "What roles is Harsh currently targeting in Tokyo?", icon: Layers, color: "text-[#8a2be2] dark:text-[#bc8cff]" },
    ];
  }
  if (pathname.startsWith("/resume")) {
    return [
      { label: "30s Recruiter Snapshot", query: "Give me a quick 3-bullet recruiter summary of Harsh's experience and stack.", icon: Briefcase, color: "text-[#1f883d] dark:text-[#39d353]" },
      { label: "Resume PDF Download", query: "How can I download Harsh's verified resume PDF?", icon: FileText, color: "text-[#0969da] dark:text-[#58a6ff]" },
      { label: "AWS & Backend Stack", query: "Summarize Harsh's core backend and cloud competencies.", icon: Award, color: "text-[#d29922] dark:text-[#e3b341]" },
      { label: "Interview & Contact", query: "How can I contact Harsh regarding open backend and cloud roles?", icon: Mail, color: "text-[#8a2be2] dark:text-[#bc8cff]" },
    ];
  }
  // Default (Homepage)
  return [
    { label: "SMS DataTech Role", query: "What did Harsh build at SMS DataTech?", icon: Briefcase, color: "text-[#1f883d] dark:text-[#39d353]" },
    { label: "AWS Certifications", query: "What are Harsh's AWS certifications?", icon: Award, color: "text-[#d29922] dark:text-[#e3b341]" },
    { label: "Python & Django Stack", query: "What is Harsh's backend tech stack?", icon: Code2, color: "text-[#0969da] dark:text-[#58a6ff]" },
    { label: "AI & Data Pipelines", query: "Tell me about Harsh's AI and data scraping experience", icon: Cpu, color: "text-[#8a2be2] dark:text-[#bc8cff]" },
    { label: "Open Roles & Contact", query: "How can I contact Harsh regarding open backend and cloud roles?", icon: Mail, color: "text-[#1a7f37] dark:text-[#56d364]" },
  ];
}

export function ChatWidget() {
  const pathname = usePathname();
  const currentPresets = getPresetsForPath(pathname || "/");
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Welcome! I'm Harsh's AI Portfolio Copilot. Ask me anything about his backend platform engineering at SMS DataTech in Tokyo, AWS certifications, system architecture, or tech stack!\n\nYou can also explore his [Work Experience](/experience), [Projects](/projects), [Skills & Stack](/skills), or [Resume](/resume).",
      timestamp: "Just now",
      mode: "RAG Engine 2.0",
      sources: ["SiteSettings Schema", "ContentGraph Database", "AWS Certifications"],
      actions: [
        {
          type: "resume",
          label: "View / Download Resume PDF",
          url: "/resume",
          icon: "FileText",
          variant: "primary",
        },
        {
          type: "email",
          label: "Email Harsh Directly",
          url: "mailto:tripathiharsh324@gmail.com?subject=Discussion%20re%3A%20Backend%20%26%20Cloud%20Engineering%20Role",
          icon: "Mail",
          variant: "default",
        },
      ],
      suggestions: [
        "What did Harsh build at SMS DataTech?",
        "What are his AWS certifications?",
        "What backend technologies does he specialize in?",
      ],
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

    const botMsgId = (Date.now() + 1).toString();
    const initialBotMsg: Message = {
      id: botMsgId,
      sender: "bot",
      text: "",
      timestamp: getTimeString(),
      mode: "AI RAG 2.0",
      isStreaming: true,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages([...updatedHistory, initialBotMsg]);
    if (!textToSend) setInput("");
    setLoading(true);
    setStatusStep("Querying Knowledge Graph...");

    // Format multi-turn conversation payload for backend
    const apiMessages: ChatMessage[] = updatedHistory
      .filter((m) => m.id !== "init" && m.text.trim())
      .map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

    let accumulatedText = "";

    try {
      await streamChatMessage(apiMessages, {
        onMeta: (meta) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    mode: meta.mode ? meta.mode.toUpperCase() : m.mode,
                    sources: meta.sources || m.sources,
                  }
                : m
            )
          );
        },
        onChunk: (chunk) => {
          accumulatedText += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text: accumulatedText,
                    isStreaming: true,
                  }
                : m
            )
          );
        },
        onDone: (doneData) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    isStreaming: false,
                    actions: doneData.actions,
                    suggestions: doneData.suggestions,
                  }
                : m
            )
          );
        },
        onError: () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text:
                      accumulatedText ||
                      "I couldn't reach Harsh's backend assistant endpoint right now. Please explore his verified pages directly via the links above!",
                    isStreaming: false,
                  }
                : m
            )
          );
        },
      });
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? {
                ...m,
                text: "I couldn't connect to Harsh's backend assistant endpoint right now. Please check back shortly!",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setLoading(false);
      setMessages((prev) =>
        prev.map((m) => (m.id === botMsgId ? { ...m, isStreaming: false } : m))
      );
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Conversation reset. How can I help you explore Harsh's engineering background?\n\nCheck out his [Work Experience](/experience) or [Projects](/projects).",
        timestamp: getTimeString(),
        mode: "RAG Engine 2.0",
        suggestions: [
          "What did Harsh build at SMS DataTech?",
          "What are his AWS certifications?",
          "What is his core backend tech stack?",
        ],
      },
    ]);
  };

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans print:hidden">
      {/* Ultra-Premium Theme-Adaptive Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-xl border border-[#d0d7de] dark:border-[#30363d] hover:border-[#0969da] dark:hover:border-[#58a6ff] pl-2.5 pr-4 py-2 text-[#24292f] dark:text-[#f0f6fc] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          aria-label="Open AI Portfolio Copilot"
        >
          <div className="relative flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-tr from-[#0969da] to-[#2f81f7] text-white shadow-xs">
            <Bot className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1f883d] dark:bg-[#39d353] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1f883d] dark:bg-[#39d353] border border-white dark:border-[#161b22]" />
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#1f2328] dark:text-[#f0f6fc] tracking-tight flex items-center gap-1.5">
              <span>Ask AI Copilot</span>
              <Sparkles className="h-3 w-3 text-[#d29922] dark:text-[#e3b341] opacity-80 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
              Harsh&apos;s Backend Specialist
            </span>
          </div>
        </button>
      )}

      {/* Main Theme-Adaptive Chat Window */}
      {isOpen && (
        <div
          className={`relative flex flex-col rounded-3xl border border-[#d0d7de]/90 dark:border-white/10 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] ring-1 ring-black/5 dark:ring-white/5 overflow-hidden transition-[width,height] duration-300 ease-in-out ${
            isExpanded
              ? "h-[680px] w-[calc(100vw-2.5rem)] sm:w-[680px]"
              : "h-[580px] w-[340px] sm:w-[440px]"
          }`}
        >
          {/* Subtle Ambient Top Border Highlight */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#0969da] dark:via-[#58a6ff] to-transparent opacity-80" />

          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#d0d7de]/80 dark:border-[#30363d]/90 bg-[#f6f8fa]/90 dark:bg-[#161b22]/90 px-4 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0969da] via-[#1a73e8] to-[#6366f1] text-white shadow-md border border-white/20">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1f883d] dark:bg-[#39d353] border-2 border-white dark:border-[#161b22]" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-bold text-[#1f2328] dark:text-[#f0f6fc] tracking-tight">
                    Harsh&apos;s Portfolio Copilot
                  </h3>
                  <span className="rounded-full bg-[#0969da]/10 dark:bg-[#0969da]/20 px-2 py-0.5 text-[9px] font-mono font-bold text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 dark:border-[#58a6ff]/30 flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 text-[#1f883d] dark:text-[#39d353]" />
                    <span>Real-time SSE</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
                  Backend & Cloud Infrastructure Specialist
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse View" : "Expand Full Window"}
                className="p-1.5 rounded-xl text-[#57606a] dark:text-[#8b949e] hover:bg-[#d0d7de]/50 dark:hover:bg-[#30363d] hover:text-[#24292f] dark:hover:text-[#f0f6fc] transition-colors"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleClear}
                title="Reset Conversation"
                className="p-1.5 rounded-xl text-[#57606a] dark:text-[#8b949e] hover:bg-[#d0d7de]/50 dark:hover:bg-[#30363d] hover:text-[#24292f] dark:hover:text-[#f0f6fc] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize Window"
                className="p-1.5 rounded-xl text-[#57606a] dark:text-[#8b949e] hover:bg-[#d0d7de]/50 dark:hover:bg-[#30363d] hover:text-[#24292f] dark:hover:text-[#f0f6fc] transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs [scrollbar-width:thin]" aria-live="polite" role="log">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0969da]/10 to-[#58a6ff]/20 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#58a6ff]/30 shadow-2xs mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div className="flex flex-col space-y-2.5 max-w-[88%]">
                  <div
                    className={`group relative rounded-2xl px-4 py-3.5 leading-relaxed shadow-xs transition-all ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-[#0969da] via-[#1a73e8] to-[#1f6beb] text-white rounded-br-xs font-sans font-medium text-xs sm:text-[13px] shadow-sm"
                        : "bg-white/90 dark:bg-[#161b22]/90 backdrop-blur-md text-[#24292f] dark:text-[#c9d1d9] border border-[#d0d7de]/70 dark:border-[#30363d]/80 rounded-tl-xs font-sans shadow-2xs"
                    }`}
                  >
                    {m.sender === "bot" ? (
                      <>
                        {renderRichMessage(m.text)}
                        {m.isStreaming && (
                          <span className="inline-block w-1.5 h-3.5 ml-1.5 bg-[#0969da] dark:bg-[#58a6ff] rounded-xs animate-pulse align-middle" />
                        )}
                      </>
                    ) : (
                      m.text
                    )}

                    {/* Copy Button for Bot Messages */}
                    {m.sender === "bot" && m.text && (
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(m.id, m.text)}
                        className="absolute top-2.5 right-2.5 p-1 rounded-md bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] opacity-0 group-hover:opacity-100 text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-white transition-all duration-150 shadow-xs"
                        title="Copy Answer"
                      >
                        {copiedId === m.id ? (
                          <Check className="h-3 w-3 text-[#1f883d] dark:text-[#39d353]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}

                    {/* Source Citation Badges */}
                    {m.sender === "bot" && m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#d0d7de]/50 dark:border-[#30363d]/60 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-1">
                          <Bookmark className="h-3 w-3 text-[#0969da] dark:text-[#58a6ff]" />
                          <span>Verified Sources:</span>
                        </span>
                        {m.sources.map((src, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md bg-[#0969da]/8 dark:bg-[#388bfd]/15 px-2 py-0.5 font-mono font-medium text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#388bfd]/30"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dynamic Interactive Action Cards */}
                  {m.sender === "bot" && m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {m.actions.map((act, aIdx) => {
                        const isInternal = act.url.startsWith("/");
                        const isPrimary = act.variant === "primary";

                        if (isInternal) {
                          return (
                            <Link
                              key={aIdx}
                              href={act.url}
                              className={`group inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-sans font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                                isPrimary
                                  ? "bg-gradient-to-r from-[#0969da] via-[#1a73e8] to-[#1f6beb] text-white shadow-[0_4px_14px_rgba(9,105,218,0.3)] hover:shadow-[0_6px_20px_rgba(9,105,218,0.45)] border border-blue-400/30"
                                  : "bg-white dark:bg-[#161b22] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#24292f] dark:text-[#f0f6fc] border border-[#d0d7de] dark:border-[#30363d] hover:border-[#0969da] dark:hover:border-[#58a6ff] shadow-2xs hover:shadow-xs"
                              }`}
                            >
                              <ActionCardIcon name={act.icon} isPrimary={isPrimary} />
                              <span>{act.label}</span>
                              <ArrowUpRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isPrimary ? "text-white" : "opacity-60 group-hover:opacity-100"}`} />
                            </Link>
                          );
                        }

                        return (
                          <a
                            key={aIdx}
                            href={act.url}
                            target={act.url.startsWith("mailto:") ? "_self" : "_blank"}
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-sans font-semibold bg-white dark:bg-[#161b22] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#24292f] dark:text-[#f0f6fc] border border-[#d0d7de] dark:border-[#30363d] hover:border-[#1f883d] dark:hover:border-[#39d353] shadow-2xs hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                          >
                            <ActionCardIcon name={act.icon} isPrimary={false} />
                            <span>{act.label}</span>
                            {act.url.startsWith("mailto:") ? (
                              <Mail className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353] opacity-80 group-hover:opacity-100" />
                            ) : (
                              <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            )}
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Contextual Follow-Up Suggestions */}
                  {m.sender === "bot" && m.suggestions && m.suggestions.length > 0 && !loading && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-1.5 font-medium">
                        <Sparkles className="h-3 w-3 text-[#d29922] dark:text-[#e3b341]" />
                        <span>Suggested follow-up questions:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={(e) => {
                              (e.currentTarget as HTMLElement).blur();
                              handleSend(sug);
                            }}
                            onMouseLeave={(e) => (e.currentTarget as HTMLElement).blur()}
                            className="group text-left rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] active:bg-[#f0f3f6] dark:active:bg-[#282e33] hover:border-[#0969da]/60 dark:hover:border-[#58a6ff]/60 px-2.5 py-1.5 text-xs font-sans font-medium text-[#24292f] dark:text-[#c9d1d9] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-all duration-150 shadow-2xs hover:shadow-xs flex items-center gap-2 active:scale-[0.98] select-none cursor-pointer focus:outline-hidden"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0969da] dark:bg-[#58a6ff] opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            <span className="leading-tight">{sug}</span>
                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0 text-[#0969da] dark:text-[#58a6ff]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[#d0d7de]/60 dark:bg-[#30363d] text-[#24292f] dark:text-[#f0f6fc] mt-0.5 shadow-2xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing status indicator if waiting for initial stream tokens */}
            {loading && messages.length > 0 && messages[messages.length - 1].text === "" && (
              <div className="flex items-center gap-3 text-[#57606a] dark:text-[#8b949e] bg-white/90 dark:bg-[#161b22]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#d0d7de]/70 dark:border-[#30363d] w-fit shadow-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0969da]/10 dark:bg-[#388bfd]/20 text-[#0969da] dark:text-[#58a6ff]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-[#0969da] dark:text-[#58a6ff]">{statusStep}</span>
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

          {/* Categorized Quick Preset Chips Bar */}
          <div className="relative border-t border-[#d0d7de]/80 dark:border-[#30363d]/80 bg-[#f6f8fa]/95 dark:bg-[#161b22]/95 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {currentPresets.map((preset, idx) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      (e.currentTarget as HTMLElement).blur();
                      handleSend(preset.query);
                    }}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).blur()}
                    disabled={loading}
                    className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] active:bg-[#ebf0f4] dark:active:bg-[#282e33] px-2.5 py-1.5 text-xs font-sans font-medium text-[#24292f] dark:text-[#c9d1d9] hover:border-[#0969da]/60 dark:hover:border-[#58a6ff]/60 hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-[0.97] disabled:opacity-50 select-none cursor-pointer focus:outline-hidden"
                  >
                    <IconComp className={`h-3.5 w-3.5 flex-shrink-0 ${preset.color || "text-[#0969da] dark:text-[#58a6ff]"} transition-transform group-hover:scale-110`} />
                    <span className="leading-none">{preset.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Subtle Right Edge Fade Indicator */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#f6f8fa] dark:from-[#161b22] to-transparent" />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-[#d0d7de]/80 dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI about Harsh's backend projects, AWS, experience..."
              disabled={loading}
              className="flex-1 bg-[#f6f8fa] dark:bg-[#161b22] rounded-xl border border-[#d0d7de] dark:border-[#30363d] px-3.5 py-2.5 text-xs text-[#24292f] dark:text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#0969da] dark:focus:border-[#58a6ff] focus:ring-2 focus:ring-[#0969da]/20 dark:focus:ring-[#58a6ff]/20 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0969da] to-[#1f6beb] hover:from-[#0859b8] hover:to-[#1a5bc7] text-white disabled:opacity-40 transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
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

