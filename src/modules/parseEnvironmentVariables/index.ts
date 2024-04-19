import { z } from "zod";

export type Environment = Record<string, string | undefined>;

export type EnvironmentVariables = z.infer<typeof EnvironmentVariablesSchema>;

export default function parseEnvironmentVariables(environment: Environment): EnvironmentVariables {
  return EnvironmentVariablesSchema.parse(environment);
}

const EnvironmentVariablesSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_API_ID: z.coerce.number(),
  TELEGRAM_API_HASH: z.string(),
  TELEGRAM_USER_SESSION: z.string().optional(),
  ALLOWED_USERS: z.string(),
});
