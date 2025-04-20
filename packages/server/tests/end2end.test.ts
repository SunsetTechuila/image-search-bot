import { test, expect, describe, setDefaultTimeout, beforeAll, afterAll } from "bun:test";
import path from "node:path";

import { treaty } from "@elysiajs/eden";

import type { ImageSearchServer } from "../src";

describe("Image Search Server E2E", () => {
  setDefaultTimeout(15_000);

  const BASE_URL = `http://localhost:${process.env.PORT ?? 3000}`;
  let serverProcess: Bun.Subprocess<"ignore", "pipe", "inherit">;
  const client = treaty<ImageSearchServer>(BASE_URL);

  beforeAll(async () => {
    console.log("Starting test server process...");
    serverProcess = Bun.spawn(["bun", "exec", "NODE_ENV='test' bun start"], {
      cwd: path.resolve(path.join(import.meta.dir, "..")),
    });

    console.log("Waiting for server to be ready...");
    const reader = serverProcess.stdout.getReader();
    const decoder = new TextDecoder();
    let isServerReady = false;

    while (!isServerReady) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });

      if (text.includes("Server started successfully")) {
        isServerReady = true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    if (!isServerReady) {
      throw new Error("Server did not start successfully");
    }
    console.log("Server is ready for testing");
  });

  afterAll(() => {
    if (serverProcess) {
      console.log("Shutting down test server...");
      serverProcess.kill();
    }
  });

  test("should return search results", async () => {
    console.log("Sending request to server...");
    const { data: searchResults } = await client.yandex.get({
      headers: { password: process.env.SEARCH_SERVER_PASSWORD ?? "" },
      query: { query: "cat" },
    });

    expect(searchResults).toBeDefined();
    expect(searchResults).toBeInstanceOf(Array);
    expect(searchResults!.length).toBeGreaterThan(0);
    expect(searchResults![0]).toHaveProperty("url");
  });
});
