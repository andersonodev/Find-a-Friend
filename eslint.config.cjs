import {ESLint} from "eslint";

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      import: require("eslint-plugin-import"),
    },
    rules: {
      "max-len": ["error", {code: 80}],
      "object-curly-spacing": ["error", "never"],
      indent: ["error", 2],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "import/no-duplicates": "error",
    },
  },
];
