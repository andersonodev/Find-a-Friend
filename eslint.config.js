import { ESLint } from "eslint";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
    },
    rules: {
      "max-len": ["error", { code: 120 }], // Increased max length for better readability
      "object-curly-spacing": ["error", "always"], // Enforce consistent spacing
      indent: ["error", 2], // Ensure 2-space indentation
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "import/no-duplicates": "error",
    },
  },
];
