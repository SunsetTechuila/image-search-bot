// @ts-check

import eslint from "@eslint/js";
import typescriptEslint from "typescript-eslint";
import pluginSonarJs from "eslint-plugin-sonarjs";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginImportX from "eslint-plugin-import-x";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import configPrettier from "eslint-config-prettier";

export default typescriptEslint.config({
  extends: [
    eslint.configs.recommended,
    typescriptEslint.configs.recommendedTypeChecked,
    typescriptEslint.configs.stylisticTypeChecked,
    pluginSonarJs.configs.recommended,
    pluginUnicorn.configs.recommended,
    pluginImportX.flatConfigs.recommended,
    pluginImportX.flatConfigs.typescript,
    configPrettier,
  ],
  plugins: {
    "@typescript-eslint": typescriptEslint.plugin,
    pluginImportX,
  },
  languageOptions: {
    parser: typescriptEslint.parser,
    parserOptions: {
      tsconfigRootDir: import.meta.dir,
      project: "./**/tsconfig.json",
    },
  },
  settings: {
    "import-x/resolver-next": [
      createTypeScriptImportResolver({
        bun: true,
        project: "./**/tsconfig.json",
      }),
    ],
  },
  rules: {
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          camelCase: true,
          pascalCase: true,
          kebabCase: false,
          snakeCase: false,
        },
      },
    ],
    "sonarjs/todo-tag": "warn",
    "import-x/no-deprecated": "error",
    "import-x/no-empty-named-blocks": "error",
    "import-x/no-mutable-exports": "error",
    "import-x/no-absolute-path": "error",
    "import-x/no-cycle": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../../*"],
            message: "Usage of relative parent imports is not allowed.",
          },
        ],
      },
    ],
    "import-x/no-useless-path-segments": "error",
    "import-x/first": "error",
  },
  ignores: ["node_modules/**", "**/eslint.config.js"],
});
