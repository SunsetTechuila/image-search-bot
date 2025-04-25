import { test, expect, describe, beforeAll, setDefaultTimeout } from "bun:test";

import { Elysia, type AnyElysia } from "elysia";

import type { SearchResult } from "../../interfaces";
import { YandexSearchProvider } from ".";

describe("YandexSearchProvider", () => {
  setDefaultTimeout(10_000);

  const {
    TELEGRAM_API_ID: telegramApiId,
    TELEGRAM_API_HASH: telegramApiHash,
    TELEGRAM_USER_SESSION: telegramUserSession,
  } = process.env;
  if (!telegramApiId || !telegramApiHash) throw new Error("Missing environment variables");

  let searchProvider: YandexSearchProvider;
  let server: AnyElysia;

  beforeAll(async () => {
    searchProvider = await YandexSearchProvider.create({
      telegramApiId: Number.parseInt(telegramApiId),
      telegramApiHash,
      telegramUserSession,
    });

    server = new Elysia().use(searchProvider.plugin);
  });

  test("should be able to fetch images", async () => {
    const response = await server.handle(new Request("http://localhost/yandex?query=cat"));
    const results = (await response.json()) as SearchResult[];

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);

    for (const result of results) {
      expect(result).toHaveProperty("caption");
      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("width");
      expect(result).toHaveProperty("height");
      expect(result).toHaveProperty("duplicates");
      for (const duplicate of result.duplicates) {
        expect(duplicate).toHaveProperty("url");
        expect(duplicate).toHaveProperty("width");
        expect(duplicate).toHaveProperty("height");
        expect(duplicate).toHaveProperty("sizeInBytes");
      }
    }
  });

  test("pages shouldn't be identical", async () => {
    const response1 = await server.handle(new Request("http://localhost/yandex?query=cat&page=1"));
    const response2 = await server.handle(new Request("http://localhost/yandex?query=cat&page=2"));

    const results1 = (await response1.json()) as SearchResult[];
    const results2 = (await response2.json()) as SearchResult[];

    expect(results1).not.toEqual(results2);
  });

  test("should ignore empty queries", async () => {
    const response = await server.handle(new Request("http://localhost/yandex?query="));

    expect(response.status).toBe(422);
  });
});
