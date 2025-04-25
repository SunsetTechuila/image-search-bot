import { Elysia, t } from "elysia";

import type { Logger, Plugin, Macro } from "../../../interfaces";
import type { SearchResult } from "../../interfaces";
import { TelegramFetcher, createSearchUrl, transformSearchResult } from "./modules";

export interface YandexSearchProviderOptions {
  logger?: Logger;
  macros?: Macro[];
  telegramApiId: number;
  telegramApiHash: string;
  telegramUserSession?: string;
}

export class YandexSearchProvider implements Plugin {
  static readonly name = "Yandex Search Provider";

  readonly #logger?: Logger;

  readonly #macros?: Macro[];

  readonly #telegramFetcher: TelegramFetcher;

  private constructor(telegramFetcher: TelegramFetcher, logger?: Logger, macros?: Macro[]) {
    this.#logger = logger;
    this.#macros = macros;
    this.#telegramFetcher = telegramFetcher;
  }

  public static async create(options: YandexSearchProviderOptions): Promise<YandexSearchProvider> {
    const { logger, macros, telegramApiId, telegramApiHash, telegramUserSession } = options;
    logger?.info("Initializing Yandex Search Provider...");

    logger?.info("Initializing Telegram Fetcher...");
    const telegramFetcher = await TelegramFetcher.create({
      apiId: telegramApiId,
      apiHash: telegramApiHash,
      userSession: telegramUserSession,
    });
    logger?.info("Telegram Fetcher initialized.");

    return new YandexSearchProvider(telegramFetcher, logger, macros);
  }

  public get plugin() {
    const macros: Record<string, boolean> = {};
    if (this.#macros) {
      for (const macro of this.#macros) {
        macros[(macro.constructor as typeof Macro).macroName] = true;
      }
    }

    const server = new Elysia({
      name: YandexSearchProvider.name,
    }).get(
      "/yandex",
      async ({ query }) => {
        const results = await this.#search(query.query, query.page);
        this.#logger?.info("Request processed. Sending response...");

        return results;
      },
      {
        query: t.Object({
          query: t.String({ minLength: 1 }),
          page: t.Optional(t.Numeric()),
        }),
        ...macros,
      },
    );

    if (this.#macros) {
      for (const macro of this.#macros) {
        server.use(macro.plugin);
      }
    }

    return server;
  }

  async #search(query: string, page?: number): Promise<SearchResult[]> {
    this.#logger?.info("Processing request...");

    this.#logger?.info("Forming search URL...");
    const searchUrl = createSearchUrl(query, page);
    this.#logger?.info("Search URL formed");

    this.#logger?.info(`Fetching search results...`);
    const searchResult = await this.#telegramFetcher.fetchFile(searchUrl);
    this.#logger?.info("Search results fetched");

    this.#logger?.info("Transforming search results...");
    const results = transformSearchResult(searchResult.toString());
    this.#logger?.info("Search results transformed");

    this.#logger?.info(`Got ${results.length} results`);
    return results;
  }
}
