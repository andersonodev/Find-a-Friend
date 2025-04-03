module.exports = [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      import: require("eslint-plugin-import"),
    },
    rules: {
      "max-len": ["error", { code: 120 }],
      "object-curly-spacing": ["error", "always"],
      indent: ["error", 2],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "import/no-duplicates": "error",
    },
  },
];
