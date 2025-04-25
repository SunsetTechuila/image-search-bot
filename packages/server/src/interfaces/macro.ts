import { Plugin } from "./plugin";

export abstract class Macro extends Plugin {
  static readonly macroName: string;
}
