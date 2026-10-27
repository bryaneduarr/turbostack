import { userProfileNamesSchema } from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import { readFormText } from "@workspace/ui/services/forms/fields/read-form-text.service";
import { z } from "zod";
import type { ParsedUserProfileForm } from "@/types/users/profiles/form/parsed-user-profile-form.interface";

export function parseUserProfileForm(
  formData: FormData,
): ParsedUserProfileForm {
  const values = {
    firstName: readFormText(formData, "firstName"),
    lastName: readFormText(formData, "lastName"),
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
