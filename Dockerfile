FROM oven/bun:1 AS base
WORKDIR /server

FROM base AS install
COPY packages/image-search-server packages/image-search-server
COPY packages/shared packages/shared
COPY package.json bun.lockb /
RUN cd packages/image-search-server && bun install --frozen-lockfile --production

FROM base AS release
COPY --from=install /server/node_modules node_modules
COPY . .

USER image-search-server
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "--cwd", "packages/image-search-server", "start" ]
