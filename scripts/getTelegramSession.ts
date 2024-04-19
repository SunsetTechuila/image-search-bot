import { TelegramClient } from "telegram/client/TelegramClient";
import { StringSession } from "telegram/sessions/StringSession";

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

const apiId = await getInput("Please enter your app API ID: ");
const apiHash = await getInput("Please enter your app API hash: ");

const client = new TelegramClient(new StringSession(""), Number(apiId), apiHash, {});
const { ipAddress, port } = await client.getDC(4, false, true);
client.session.setDC(4, ipAddress, port);

await client.start({
  phoneNumber: async () => await getInput("Please enter your number: "),
  password: async () => await getInput("Please enter your password: "),
  phoneCode: async () => await getInput("Please enter the code you received: "),
  onError: (error) => {
    throw error;
  },
});

console.log(client.session.save());
