import {
  Bot,
  webhookCallback,
  InlineQueryResultBuilder,
  type Filter,
  type FilterQuery,
  Context,
} from "grammy";
import { treaty } from "@elysiajs/eden";

import type { ImageSearchServer, SearchResult } from "image-search-server";

export type FrameworkAdapter = Parameters<typeof webhookCallback>[1];

export interface ImageSearchBotOptions {
  frameworkAdapter: FrameworkAdapter;
  botToken: string;
  allowedUserIds: number[];
  searchServerAddress: string;
  searchServerPassword: string;
}

type FilteredContext<Q extends FilterQuery> = Filter<Context, Q>;
type InlineQueryContext = FilteredContext<"inline_query">;

const THIRTY_MINUTES_SEC = 60 * 30;

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export class ImageSearchBot {
  readonly #allowedUserIds;

  readonly #webhookCallback;

  readonly #searchServerPassword;

  readonly #searchServerClient;

  constructor(options: ImageSearchBotOptions) {
    const {
      botToken,
      frameworkAdapter,
      allowedUserIds,
      searchServerAddress,
      searchServerPassword,
    } = options;

    const botClient = new Bot(botToken);
    botClient.inlineQuery(/[^ ]+/, (context) => this.#processInlineQuery(context));
    this.#webhookCallback = webhookCallback(botClient, frameworkAdapter);

    this.#allowedUserIds = allowedUserIds;
    this.#searchServerPassword = searchServerPassword;
    this.#searchServerClient = treaty<ImageSearchServer>(searchServerAddress);
  }

  public async processRequest(request: Request): Promise<Response> {
    let response: Response;

    try {
      response = (await this.#webhookCallback(request)) as Response;
    } catch (error) {
      console.error(error);
      response = new Response("Internal server error");
    }

    return response;
  }

  async #processInlineQuery(context: InlineQueryContext): Promise<void> {
    const {
      inlineQuery: { query, offset },
      from: { id },
    } = context;

    const currentOffset = offset || "0";

    if (!this.#allowedUserIds.includes(id)) return;

    const result = await this.#searchServerClient.yandex.get({
      headers: { password: this.#searchServerPassword },
      query: { query, page: Number.parseInt(currentOffset) },
    });
    if (!result.response.ok) {
      throw new Error(`Failed to fetch images: ${result.response.statusText}`);
    }

    const { data: searchResults } = result;
    if (!searchResults || searchResults.length === 0) {
      throw new Error("No search results found");
    }

    console.log(`Recieved ${searchResults.length} results`);
    const filteredUrls = ImageSearchBot.#filterSearchResults(searchResults);
    console.log(`Got ${filteredUrls.length} filtered results`);

    await context.answerInlineQuery(
      filteredUrls.map((url, index) => InlineQueryResultBuilder.photo(`image-${index}`, url)),
      {
        next_offset: (Number.parseInt(currentOffset) + 1).toString(),
        cache_time: THIRTY_MINUTES_SEC,
      },
    );
  }

  static #filterSearchResults(results: SearchResult[]): string[] {
    const filteredUrls: string[] = [];

    for (const result of results) {
      if (ImageSearchBot.#isValidImage(result.url, result.sizeInBytes ?? 0)) {
        filteredUrls.push(result.url);
        continue;
      }

      for (const duplicate of result.duplicates) {
        if (ImageSearchBot.#isValidImage(duplicate.url, duplicate.sizeInBytes)) {
          filteredUrls.push(duplicate.url);
          break;
        }
      }
    }

    return filteredUrls;
  }

  static #isValidImage(url: string, sizeInBytes: number): boolean {
    return (
      ALLOWED_EXTENSIONS.some((extension) => url.endsWith(extension)) &&
      sizeInBytes < MAX_FILE_SIZE_BYTES
    );
  }
}
