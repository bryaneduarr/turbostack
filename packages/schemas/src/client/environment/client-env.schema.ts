import { z } from "zod";

export const clientEnvSchema = z.object({
  /** Contains the API server's base URL, read at request time by the web client's server. */
  SERVER_URL: z.url(),
  /** Selects the runtime mode; production adds the HSTS header. */
  NODE_ENV: z.enum(["development", "test", "production"]),
});
