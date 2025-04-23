import { TelegramClient } from "@mtcute/bun";

import readline from "node:readline";

async function getInput(message: string): Promise<string> {
  return await new Promise((resolve) => {
    readline
      .createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      .question(message, resolve);
  });
}

const apiId = await getInput("Enter your app API ID: ");
const apiHash = await getInput("Enter your app API hash: ");

const client = new TelegramClient({ apiId: Number.parseInt(apiId), apiHash });

await client.start({
  phone: async () => await client.input("Enter your number: "),
  code: async () => await client.input("Enter the code you received: "),
  password: async () => await client.input("Enter your password: "),
});

console.log("Your session string:\n", await client.exportSession());

// eslint-disable-next-line unicorn/no-process-exit
process.exit(0);
