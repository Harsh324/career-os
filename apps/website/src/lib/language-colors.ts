export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "React.js": "#61dafb",
  React: "#61dafb",
  "Next.js": "#000000",
  "Node.js": "#339933",
  Node: "#339933",
  Python: "#3572A5",
  Docker: "#2496ed",
  Turborepo: "#ef4444",
  Zod: "#3b82f6",
  "Tailwind CSS": "#38bdf8",
  Tailwind: "#38bdf8",
  GraphQL: "#e10098",
  Rust: "#dea584",
  Go: "#00ADD8",
  Monorepo: "#ec4899",
  SDK: "#8b5cf6",
  "AI Platform": "#10b981",
};

export function getLanguageColor(techName: string): string {
  const normalized = Object.keys(LANGUAGE_COLORS).find(
    (key) => key.toLowerCase() === techName.toLowerCase()
  );
  return normalized ? LANGUAGE_COLORS[normalized] : "#8b949e";
}
