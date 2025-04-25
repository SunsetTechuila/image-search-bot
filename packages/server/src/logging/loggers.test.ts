// General test for all loggers
// Don't use to test implementation-specific details
// Use the specific test files for that like `consoleLogger.test.ts` or `fileLogger.test.ts`
// No, this comment wasn't added by AI

import { describe, expect, test, beforeEach, afterEach, spyOn } from "bun:test";

import { Logger, type LoggerOptions } from "../interfaces";
import { ConsoleLogger } from ".";

interface LoggerTestObject {
  loggerClass: typeof Logger;
  getDebugSpy: () => ReturnType<typeof spyOn>;
  getInfoSpy: () => ReturnType<typeof spyOn>;
  getWarnSpy: () => ReturnType<typeof spyOn>;
  getErrorSpy: () => ReturnType<typeof spyOn>;
}

const loggers = [
  {
    loggerClass: ConsoleLogger,
    getDebugSpy: () => spyOn(console, "debug"),
    getInfoSpy: () => spyOn(console, "info"),
    getWarnSpy: () => spyOn(console, "warn"),
    getErrorSpy: () => spyOn(console, "error"),
  },
] satisfies LoggerTestObject[];

for (const logger of loggers) {
  const { loggerClass, getDebugSpy, getInfoSpy, getWarnSpy, getErrorSpy } = logger;

  describe(`${loggerClass.name} general test`, () => {
    const options: LoggerOptions = {
      componentName: "TestComponent",
      logLevel: Logger.LOG_LEVELS.INFO,
    };

    let debugSpy: ReturnType<typeof getDebugSpy>;
    let infoSpy: ReturnType<typeof getInfoSpy>;
    let warnSpy: ReturnType<typeof getWarnSpy>;
    let errorSpy: ReturnType<typeof getErrorSpy>;

    beforeEach(() => {
      options.logLevel = Logger.LOG_LEVELS.INFO;

      debugSpy = getDebugSpy().mockImplementation(() => {
        return;
      });
      infoSpy = getInfoSpy().mockImplementation(() => {
        return;
      });
      warnSpy = getWarnSpy().mockImplementation(() => {
        return;
      });
      errorSpy = getErrorSpy().mockImplementation(() => {
        return;
      });
    });

    afterEach(() => {
      debugSpy.mockRestore();
      infoSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    });

    test("should default to INFO level if LOG_LEVEL is not set", () => {
      delete options.logLevel;
      const defaultLogger = new loggerClass(options);

      defaultLogger.debug("Debug message");
      defaultLogger.info("Info message");
      defaultLogger.warn("Warn message");
      defaultLogger.error("Error message");

      expect(debugSpy).not.toHaveBeenCalled();
      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    test("should respect DEBUG log level", () => {
      options.logLevel = Logger.LOG_LEVELS.DEBUG;
      const debugLogger = new loggerClass(options);

      debugLogger.debug("Debug message");
      debugLogger.info("Info message");
      debugLogger.warn("Warn message");
      debugLogger.error("Error message");

      expect(debugSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    test("should respect WARN log level", () => {
      options.logLevel = Logger.LOG_LEVELS.WARN;
      const warnLogger = new loggerClass(options);

      warnLogger.debug("Debug message");
      warnLogger.info("Info message");
      warnLogger.warn("Warn message");
      warnLogger.error("Error message");

      expect(debugSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    test("should respect ERROR log level", () => {
      options.logLevel = Logger.LOG_LEVELS.ERROR;
      const errorLogger = new loggerClass(options);

      errorLogger.debug("Debug message");
      errorLogger.info("Info message");
      errorLogger.warn("Warn message");
      errorLogger.error("Error message");

      expect(debugSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    test("should throw an error for invalid log levels", () => {
      // @ts-expect-error this is a test for invalid log levels
      options.logLevel = 10;

      expect(() => {
        // eslint-disable-next-line sonarjs/constructor-for-side-effects
        new loggerClass(options);
      }).toThrowError();
    });

    test("should format log messages correctly", () => {
      const logger = new loggerClass(options);

      logger.info("Simple message");
      const loggedMessage = infoSpy.mock.calls[0]?.[0] as unknown;

      // [Timestamp] [TestComponent] [INFO] Simple message
      expect(loggedMessage).toMatch(/^\[.+?\]\s\[TestComponent\]\s\[INFO\]\sSimple message$/);
    });
  });
}
