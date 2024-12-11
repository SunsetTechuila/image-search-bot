# syntax=docker/dockerfile:1.7-labs

FROM oven/bun:1 AS base

FROM base AS install
WORKDIR /temp
COPY --exclude=**/src . .
RUN cd packages/image-search-server && bun install --frozen-lockfile --production

FROM base AS release
WORKDIR /server
COPY --from=install /temp/node_modules node_modules
COPY . .
RUN cd /server/packages/image-search-server && bun install --frozen-lockfile --production

USER image-search-server
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "--cwd", "packages/image-search-server", "start" ]
