import { describe, expect, test } from "bun:test";
import { Elysia } from "elysia";

import { PasswordChecker } from ".";

describe("PasswordChecker", () => {
  test("should skip password check in development mode", async () => {
    process.env.NODE_ENV = "development";

    const passwordChecker = new PasswordChecker("");
    const server = new Elysia()
      .use(passwordChecker.plugin)
      .get("/", () => "Hello World", { [PasswordChecker.macroName]: true });

    const response = await server.handle(new Request("http://localhost/"));

    expect(response.status).toBe(200);
  });

  test("should pass with correct password in production mode", async () => {
    process.env.NODE_ENV = "production";
    const PASSWORD = "testpassword";

    const passwordChecker = new PasswordChecker(PASSWORD);
    const server = new Elysia()
      .use(passwordChecker.plugin)
      .get("/", () => "Hello World", { [PasswordChecker.macroName]: true });

    const response = await server.handle(
      new Request("http://localhost/", {
        headers: {
          password: PASSWORD,
        },
      }),
    );

    expect(response.status).toBe(200);
  });

  test("should fail with incorrect password in production mode", async () => {
    process.env.NODE_ENV = "production";
    const PASSWORD = "testpassword";

    const passwordChecker = new PasswordChecker(PASSWORD);
    const server = new Elysia()
      .use(passwordChecker.plugin)
      .get("/", () => "Hello World", { [PasswordChecker.macroName]: true });

    const response = await server.handle(
      new Request("http://localhost/", {
        headers: {
          // eslint-disable-next-line sonarjs/no-hardcoded-passwords
          password: "wrongpassword",
        },
      }),
    );

    expect(response.status).toBe(401);
  });
});
