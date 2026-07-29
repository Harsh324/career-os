/** @type {import("prettier").Config} */
const config = {
  // Line length — 100 chars for readability in wide terminals
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  // Sort Tailwind CSS classes (requires prettier-plugin-tailwindcss)
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
