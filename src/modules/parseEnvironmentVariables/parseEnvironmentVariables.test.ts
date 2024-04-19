import { test, expect } from "bun:test";
import parseEnvironmentVariables from ".";

const environment = {
  TELEGRAM_BOT_TOKEN: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  TELEGRAM_API_ID: "123456",
  TELEGRAM_API_HASH: "abc123def456",
  TELEGRAM_USER_SESSION: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  ALLOWED_USERS: "123456, 654321",
  RANDOM: "random",
  EMPTY_STRING: "",
};

test("parseEnvVariables", () => {
  const result = parseEnvironmentVariables(environment);

  expect(result).toEqual({
    TELEGRAM_BOT_TOKEN: environment.TELEGRAM_BOT_TOKEN,
    TELEGRAM_API_ID: Number(environment.TELEGRAM_API_ID),
    TELEGRAM_API_HASH: environment.TELEGRAM_API_HASH,
    TELEGRAM_USER_SESSION: environment.TELEGRAM_USER_SESSION,
    ALLOWED_USERS: environment.ALLOWED_USERS,
  });
});
