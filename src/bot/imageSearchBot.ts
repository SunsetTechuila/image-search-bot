import {
  Bot,
  webhookCallback,
  InlineQueryResultBuilder,
  Filter,
  FilterQuery,
  Context,
} from "grammy";
import { TelegramClient } from "gramjs-cfw/client/TelegramClient";
import { StringSession } from "gramjs-cfw/sessions/StringSession";

// import extractImageLinks from "./extractImageLinks";

export type SupportedAdapters = Parameters<typeof webhookCallback>[1];

export interface ImageSearchBotOptions {
  token: string;
  apiID: number;
  apiHash: string;
  session: string;
  allowedUserIDs: string[];
  storageChatID: string;
}

type FilteredContext<Q extends FilterQuery> = Filter<Context, Q>;
type InlineQueryContext = FilteredContext<"inline_query">;

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export default class ImageSearchBot {
  readonly #bot;

  readonly #client;

  readonly #allowedUserIDs;

  readonly #storageChatID;

  private constructor(
    bot: Bot,
    client: TelegramClient,
    allowedUserIDs: string[],
    storageChatID: string,
  ) {
    this.#bot = bot;
    this.#client = client;
    this.#allowedUserIDs = allowedUserIDs;
    this.#storageChatID = storageChatID;
  }

  static async create(options: ImageSearchBotOptions): Promise<ImageSearchBot> {
    const { token, apiID, apiHash, session, allowedUserIDs, storageChatID } = options;

    const client = new TelegramClient(new StringSession(session), apiID, apiHash, {});
    await client.connect();

    const bot = new Bot(token);
    const imageSearchBot = new ImageSearchBot(bot, client, allowedUserIDs, storageChatID);
    bot.on("inline_query", (context) => imageSearchBot.#processInlineQuery(context));

    return imageSearchBot;
  }

  async getWebHookCallback(adapter: SupportedAdapters, request: Request): Promise<Response> {
    const callback = webhookCallback(this.#bot, adapter);
    return (await callback(request)) as Promise<Response>;
  }

  // async findImages(searchQuery: string) {}

  async #processInlineQuery(context: InlineQueryContext): Promise<void> {
    const { inlineQuery } = context;

    await this.#bot.api.sendMessage(5_963_288_998, `Search query: ${inlineQuery.query}`);
    await this.#client.sendMessage("@reddxae", {message: `тест говна блять`});

    if (!inlineQuery.query || !this.#isAllowedUser(context)) return;

    await this.#bot.api.sendMessage(5_963_288_998, `Search query: ${inlineQuery.query}`);

    await context.answerInlineQuery([
      InlineQueryResultBuilder.article(inlineQuery.query, "test").text("Push my buttons"),
    ]);
  }

  #isAllowedUser(context: Context): boolean {
    return this.#allowedUserIDs.includes(context.from?.id.toString() ?? "");
  }
}
