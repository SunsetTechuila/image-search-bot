import { Elysia } from "elysia";

import type { ILogger, Macro } from "../..";

export interface PasswordCheckerOptions {
  logger?: ILogger;
  skipOnDevelopment?: boolean;
}

export class PasswordChecker implements Macro {
  static readonly pluginName = "Password Checker";

  static readonly macroName = "auth";

  readonly #password: string;

  readonly #logger?: ILogger;

  readonly #skipOnDevelopment: boolean;

  public constructor(password: string, options: PasswordCheckerOptions = {}) {
    this.#password = password;
    this.#logger = options.logger;
    this.#skipOnDevelopment = options.skipOnDevelopment ?? true;
  }

  public get plugin() {
    const password = this.#password;
    const logger = this.#logger;
    const skipOnDevelopment = this.#skipOnDevelopment;

    return new Elysia({ name: PasswordChecker.pluginName }).macro({
      [PasswordChecker.macroName]: {
        beforeHandle({ error, headers }) {
          if (process.env.NODE_ENV === "development" && skipOnDevelopment) {
            logger?.warn("Skipping password check in development mode");
            return;
          }

          logger?.info("Checking password...");
          if (headers.password !== password) {
            logger?.error("Password check failed. Sending error...");
            return error(401);
          }
        },
      },
    });
  }
}
