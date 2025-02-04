import type { SearchResult } from "shared/types";
import {
  Bot,
  webhookCallback,
  InlineQueryResultBuilder,
  type Filter,
  type FilterQuery,
  Context,
} from "grammy";

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

export default class ImageSearchBot {
  readonly #allowedUserIds;

  readonly #webhookCallback;

  readonly #searchServerAddress;

  readonly #searchServerPassword;

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
    this.#searchServerAddress = searchServerAddress;
    this.#searchServerPassword = searchServerPassword;
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

    const result = await fetch(
      `${this.#searchServerAddress}/yandex?query=${encodeURIComponent(query)}&page=${currentOffset}`,
      {
        headers: {
          password: this.#searchServerPassword,
        },
      },
    );
    if (!result.ok) {
      throw new Error(`Failed to fetch images: ${result.statusText}`);
    }

    const results: SearchResult[] = await result.json();

    await context.answerInlineQuery(
      results.map((result, index) => InlineQueryResultBuilder.photo(`image-${index}`, result.url)),
      {
        next_offset: (Number.parseInt(currentOffset) + 1).toString(),
        cache_time: THIRTY_MINUTES_SEC,
      },
    );
  }
}
