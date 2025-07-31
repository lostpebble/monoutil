import eslint from "@eslint/js";
import { globalIgnores } from "eslint/config";
import * as tsResolver from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * @param {{}} rules
 * @returns {{[rule: string]: "off" | "warn" | "error" }}
 */
function changeErrorRulesToWarn(rules) {
  return Object.fromEntries(
    Object.entries(rules).map(([rule, value]) => [rule, value === "off" ? "off" : "warn"]),
  );
}

const files = ["**/src/**/*.{ts,tsx}"];

export default tseslint.config(
  globalIgnores([
    "**/dist/**",
    "**/_old_core/**",
    "node_modules/**",
    "**/node_modules/**",
    "**/android/app/build/**'",
  ]),
  {
    ...eslint.configs.recommended,
    rules: changeErrorRulesToWarn(eslint.configs.recommended.rules),
    files,
  },
  tseslint.configs.recommended.map((config) => ({
    ...config,
    rules: changeErrorRulesToWarn(config.rules || {}),
    files,
  })),
  { ...importX.flatConfigs.recommended, files },
  { ...importX.flatConfigs.typescript, files },
  { ...reactCompiler.configs.recommended, files },
  {
    // extends: [expoConfig.filter((config) => !config?.name.includes("@typescript-eslint"))],
    files,
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    settings: {
      "import-x/resolver": {
        name: "tsResolver",
        options: {
          bun: true,
        },
        resolver: tsResolver,
      },
      react: {
        version: "detect",
      },
      "import-x/ignore": ["node_modules[\\\\/]+@?react-native"],
      "import/no-cycle": ["error", { maxDepth: 1, ignoreExternal: true, disableScc: true }],
      "import/ignore": ["node_modules[\\\\/]+@?react-native"],
    },
    languageOptions: {
      parserOptions: {
        projectService: false,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        exports: false,
        global: false,
        module: false,
        require: false,
      },
      sourceType: "module",
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,

      // Import Checker
      "import-x/no-named-as-default-member": "off",
      "import-x/no-cycle": "error",

      // React Compiler
      "react-compiler/react-compiler": "error",

      // React Other
      "react/display-name": "off",
      "react/no-unknown-property": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "off",
      "react/no-this-in-sfc": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // From EXPO config rules
      eqeqeq: ["warn", "smart"],

      "no-dupe-args": "error",
      "no-dupe-class-members": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",

      "@typescript-eslint/no-dupe-class-members": "error",
      "@typescript-eslint/no-require-imports": [
        "warn",
        {
          // Allow supported asset extensions:
          // https://github.com/facebook/metro/blob/9e1a6da5a7cd71bb9243f45644efe655870e5fff/packages/metro-config/src/defaults/defaults.js#L18-L53
          // https://github.com/expo/expo/blob/c774cfaa7898098411fc7e09dcb409b7cb5064f9/packages/%40expo/metro-config/src/ExpoMetroConfig.ts#L247-L254
          // Includes json which can be imported both as source and asset.
          allow: [
            "\\.(aac|aiff|avif|bmp|caf|db|gif|heic|html|jpeg|jpg|json|m4a|m4v|mov|mp3|mp4|mpeg|mpg|otf|pdf|png|psd|svg|ttf|wav|webm|webp|xml|yaml|yml|zip)$",
          ],
        },
      ],
    },
  },
  {
    files: ["**/metro.config.js"],

    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["*.web.*"],
  },
);
