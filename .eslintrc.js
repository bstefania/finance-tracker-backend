module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["functions/tsconfig.json", "functions/tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/dist/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "unused-imports/no-unused-imports": ["warn", "never"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "semi": ["warn", "never"],
    "max-len": ["error", {"code": 120}],
    "new-cap": ["off", "never"],
    "require-jsdoc": ["off", "never"],
  },
}
