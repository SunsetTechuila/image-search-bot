import { TelegramClient } from "@mtcute/bun";
import { tl } from "@mtcute/tl";

export interface TelegramFetcherOptions {
  apiId: number;
  apiHash: string;
  userSession?: string;
}

export class TelegramFetcher {
  readonly #telegramClient;

  private constructor(telegramClient: TelegramClient) {
    this.#telegramClient = telegramClient;
  }

  public static async create(options: TelegramFetcherOptions): Promise<TelegramFetcher> {
    const { apiId, apiHash, userSession } = options;

    const telegramClient = new TelegramClient({ apiId, apiHash });
    if (userSession) await telegramClient.importSession(userSession);
    await telegramClient.start();

    return new TelegramFetcher(telegramClient);
  }

  public async fetchFile(url: string, retries = 5): Promise<Buffer> {
    const remainingRetries = retries - 1;

    const { webpage } = await this.#telegramClient.call({
      _: "messages.getWebPage",
      url,
      hash: 0,
    });

    if (!TelegramFetcher.#isWebPageWithDocument(webpage)) {
      if (remainingRetries < 1) throw new Error("Failed to fetch webpage content");
      await Bun.sleep(1000);
      return await this.fetchFile(url, remainingRetries);
    }

    const { id, accessHash, fileReference, dcId, size } = webpage.document;
    const buffer = await this.#telegramClient.downloadAsBuffer(
      {
        _: "inputDocumentFileLocation",
        id,
        accessHash,
        fileReference,
        thumbSize: "",
      },
      {
        dcId,
        fileSize: size,
      },
    );

    return Buffer.from(buffer);
  }

  static #isWebPageWithDocument(
    webPage: tl.TypeWebPage,
  ): webPage is tl.RawWebPage & { document: tl.RawDocument } {
    return "document" in webPage && "size" in (webPage.document ?? {});
  }
}
