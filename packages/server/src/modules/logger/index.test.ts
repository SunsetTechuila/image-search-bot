import { describe, expect, test, beforeEach, afterEach, spyOn } from "bun:test";

import { Logger } from ".";

describe("Logger", () => {
  // otherwise undefined will be fucking converted to a string in beforeEach OMG
  // https://nodejs.org/api/process.html#processenv
  const originalLogLevel = process.env.LOG_LEVEL ?? "INFO";

  let infoSpy: ReturnType<typeof spyOn<Console, "info">>;
  let warnSpy: ReturnType<typeof spyOn<Console, "warn">>;
  let errorSpy: ReturnType<typeof spyOn<Console, "error">>;

  beforeEach(() => {
    process.env.LOG_LEVEL = originalLogLevel;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    infoSpy = spyOn(console, "info").mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    warnSpy = spyOn(console, "warn").mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    errorSpy = spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("should default to INFO level if LOG_LEVEL is not set", () => {
    delete process.env.LOG_LEVEL;
    const defaultLogger = new Logger("DefaultLevelLogger");

    defaultLogger.info("Info message");
    defaultLogger.warn("Warn message");
    defaultLogger.error("Error message");

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  test("should respect WARN log level", () => {
    process.env.LOG_LEVEL = "WARN";
    const warnLogger = new Logger("WarnLevelLogger");

    warnLogger.info("Info message");
    warnLogger.warn("Warn message");
    warnLogger.error("Error message");

    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  test("should respect ERROR log level", () => {
    process.env.LOG_LEVEL = "ERROR";
    const errorLogger = new Logger("ErrorLevelLogger");

    errorLogger.info("Info message");
    errorLogger.warn("Warn message");
    errorLogger.error("Error message");

    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  test("should throw an error for invalid log levels", () => {
    process.env.LOG_LEVEL = "INVALID";

    expect(() => {
      // eslint-disable-next-line sonarjs/constructor-for-side-effects
      new Logger("InvalidLevelLogger");
    }).toThrowError();
  });

  test("should format log messages correctly", () => {
    const logger = new Logger("TestLogger");

    logger.info("Simple message");
    const loggedMessage = infoSpy.mock.calls[0]?.[0] as unknown;

    // [Timestamp] [TestLogger] [INFO] Simple message
    expect(loggedMessage).toMatch(/^\[.+?\]\s\[TestLogger\]\s\[INFO\]\sSimple message$/);
  });
});
