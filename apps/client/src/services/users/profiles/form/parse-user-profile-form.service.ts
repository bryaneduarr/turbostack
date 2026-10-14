import { userProfileNamesSchema } from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import { z } from "zod";
import type { ParsedUserProfileForm } from "@/types/users/profiles/form/parsed-user-profile-form.interface";

// Browsers always submit text inputs, so a missing entry means nothing was typed.
function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseUserProfileForm(
  formData: FormData,
): ParsedUserProfileForm {
  const values = {
    firstName: readText(formData, "firstName"),
    lastName: readText(formData, "lastName"),
  };
  const result = userProfileNamesSchema.safeParse(values);
  if (result.success) return { kind: "valid", values, names: result.data };

  const { fieldErrors } = z.flattenError(result.error);
  return {
    kind: "invalid",
    state: {
      kind: "invalid",
      values,
      fieldErrors: {
        firstName: fieldErrors.firstName ?? [],
        lastName: fieldErrors.lastName ?? [],
      },
    },
  };
}
