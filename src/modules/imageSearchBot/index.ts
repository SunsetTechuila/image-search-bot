import {
  Bot,
  webhookCallback,
  InlineQueryResultBuilder,
  Filter,
  FilterQuery,
  Context,
} from "grammy";

export type SupportedAdapters = Parameters<typeof webhookCallback>[1];

export interface ImageSearchBotOptions {
  botToken: string;
  fetchImages: ({
    searchQuery,
    offset,
  }: {
    searchQuery: string;
    offset: number;
  }) => Promise<string[]>;
  allowedUserIds: string[];
}

type FilteredContext<Q extends FilterQuery> = Filter<Context, Q>;
type InlineQueryContext = FilteredContext<"inline_query">;

const THIRTY_MINUTES = 60 * 30;

export default class ImageSearchBot {
  readonly #botClient;

  readonly #fetchImages;

  readonly #allowedUserIds;

  constructor(options: ImageSearchBotOptions) {
    const { botToken, fetchImages, allowedUserIds } = options;

    const botClient = new Bot(botToken);
    botClient.inlineQuery(/[^ ]+/, (context) => this.#processInlineQuery(context));
    this.#botClient = botClient;

    this.#fetchImages = fetchImages;
    this.#allowedUserIds = allowedUserIds;
  }

  async getWebHookCallback(adapter: SupportedAdapters, request: Request): Promise<Response> {
    const callback = webhookCallback(this.#botClient, adapter);
    return (await callback(request)) as Promise<Response>;
  }

  async #processInlineQuery(context: InlineQueryContext): Promise<void> {
    const {
      inlineQuery: { query, offset },
      from: { id },
    } = context;

    if (!this.#isAllowedUserId(id)) return;

    const imageLinks = await this.#fetchImages({
      searchQuery: query,
      offset: Number(offset),
    });

    await context.answerInlineQuery(
      imageLinks.map((imageLink, index) =>
        InlineQueryResultBuilder.photo(`image-${index}`, imageLink),
      ),
      {
        next_offset: (Number(offset) + 1).toString(),
        cache_time: THIRTY_MINUTES,
      },
    );
  }

  #isAllowedUserId(id: string | number): boolean {
    return this.#allowedUserIds.includes(id.toString());
  }
}
