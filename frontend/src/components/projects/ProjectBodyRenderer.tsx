import React from "react";
import { Terminal } from "lucide-react";

interface ProjectBodyRendererProps {
  content: string;
}

// Rich text helper to convert `code` and **bold** into styled React elements
function renderRichText(text: string): React.ReactNode[] {
  // Regex to split by `code` or **bold**
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return tokens.map((token, i) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      const codeText = token.slice(1, -1);
      return (
        <code
          key={i}
          className="mx-0.5 rounded-md bg-[#0969da]/10 dark:bg-[#58a6ff]/15 border border-[#0969da]/20 dark:border-[#58a6ff]/30 px-1.5 py-0.5 font-mono text-xs font-semibold text-[#0969da] dark:text-[#58a6ff]"
        >
          {codeText}
        </code>
      );
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      const boldText = token.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-[#24292f] dark:text-[#f0f6fc]">
          {boldText}
        </strong>
      );
    }
    return <span key={i}>{token}</span>;
  });
}

export function ProjectBodyRenderer({ content }: ProjectBodyRendererProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let nodeIndex = 0;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) return;

    if (trimmed.startsWith("### ")) {
      const title = trimmed.replace("### ", "").trim();
      elements.push(
        <div
          key={`h3-${index}`}
          className="flex items-center gap-2.5 pt-6 pb-2 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 mb-4"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0969da]/10 dark:bg-[#58a6ff]/15 text-[#0969da] dark:text-[#58a6ff]">
            <Terminal className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc] tracking-tight">
            {title}
          </h3>
        </div>
      );
    } else if (trimmed.startsWith("## ")) {
      const title = trimmed.replace("## ", "").trim();
      elements.push(
        <h2
          key={`h2-${index}`}
          className="text-lg font-bold text-[#24292f] dark:text-[#f0f6fc] pt-6 pb-2 border-b border-[#d0d7de] dark:border-[#30363d] mb-4"
        >
          {title}
        </h2>
      );
    } else if (trimmed.startsWith("- ")) {
      nodeIndex += 1;
      const itemText = trimmed.replace(/^- /, "").trim();

      // Extract **Title**: Description or Title: Description
      const match = itemText.match(/^(\*\*.*?\*\*|[^:]+):\s*(.*)/);
      let titlePart = "";
      let descPart = itemText;

      if (match) {
        titlePart = match[1].replace(/\*\*/g, "").trim();
        descPart = match[2].trim();
      }

      elements.push(
        <div
          key={`node-${index}`}
          className="group relative overflow-hidden rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 hover:shadow-md hover:-translate-y-0.5 my-3"
        >
          <div className="flex items-start gap-4">
            {/* Step Badge */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] font-mono text-xs font-bold text-[#0969da] dark:text-[#58a6ff] group-hover:bg-[#0969da] group-hover:text-white dark:group-hover:bg-[#58a6ff] dark:group-hover:text-[#0d1117] transition-colors">
              {String(nodeIndex).padStart(2, "0")}
            </div>

            <div className="space-y-1 flex-1">
              {titlePart ? (
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                    {titlePart}
                  </h4>
                </div>
              ) : null}

              <div className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                {renderRichText(descPart)}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      elements.push(
        <p key={`p-${index}`} className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed my-2">
          {renderRichText(trimmed)}
        </p>
      );
    }
  });

  return <div className="space-y-2">{elements}</div>;
}
