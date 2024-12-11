# syntax=docker/dockerfile:1.7-labs

FROM oven/bun@sha256:7eb9c0438a42438d884891f5460d6f5b89c20797cb58062b6d28ccba725a8c42 AS base

FROM base AS install
WORKDIR /temp
COPY --exclude=**/src . .
RUN cd packages/image-search-server && bun install --frozen-lockfile --production

FROM base AS release
WORKDIR /usr/src/app
COPY --from=install /temp/node_modules node_modules
COPY . .

RUN chown -R bun:bun /usr/src/app

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "--cwd", "packages/image-search-server", "start" ]
