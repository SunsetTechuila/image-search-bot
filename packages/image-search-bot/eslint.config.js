// @ts-check

import typescriptEslint from "typescript-eslint";

import rootConfig from "../../eslint.config.js";

export default typescriptEslint.config({
  extends: [...rootConfig],
  ignores: [...(rootConfig[0].ignores ?? []), "src/types/wrangler/*"],
});
