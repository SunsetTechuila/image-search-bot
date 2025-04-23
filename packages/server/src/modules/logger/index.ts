import type { ILogger } from "../../types";

export type LogLevelName = (typeof Logger.LOG_LEVEL_NAMES)[keyof typeof Logger.LOG_LEVEL_NAMES];
type LogLevel = (typeof Logger.LOG_LEVELS)[keyof typeof Logger.LOG_LEVELS];

export class Logger implements ILogger {
  readonly #name: string;
  readonly #logLevel: LogLevel;

  public static readonly LOG_LEVELS = {
    INFO: 0,
    WARN: 1,
    ERROR: 2,
  } as const;
  public static readonly LOG_LEVEL_NAMES = {
    [Logger.LOG_LEVELS.INFO]: "INFO",
    [Logger.LOG_LEVELS.WARN]: "WARN",
    [Logger.LOG_LEVELS.ERROR]: "ERROR",
  } as const;

  public constructor(name: string) {
    this.#name = name;

    const environmentLogLevelName = process.env.LOG_LEVEL?.toUpperCase();
    if (environmentLogLevelName) {
      const logLevel = Logger.LOG_LEVELS[environmentLogLevelName as LogLevelName];
      if (logLevel == undefined) {
        const validLogLevels = Object.keys(Logger.LOG_LEVELS).join(", ");
        throw new SyntaxError(
          `Invalid log level: ${environmentLogLevelName}\nValid log levels are: ${validLogLevels}`,
        );
      }
      this.#logLevel = logLevel;
    } else {
      this.#logLevel = Logger.LOG_LEVELS.INFO;
    }
  }

  public info(message: string): void {
    if (this.#logLevel <= Logger.LOG_LEVELS.INFO) {
      console.info(this.#formatMessage(message, Logger.LOG_LEVELS.INFO));
    }
  }
  public warn(message: string): void {
    if (this.#logLevel <= Logger.LOG_LEVELS.WARN) {
      console.warn(this.#formatMessage(message, Logger.LOG_LEVELS.WARN));
    }
  }
  public error(message: string): void {
    if (this.#logLevel <= Logger.LOG_LEVELS.ERROR) {
      console.error(this.#formatMessage(message, Logger.LOG_LEVELS.ERROR));
    }
  }

  #formatMessage(message: string, logLevel: LogLevel): string {
    const timestamp = new Date().toUTCString();
    const logLevelName = Logger.LOG_LEVEL_NAMES[logLevel];
    return `[${timestamp}] [${this.#name}] [${logLevelName}] ${message}`;
  }
}
