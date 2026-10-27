"use server";

import { describeFailedMutation } from "@workspace/api-client/results/mutation-failure/describe-failed-mutation.service";
import { createUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/create/create-user-profile.route";
import { revalidatePath } from "next/cache";
import { requestApi } from "@/services/api/requests/request-api.service";
import { parseUserProfileForm } from "@/services/users/profiles/form/parse-user-profile-form.service";
import type { UserProfileFormState } from "@/types/users/profiles/form/user-profile-form.interface";

export async function createUserProfileAction(
  _state: UserProfileFormState,
  formData: FormData,
): Promise<UserProfileFormState> {
  const form = parseUserProfileForm(formData);
  if (form.kind === "invalid") return form.state;

  const result = await requestApi({
    route: createUserProfileRoute,
    params: null,
    query: null,
    body: form.names,
  });
  if (result.kind !== "success") {
    return { ...describeFailedMutation(result), values: form.values };
  }

  revalidatePath("/profiles");
  const { firstName, lastName } = result.response.data.profile;
  return {
    kind: "saved",
    values: { firstName: "", lastName: "" },
    message: `Created ${firstName} ${lastName}.`,
  };
}
