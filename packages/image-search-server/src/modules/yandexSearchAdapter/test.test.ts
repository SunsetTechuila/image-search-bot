import { test, expect } from "bun:test";

import YandexSearchAdapter from ".";

const {
  TELEGRAM_API_ID: telegramApiId,
  TELEGRAM_API_HASH: telegramApiHash,
  TELEGRAM_USER_SESSION: telegramUserSession,
} = process.env;
if (!telegramApiId || !telegramApiHash) throw new Error("Missing environment variables");

test("does return images", async () => {
  const yandexSearchAdapter = await YandexSearchAdapter.create({
    telegramApiId: Number.parseInt(telegramApiId),
    telegramApiHash,
    telegramUserSession,
  });

  const images = await yandexSearchAdapter.search("cats");

  for (const image of images) {
    expect(image).toHaveProperty("alt");
    expect(image).toHaveProperty("url");
    expect(image).toHaveProperty("width");
    expect(image).toHaveProperty("height");
  }
});
