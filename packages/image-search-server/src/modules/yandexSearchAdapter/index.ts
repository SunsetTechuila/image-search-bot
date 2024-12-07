import type { Image } from "shared/types";

import type { SearchAdapter } from "@types";
import { TelegramFetcher, createSearchUrl, parseSearchResult } from "./modules";

export interface YandexSearchAdapterOptions {
  telegramApiId: number;
  telegramApiHash: string;
  telegramUserSession?: string;
}

export default class YandexSearchAdapter implements SearchAdapter {
  readonly #telegramFetcher: TelegramFetcher;

  private constructor(telegramFetcher: TelegramFetcher) {
    this.#telegramFetcher = telegramFetcher;
  }

  public async search(query: string, page?: number): Promise<Image[]> {
    const searchUrl = createSearchUrl(query, page);
    const searchResult = await this.#telegramFetcher.fetchFile(searchUrl);
    const images = parseSearchResult(searchResult.toString());

    return images;
  }

  public static async create(options: YandexSearchAdapterOptions): Promise<YandexSearchAdapter> {
    const { telegramApiId, telegramApiHash, telegramUserSession } = options;

    const telegramFetcher = await TelegramFetcher.create({
      apiId: telegramApiId,
      apiHash: telegramApiHash,
      userSession: telegramUserSession,
    });

    return new YandexSearchAdapter(telegramFetcher);
  }
}
