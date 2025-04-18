import ImageSearchBot from "./bot";

export default {
  async fetch(request: Request, environment: Environment): Promise<Response> {
    console.log("Received request");

    if (!isValidRequest(request)) {
      return new Response("Invalid request");
    }

    console.log("Checking environment variables...");
    const {
      TELEGRAM_BOT_TOKEN: telegramBotToken,
      ALLOWED_USERS: allowedUsers,
      SEARCH_SERVER_ADDRESS: searchServerAddress,
      SEARCH_SERVER_PASSWORD: searchServerPassword,
    } = environment;

    if (!telegramBotToken || !allowedUsers || !searchServerAddress || !searchServerPassword) {
      return new Response("Missing environment variables");
    }

    const allowedUserIds = allowedUsers.split(",").map((id) => Number.parseInt(id));

    console.log("Creating bot...");
    const bot = new ImageSearchBot({
      frameworkAdapter: "cloudflare-mod",
      botToken: telegramBotToken,
      allowedUserIds: allowedUserIds,
      searchServerAddress,
      searchServerPassword,
    });

    console.log("Processing request...");
    return await bot.processRequest(request);
  },
};

function isValidRequest(request: Request): boolean {
  const { method, url, headers } = request;
  return (
    method === "POST" &&
    new URL(url).pathname === "/webhooks/telegram" &&
    headers.get("content-type") === "application/json"
  );
}
