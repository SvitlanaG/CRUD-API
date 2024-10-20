module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "prettier/prettier": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": ["warn", { allow: ["error"] }],
    "no-comments/disallowComments": [
      "warn",
      {
        allow: ["TODO", "FIXME", "NOTE", "DEBUG"],
      },
    ],
  },
};
