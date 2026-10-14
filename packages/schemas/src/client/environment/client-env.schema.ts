import { z } from "zod";

export const clientEnvSchema = z.object({
  /* Contains the API server's base URL, read at request time by the web client's server. */
  SERVER_URL: z.url(),
});
