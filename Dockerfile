# syntax=docker/dockerfile:1.7-labs

FROM oven/bun@sha256:e8e1d291c25b617d7dda08c839fe00d1524a8ccb253c37eb8e9c6e0525da3c89 AS base

FROM base AS install
WORKDIR /temp
COPY --exclude=**/src . .
RUN cd packages/image-search-server && bun install --frozen-lockfile --production

FROM base AS release
WORKDIR /usr/src/app
COPY --from=install /temp/node_modules node_modules
COPY . .

RUN chown -R bun:bun /usr/src/app/packages/image-search-server

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "--cwd", "packages/image-search-server", "start" ]
