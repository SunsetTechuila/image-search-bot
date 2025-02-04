import { z } from "zod";
import { Elysia, t } from "elysia";
import type { SearchResult } from "shared/types";

import { YandexSearchAdapter } from "./modules";

async function main() {
  const EnvironmentVariablesSchema = z.object({
    TELEGRAM_API_ID: z.coerce.number(),
    TELEGRAM_API_HASH: z.string(),
    TELEGRAM_USER_SESSION: z.string().optional(),
    SEARCH_SERVER_PASSWORD: z.string(),
    TLS_CERT_PATH: z.string().optional(),
    TLS_KEY_PATH: z.string().optional(),
  });

  console.log("Checking environment variables...");
  const {
    TELEGRAM_API_ID,
    TELEGRAM_API_HASH,
    TELEGRAM_USER_SESSION,
    SEARCH_SERVER_PASSWORD,
    TLS_CERT_PATH,
    TLS_KEY_PATH,
  } = EnvironmentVariablesSchema.parse(process.env);

  console.log("Creating Yandex search adapter...");
  const yandexSearchAdapter = await YandexSearchAdapter.create({
    telegramApiId: TELEGRAM_API_ID,
    telegramApiHash: TELEGRAM_API_HASH,
    telegramUserSession: TELEGRAM_USER_SESSION,
  });

  console.log("Starting server...");
  new Elysia({
    serve: {
      tls: {
        cert: TLS_CERT_PATH ? Bun.file(TLS_CERT_PATH) : undefined,
        key: TLS_KEY_PATH ? Bun.file(TLS_KEY_PATH) : undefined,
      },
    },
  })
    .guard({
      beforeHandle({ error, headers }) {
        if (process.env.NODE_ENV === "development") {
          console.log("[GUARD] Skipping password check in development mode");
          return;
        }

        console.log("[GUARD] Checking password...");
        if (headers.password !== SEARCH_SERVER_PASSWORD) {
          console.log("[GUARD] Password check failed. Sending error...");
          return error(401);
        }
      },
    })
    .get(
      "/yandex",
      async ({ query, error: returnError }) => {
        console.log("Received request. Processing...");

        let results: SearchResult[];
        try {
          results = await yandexSearchAdapter.search(query.query, query.page);
        } catch (error) {
          console.error("Error occurred while processing request:", error);
          return returnError(500);
        }

        console.log("Request processed. Sending response...");
        return results;
      },
      {
        query: t.Object({
          query: t.String(),
          page: t.Optional(t.Numeric()),
        }),
      },
    )
    .listen(process.env.PORT ?? 3000);
}

main().catch((error) => {
  console.error("Error occurred while starting server:", error);
  process.exit(1);
});
