// @ts-check

import typescriptEslint from "typescript-eslint";

import rootConfig from "../../eslint.config.js";

export default typescriptEslint.config({
  extends: [...rootConfig],
  rules: {
    "unicorn/no-process-exit": "off",
    "unicorn/prefer-top-level-await": "off",
  },
});
