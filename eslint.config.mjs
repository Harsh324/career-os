// @ts-check
import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

/** @type {import("eslint").Linter.Config[]} */
export default [
  // Base JS recommended rules
  eslint.configs.recommended,

  // TypeScript files — packages and scripts
  {
    files: ["packages/**/*.ts", "packages/**/*.tsx", "scripts/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      // Disallow any — use unknown instead (P7 — type safety)
      "@typescript-eslint/no-explicit-any": "error",
      // Allow leading underscores for intentionally unused params
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Require explicit return types on public functions in packages
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      // Enforce consistent type imports (P2 — single import style)
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
    },
  },

  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/output/**",
      "**/.turbo/**",
      "**/*.d.ts",
      // Apps manage their own ESLint configs (Next.js flat config)
      "apps/**",
    ],
  },
];
