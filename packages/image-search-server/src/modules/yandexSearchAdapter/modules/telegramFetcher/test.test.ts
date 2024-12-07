import { expect, test } from "bun:test";

import TelegramFetcher from ".";

const {
  TELEGRAM_API_ID: apiId,
  TELEGRAM_API_HASH: apiHash,
  TELEGRAM_USER_SESSION: userSession,
} = process.env;
if (!apiId || !apiHash) throw new Error("Missing environment variables");

test("can fetch a file", async () => {
  const telegramWebFetcher = await TelegramFetcher.create({
    apiId: Number.parseInt(apiId),
    apiHash,
    userSession,
  });

  const content = await telegramWebFetcher.fetchFile("https://api.github.com");

  expect(content).toBeInstanceOf(Buffer);
  expect(content.length).toBeGreaterThan(0);
});
