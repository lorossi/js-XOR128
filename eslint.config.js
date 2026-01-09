import { jsdoc } from "eslint-plugin-jsdoc";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    files: ["**/*.js"],
  },
  jsdoc({
    config: "flat/recommended",
    rules: {
      "jsdoc/reject-any-type": "off",
    },
  }),
]);
