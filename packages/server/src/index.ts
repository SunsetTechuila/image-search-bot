import { z } from "zod";
import { Elysia } from "elysia";

import { YandexSearchProvider } from "./search/providers";
import { PasswordChecker } from "./authentification";
import { ConsoleLogger } from "./logging";

export type { SearchResult } from "./search/interfaces";
export type ImageSearchServer = typeof imageSearchServer;

const EnvironmentVariablesSchema = z.object({
  TELEGRAM_API_ID: z.coerce.number(),
  TELEGRAM_API_HASH: z.string(),
  TELEGRAM_USER_SESSION: z.string().optional(),
  SEARCH_SERVER_PASSWORD: z.string(),
  TLS_CERT_PATH: z.string().optional(),
  TLS_KEY_PATH: z.string().optional(),
});
const {
  TELEGRAM_API_ID,
  TELEGRAM_API_HASH,
  TELEGRAM_USER_SESSION,
  SEARCH_SERVER_PASSWORD,
  TLS_CERT_PATH,
  TLS_KEY_PATH,
} = EnvironmentVariablesSchema.parse(process.env);

const passwordChecker = new PasswordChecker(SEARCH_SERVER_PASSWORD, {
  logger: new ConsoleLogger({ componentName: PasswordChecker.pluginName }),
});
const mainLogger = new ConsoleLogger({ componentName: "Server" });

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
        logger: new ConsoleLogger({ componentName:YandexSearchProvider.name}),
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
