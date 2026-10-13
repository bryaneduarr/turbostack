import type { signInSchema } from "@workspace/schemas/authentication/sign-in/sign-in.schema";
import type { z } from "zod";

type ValidatedSignInData = z.output<typeof signInSchema>;

/* Represents validated credentials submitted to sign in to an account. */
export interface ValidatedSignInCredentials extends ValidatedSignInData {
  /* Identifies the account using its validated lowercase email address. */
  email: ValidatedSignInData["email"];
  /* Contains the nonempty password preserved as submitted for authentication. */
  password: ValidatedSignInData["password"];
}
