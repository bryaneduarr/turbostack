import { expect, test } from "@playwright/test";
import { createUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/create/create-user-profile.route";
import { getUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/get/get-user-profile.route";
import { updateUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/update/update-user-profile.route";
import { requestE2eApi } from "@/e2e/api/requests/request-e2e-api.service";
import { requireApiSuccess } from "@/e2e/api/results/require-api-success.service";

test.describe("user profile API", () => {
  test("creates, renames, and reads a profile", async () => {
    const lastName = `Contract ${crypto.randomUUID().slice(0, 8)}`;
    const created = requireApiSuccess(
      await requestE2eApi({
        route: createUserProfileRoute,
        params: null,
        query: null,
        body: { firstName: "Ada", lastName },
      }),
    );
    const profileId = created.data.profile.id;

    requireApiSuccess(
      await requestE2eApi({
        route: updateUserProfileRoute,
        params: { profileId },
        query: null,
        body: { firstName: "Grace", lastName },
      }),
    );
    const read = requireApiSuccess(
      await requestE2eApi({
        route: getUserProfileRoute,
        params: { profileId },
        query: null,
        body: null,
      }),
    );

    expect(read.data.profile).toMatchObject({ firstName: "Grace", lastName });
  });

  test("rejects blank names with a validation error and a request ID", async () => {
    const result = await requestE2eApi({
      route: createUserProfileRoute,
      params: null,
      query: null,
      body: { firstName: "", lastName: "" },
    });

    expect(result.kind).toBe("failure");
    if (result.kind !== "failure") return;
    expect(result.response.error.code).toBe("VALIDATION");
    expect(result.response.requestId).toMatch(/^[0-9a-f-]{36}$/);
  });
});
