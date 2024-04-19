import parseEnvironmentVariables from "./modules/parseEnvironmentVariables";
import ImageFetcher from "./modules/imageFetcher";
import type { FetchImagesOptions } from "./modules/imageFetcher";
import ImageSearchBot from "./modules/imageSearchBot";

const {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_API_ID,
  TELEGRAM_API_HASH,
  TELEGRAM_USER_SESSION,
  ALLOWED_USERS,
} = parseEnvironmentVariables(process.env);

const imagesFetcher = await ImageFetcher.create({
  telegramApiId: TELEGRAM_API_ID,
  telegramApiHash: TELEGRAM_API_HASH,
  telegramUserSession: TELEGRAM_USER_SESSION,
});

const imageSearchBot = new ImageSearchBot({
  botToken: TELEGRAM_BOT_TOKEN,
  fetchImages: (options: FetchImagesOptions) => imagesFetcher.fetchImages(options),
  allowedUserIds: ALLOWED_USERS.split(","),
});

Bun.serve({
  async fetch(request): Promise<Response> {
    console.log("Received request");
    if (!isValidRequest(request)) return new Response("Invalid request");
    console.log("Processing request...");

    try {
      return await imageSearchBot.getWebHookCallback("bun", request);
    } catch (error) {
      console.error(error);
      return new Response("Internal server error");
    }
  },
});

function isValidRequest(request: Request): boolean {
  const { method, headers } = request;

  return method === "POST" && headers.get("content-type") === "application/json";
}
