import { Elysia } from "elysia";

export interface PasswordCheckerOptions {
  skipOnDevelopment?: boolean;
}

const passwordChecker = (password: string, options: PasswordCheckerOptions = {}) =>
  new Elysia().guard({
    beforeHandle({ error, headers }) {
      if (process.env.NODE_ENV === "development" && !options.skipOnDevelopment) {
        console.log("[GUARD] Skipping password check in development mode");
        return;
      }

      console.log("[GUARD] Checking password...");
      if (headers.password !== password) {
        console.log("[GUARD] Password check failed. Sending error...");
        return error(401);
      }
    },
  });

export default passwordChecker;
