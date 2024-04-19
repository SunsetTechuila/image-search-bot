import { TelegramClient } from "@mtcute/bun";
import { tl } from "@mtcute/tl";

import extractImageLinks from "./modules/extractImageLinks";
import getSearchUrl from "./modules/getSearchUrl";

export interface ImageFetcherOptions {
  telegramApiId: number;
  telegramApiHash: string;
  telegramUserSession?: string;
}

export interface FetchImagesOptions {
  searchQuery: string;
  offset?: number;
  retries?: number;
}

export default class ImageFetcher {
  readonly #telegramClient;

  private constructor(telegramClient: TelegramClient) {
    this.#telegramClient = telegramClient;
  }

  static async create(options: ImageFetcherOptions): Promise<ImageFetcher> {
    const {
      telegramApiId: apiId,
      telegramApiHash: apiHash,
      telegramUserSession: userSession,
    } = options;

    const telegramClient = new TelegramClient({ apiId, apiHash });
    if (userSession) await telegramClient.importSession(userSession);
    await telegramClient.start();

    return new ImageFetcher(telegramClient);
  }

  async fetchImages(options: FetchImagesOptions): Promise<string[]> {
    const { searchQuery, offset = 0, retries = 5 } = options;
    const remainingRetries = retries - 1;

    const { webpage } = await this.#telegramClient.call({
      _: "messages.getWebPage",
      url: getSearchUrl(searchQuery, offset),
      hash: 0,
    });

    if (!ImageFetcher.#isWebPageWithDocument(webpage)) {
      if (remainingRetries < 1) throw new Error("Failed to fetch images");
      await Bun.sleep(1000);
      return await this.fetchImages({ searchQuery, offset, retries: remainingRetries });
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
        dcId: dcId,
        fileSize: size,
      },
    );

    const jsonString = Buffer.from(buffer).toString();
    const jsonObject = await JSON.parse(jsonString);

    const imageUrls = extractImageLinks(jsonObject);
    if (imageUrls.length === 0) throw new Error("No images found");
    return imageUrls;
  }

  static #isWebPageWithDocument(
    webPage: tl.TypeWebPage,
  ): webPage is tl.RawWebPage & { document: tl.RawDocument } {
    return "document" in webPage && "size" in (webPage.document ?? {});
  }
}
