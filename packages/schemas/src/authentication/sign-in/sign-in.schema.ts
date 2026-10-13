import { z } from "zod";

export const signInSchema = z.object({
  /* Identifies the account with a validated email normalized to lowercase. */
  email: z.email().toLowerCase(),
  /* Requires the submitted password without trimming or other transformations. */
  password: z.string().min(1),
});
