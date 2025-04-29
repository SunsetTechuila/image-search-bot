import { Elysia } from "elysia";

import type { Logger, Macro } from "../../interfaces";

export interface PasswordCheckerOptions {
  logger?: Logger;
  skipOnDevelopment?: boolean;
}

export class PasswordChecker implements Macro {
  static readonly pluginName = "Password Checker";

  static readonly macroName = "auth";

  readonly #password: string;

  readonly #logger?: Logger;

  readonly #skipOnDevelopment: boolean;

  public constructor(password: string, options: PasswordCheckerOptions = {}) {
    this.#password = password;
    this.#logger = options.logger;
    this.#skipOnDevelopment = options.skipOnDevelopment ?? true;
  }

  public get plugin() {
    const logger = this.#logger;
    const checkPassword = this.#checkPassword.bind(this);

    return new Elysia({ name: PasswordChecker.pluginName }).macro({
      [PasswordChecker.macroName]: {
        beforeHandle({ error, headers }) {
          if (!checkPassword(headers.password)) {
            logger?.info("Sending error...");
            return error(401);
          }
        },
      },
    });
  }

  #checkPassword(password?: string): boolean {
    if (process.env.NODE_ENV === "development" && this.#skipOnDevelopment) {
      this.#logger?.warn("Skipping password check in development mode");
      return true;
    }

    this.#logger?.info("Checking password...");
    if (password !== this.#password) {
      this.#logger?.error("Password check failed.");
      return false;
    }

    this.#logger?.info("Password check passed.");
    return true;
  }
}
