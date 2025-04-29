import eslint from "@eslint/js";
import reactCompilerPlugin from "eslint-plugin-react-compiler";
// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  defineConfig([
    globalIgnores(["**/*/dist/*", ".husky/", "dist/", "node_modules/"]),
    {
      plugins: {
        "react-compiler": reactCompilerPlugin,
      },
      rules: {
        "react-compiler/react-compiler": "error",
        "react/display-name": "off",
        "@typescript-eslint/no-unused-vars": "off",
        // "@typescript-eslint/no-empty-object-type": "off",
        // "@typescript-eslint/array-type": "off",
      },
    },
  ]),
);
