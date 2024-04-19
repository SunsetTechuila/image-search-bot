import ImageSearchBot, { SupportedAdapters } from "./imageSearchBot";

export interface MainOptions {
  request: Request;
  adapter: SupportedAdapters;
  token: string;
  apiID: number;
  apiHash: string;
  session: string;
  allowedUserIDs: string[];
  storageChatID: string;
}

export default async function main(options: MainOptions): Promise<Response> {
  const imageSearchBot = await ImageSearchBot.create({ ...options });
  return await imageSearchBot.getWebHookCallback(options.adapter, options.request);
}
