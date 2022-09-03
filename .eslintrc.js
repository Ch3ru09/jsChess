module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    semi: ["error", "never"],
    "no-unused-vars": ["warn", { vars: "all", argsIgnorePattern: "^_" }],
    "no-undef": ["none"],
  },
};
