import { z } from "zod";
import { Elysia } from "elysia";

import { YandexSearchProvider } from "./search/providers";
import { PasswordChecker } from "./authentification";
import { type LogLevelName, Logger } from "./interfaces";
import { ConsoleLogger } from "./logging";

export type { SearchResult } from "./search/interfaces";
export type ImageSearchServer = typeof imageSearchServer;

const DEFAULT_LOG_LEVEL = "INFO" satisfies LogLevelName;

const EnvironmentVariablesSchema = z.object({
  LOG_LEVEL: z
    .string()
    .transform((value) => value.toUpperCase())
    .pipe(z.enum(Object.values(Logger.LOG_LEVEL_NAMES) as [LogLevelName, ...LogLevelName[]]))
    .default(DEFAULT_LOG_LEVEL),
  TELEGRAM_API_ID: z.coerce.number(),
  TELEGRAM_API_HASH: z.string(),
  TELEGRAM_USER_SESSION: z.string().optional(),
  SEARCH_SERVER_PASSWORD: z.string(),
  TLS_CERT_PATH: z.string().optional(),
  TLS_KEY_PATH: z.string().optional(),
});
const {
  LOG_LEVEL,
  TELEGRAM_API_ID,
  TELEGRAM_API_HASH,
  TELEGRAM_USER_SESSION,
  SEARCH_SERVER_PASSWORD,
  TLS_CERT_PATH,
  TLS_KEY_PATH,
} = EnvironmentVariablesSchema.parse(process.env);

const TARGET_LOG_LEVEL = Logger.LOG_LEVELS[LOG_LEVEL];

const passwordChecker = new PasswordChecker(SEARCH_SERVER_PASSWORD, {
  logger: new ConsoleLogger({
    componentName: PasswordChecker.pluginName,
    logLevel: TARGET_LOG_LEVEL,
  }),
});
const mainLogger = new ConsoleLogger({ componentName: "Server", logLevel: TARGET_LOG_LEVEL });

mainLogger.info("Starting server...");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const imageSearchServer = new Elysia({
  serve: {
    tls: {
      cert: TLS_CERT_PATH ? Bun.file(TLS_CERT_PATH) : undefined,
      key: TLS_KEY_PATH ? Bun.file(TLS_KEY_PATH) : undefined,
    },
  },
})
  .use(
    (
      await YandexSearchProvider.create({
        logger: new ConsoleLogger({ componentName:YandexSearchProvider.name, logLevel: TARGET_LOG_LEVEL }),
        macros: [passwordChecker],
        telegramApiId: TELEGRAM_API_ID,
        telegramApiHash: TELEGRAM_API_HASH,
        telegramUserSession: TELEGRAM_USER_SESSION,
      })
      // prettier-ignore
      // eslint-disable-next-line unicorn/no-await-expression-member
    ).plugin,
  )
  .onError((error) => {
    console.error("Error occurred while processing request:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  })
  .listen(process.env.PORT ?? 3000);

mainLogger.info("Server started successfully");
