/**
 * @param componentName The name of the component using this logger that will be prefixed to all log messages
 * @param logLevel The lowest type of logs you want to see for this logger. See `Logger.LOG_LEVELS` for available log levels
 */
export interface LoggerOptions {
  componentName: string;
  logLevel: LogLevel;
}

export type LogLevel = (typeof Logger.LOG_LEVELS)[keyof typeof Logger.LOG_LEVELS];
export type LogLevelName = (typeof Logger.LOG_LEVEL_NAMES)[keyof typeof Logger.LOG_LEVEL_NAMES];

export abstract class Logger {
  public static readonly LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  } as const;

  public static readonly LOG_LEVEL_NAMES = {
    [Logger.LOG_LEVELS.DEBUG]: "DEBUG",
    [Logger.LOG_LEVELS.INFO]: "INFO",
    [Logger.LOG_LEVELS.WARN]: "WARN",
    [Logger.LOG_LEVELS.ERROR]: "ERROR",
  } as const;

  protected readonly componentName: string;

  protected readonly targetLogLevel: LogLevel;

  public constructor(options: LoggerOptions) {
    this.componentName = options.componentName;
    this.targetLogLevel = options.logLevel;
  }

  public debug(message: string): void {
    if (this.targetLogLevel <= Logger.LOG_LEVELS.DEBUG) {
      this.debugImplementation(this.formatInputMessage(message, Logger.LOG_LEVELS.DEBUG));
    }
  }

  public info(message: string): void {
    if (this.targetLogLevel <= Logger.LOG_LEVELS.INFO) {
      this.infoImplementation(this.formatInputMessage(message, Logger.LOG_LEVELS.INFO));
    }
  }

  public warn(message: string): void {
    if (this.targetLogLevel <= Logger.LOG_LEVELS.WARN) {
      this.warnImplementation(this.formatInputMessage(message, Logger.LOG_LEVELS.WARN));
    }
  }

  public error(message: string): void {
    if (this.targetLogLevel <= Logger.LOG_LEVELS.ERROR) {
      this.errorImplementation(this.formatInputMessage(message, Logger.LOG_LEVELS.ERROR));
    }
  }

  protected abstract debugImplementation(message: string): void;

  protected abstract infoImplementation(message: string): void;

  protected abstract warnImplementation(message: string): void;

  protected abstract errorImplementation(message: string): void;

  protected formatInputMessage(inputMessage: string, logLevel: LogLevel): string {
    const timestamp = new Date().toUTCString();
    const logLevelName = Logger.LOG_LEVEL_NAMES[logLevel];

    return `[${timestamp}] [${this.componentName}] [${logLevelName}] ${inputMessage}`;
  }
}
