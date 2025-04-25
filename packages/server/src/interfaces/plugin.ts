import type { AnyElysia } from "elysia";

export abstract class Plugin {
  static readonly pluginName: string;

  abstract plugin: AnyElysia;
}
