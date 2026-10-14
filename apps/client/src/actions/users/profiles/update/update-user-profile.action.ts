"use server";

import { updateUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/update/update-user-profile.route";
import { userProfileParamsSchema } from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import { revalidatePath } from "next/cache";
import { requestApi } from "@/services/api/requests/request-api.service";
import { describeApiFailure } from "@/services/api/results/describe-api-failure.service";
import { parseUserProfileForm } from "@/services/users/profiles/form/parse-user-profile-form.service";
import type { UserProfileFormState } from "@/types/users/profiles/form/user-profile-form.interface";

export async function updateUserProfileAction(
  profileId: string,
  _state: UserProfileFormState,
  formData: FormData,
): Promise<UserProfileFormState> {
  const form = parseUserProfileForm(formData);
  if (form.kind === "invalid") return form.state;
  // Bound arguments still arrive from the browser, so the ID is validated too.
  const params = userProfileParamsSchema.safeParse({ profileId });
  if (!params.success) {
    return { kind: "failed", values: form.values, message: "Unknown profile." };
  }

  const result = await requestApi({
    route: updateUserProfileRoute,
    params: params.data,
    query: null,
    body: form.names,
  });
  if (result.kind !== "success") {
    return {
      kind: "failed",
      values: form.values,
      message: describeApiFailure(result),
    };
  }

  revalidatePath("/profiles");
  revalidatePath(`/profiles/${params.data.profileId}`);
  const { firstName, lastName } = result.response.data.profile;
  return {
    kind: "saved",
    values: { firstName, lastName },
    message: "Profile updated.",
  };
}
