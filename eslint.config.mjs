import pluginVue from "eslint-plugin-vue";
import typescriptEslint from "typescript-eslint";

import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

import js from "@eslint/js";
import unocss from "@unocss/eslint-config/flat";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  unocss,
  ...pluginVue.configs["flat/recommended"],
  ...typescriptEslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: [
      "dist",
      "node_modules",
      "dist_electron",
      "dist-electron",
      "release",
      "index.html",
      ".vscode/.debug.script.mjs",
      "**/tools/**/*.js",
      "**/*.d.ts",
    ],
  },

  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        tsconfigRootDir: import.meta.dirname,
        allowAutomaticSingleRunInference: false,
        disallowAutomaticSingleRunInference: true,
        extraFileExtensions: [".vue"],
        project: true,
      },
    },

    files: ["src/**/*.ts", "src/**/*.vue"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-implicit-any": "off",
      "vue/multi-word-component-names": "off",

      "vue/block-order": [
        "error",
        {
          order: ["script", "template", "style"],
        },
      ],
    },
  },
];
