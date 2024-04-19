import { expect, test } from "bun:test";
import ImageFetcher from ".";

const {
  TELEGRAM_API_ID: apiId,
  TELEGRAM_API_HASH: apiHash,
  TELEGRAM_USER_SESSION: userSession,
} = process.env;
if (!apiId || !apiHash || !userSession) {
  throw new Error("Missing environment variables");
}

const imageFetcher = await ImageFetcher.create({
  telegramApiId: Number(apiId),
  telegramApiHash: apiHash,
  telegramUserSession: userSession,
});

test("fetchImages", async () => {
  const images = await imageFetcher.fetchImages({ searchQuery: "cats" });
  images.forEach((image) => expect(image).toBeString());
});
