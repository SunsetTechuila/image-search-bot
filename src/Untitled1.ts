import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const client = new TelegramClient(
  new StringSession(
    "1AgAOMTQ5LjE1NC4xNjcuNDEBu2SDQG/uQF8gMWahsXIkDTDV9cDyq7m1NamQBHoQkKolXXUp7uIMkcCpRY69OsdLGdYULVis1HNmFa1jlLMNko5jxntXLa9i0WgHj5bwb7zz3F4zdVHbTEhcSff5Ijmr/XZK+qLthlRWwPbv3GnDRh8EI6JTxP9IOUoD/Qu2ODjgDvfHCZSPMOZZTpBJOcHv809jOWRjvnLSe7WAa1BmM8VdZVshzHq5ux2uZ1DeVV4mHdePeNPtDDE70TEyzeCNVjiPjZRat5u1IAZ4R9Z3a4BKtBu6YiuoRLsptd1KMxYe7Va64m9rSsuyEwZSdXovmYRrRryUI0Qp8m+NVhynguM=",
  ),
  15_032_187,
  "a0b22634a2f364fc4d54cb8f5da81886",
  {},
);
await client.connect();

const result = await client.invoke(
  new Api.messages.GetWebPage({
    url: "https://yandex.ru/images/search?format=json&request=%7B%22blocks%22%3A%5B%7B%22block%22%3A%7B%22block%22%3A%22i-react-ajax-adapter%3Aajax%22%7D%2C%22params%22%3A%7B%22type%22%3A%22ImagesApp%22%2C%22ajaxKey%22%3A%22serpList%2Ffetch%22%7D%2C%22version%22%3A2%7D%5D%7D&yu=&text=%D0%A1%D0%9C%D0%9E%D0%A2%D0%A0%D0%98%2B%D0%A1%D0%AE%D0%94%D0%90",
  }),
);

const { id, accessHash, fileReference, dcId, size } = (result.toJSON().webpage as Api.WebPage)
  .document as Api.Document;

const buffer = await client.downloadFile(
  new Api.InputDocumentFileLocation({
    id,
    accessHash,
    fileReference,
    thumbSize: "",
  }),
  {
    dcId,
    fileSize: size,
  },
);

const jsonString = buffer!.toString('utf8'); // Предполагается, что кодировка UTF-8

// Парсинг строки как JSON
const jsonObject = JSON.parse(jsonString);

console.log(jsonObject.blocks[0].params.adapterData.serpList.items.entities);
