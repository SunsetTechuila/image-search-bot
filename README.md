# image-search-bot

A Telegram bot that uses Telegram servers as a proxy to bypass Yandex CAPTCHAs.

Works inline like `@pic` bot, but doesn't reject NSFW search queries and results.

Backend is built with [Bun](https://github.com/oven-sh/bun), [Elysia](https://github.com/elysiajs/elysia) and [mtcute](https://github.com/mtcute/mtcute), frontend is built with [grammY](https://github.com/grammyjs/grammY) and hosted on [Cloudflare Workers](https://workers.cloudflare.com).
