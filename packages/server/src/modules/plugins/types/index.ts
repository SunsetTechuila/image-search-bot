import type { AnyElysia } from "elysia";

export abstract class Plugin {
  static readonly pluginName: string;
  abstract plugin: AnyElysia;
}

export abstract class Macro extends Plugin {
  static readonly macroName: string;
}
