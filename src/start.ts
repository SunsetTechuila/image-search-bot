import main from "./bot";
import { TelegramClient } from "gramjs-cfw/client/TelegramClient";
import { StringSession } from "gramjs-cfw/sessions/StringSession";

interface Environment {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_API_ID?: string;
  TELEGRAM_API_HASH?: string;
  TELEGRAM_SESSION?: string;
  ALLOWED_USERS?: string;
  STORAGE_CHAT?: string;
}

export default {
  async fetch(request: Request, environment: Environment): Promise<Response> {
    // if (!isValidRequest(request)) return new Response("Invalid request");

    const {
      TELEGRAM_BOT_TOKEN: token,
      TELEGRAM_API_ID: apiID,
      TELEGRAM_API_HASH: apiHash,
      TELEGRAM_SESSION: session,
      ALLOWED_USERS: allowedUsers,
      STORAGE_CHAT: storageChatID,
    } = environment;

    if (!token || !apiID || !apiHash || !session || !allowedUsers || !storageChatID) {
      return new Response("Missing environment variables");
    }

    try {
      const client = new TelegramClient(new StringSession(session), Number(apiID), apiHash, {});
      await client.connect();
      // return await main({
      //   request,
      //   adapter: "cloudflare-mod",
      //   token,
      //   apiID: Number(apiID),
      //   apiHash,
      //   session,
      //   allowedUserIDs: allowedUsers.split(","),
      //   storageChatID,
      // });
      return new Response("Hello, World!");
    } catch (error) {
      return new Response(`Internal server error:\n${(error as Error).stack}`);
    }
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
