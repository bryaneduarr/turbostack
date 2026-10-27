import { afterAll, describe, expect, it } from "bun:test";
import { usersProfile } from "@workspace/database/tables/users/profile/user-profile.table";
import { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import { listUserProfilesResponseSchema } from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.schema";
import { userProfileResponseSchema } from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import {
  CREATED,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY,
} from "@workspace/utils/http/status-codes/http-status-code.constant";
import { inArray } from "drizzle-orm";
import app from "@/application.module";
import { fixtureDb } from "@/db/testing/fixtures/connection/fixture-database-connection.config";

const profilesUrl = "http://localhost/api/v1/users/profiles";
const createdProfileIds: string[] = [];

function sendJson(url: string, method: "POST" | "PUT", body: unknown) {
  return app.handle(
    new Request(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

async function createProfile(firstName: string, lastName: string) {
  const response = await sendJson(profilesUrl, "POST", { firstName, lastName });
  const { data } = userProfileResponseSchema.parse(await response.json());
  createdProfileIds.push(data.profile.id);
  return { response, profile: data.profile };
}

afterAll(async () => {
  if (createdProfileIds.length > 0) {
    await fixtureDb
      .delete(usersProfile)
      .where(inArray(usersProfile.id, createdProfileIds));
  }
});

describe("user profiles", () => {
  it("creates, reads, replaces, and lists a profile", async () => {
    const created = await createProfile("  Ada ", "Lovelace");
    expect(created.response.status).toBe(CREATED);
    expect(created.profile.firstName).toBe("Ada");

    const read = await app.handle(
      new Request(`${profilesUrl}/${created.profile.id}`),
    );
    expect(read.status).toBe(OK);
    expect(
      userProfileResponseSchema.parse(await read.json()).data.profile,
    ).toEqual(created.profile);

    const updated = await sendJson(
      `${profilesUrl}/${created.profile.id}`,
      "PUT",
      { firstName: "Augusta", lastName: "King" },
    );
    const { profile } = userProfileResponseSchema.parse(
      await updated.json(),
    ).data;
    expect(updated.status).toBe(OK);
    expect(profile).toMatchObject({ firstName: "Augusta", lastName: "King" });

    const listed = await app.handle(
      new Request(`${profilesUrl}?limit=100&offset=0`),
    );
    const { profiles } = listUserProfilesResponseSchema.parse(
      await listed.json(),
    ).data;
    expect(listed.status).toBe(OK);
    expect(profiles.map(({ id }) => id)).toContain(created.profile.id);
  });

  it("lists newest profiles first and honors limit and offset", async () => {
    const older = await createProfile("Older", "Profile");
    const newer = await createProfile("Newer", "Profile");

    const firstPage = await app.handle(
      new Request(`${profilesUrl}?limit=1&offset=0`),
    );
    const secondPage = await app.handle(
      new Request(`${profilesUrl}?limit=1&offset=1`),
    );

    const firstProfiles = listUserProfilesResponseSchema.parse(
      await firstPage.json(),
    ).data.profiles;
    const secondProfiles = listUserProfilesResponseSchema.parse(
      await secondPage.json(),
    ).data.profiles;
    expect(firstProfiles.map(({ id }) => id)).toEqual([newer.profile.id]);
    expect(secondProfiles.map(({ id }) => id)).toEqual([older.profile.id]);
  });

  it("returns NOT_FOUND for a profile that does not exist", async () => {
    const response = await app.handle(
      new Request(`${profilesUrl}/${crypto.randomUUID()}`),
    );
    const body = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(NOT_FOUND);
    expect(body.message).toBe("User profile not found.");
  });

  it("rejects invalid names, path parameters, and query values", async () => {
    const responses = await Promise.all([
      sendJson(profilesUrl, "POST", { firstName: " ", lastName: "Lovelace" }),
      sendJson(profilesUrl, "POST", { firstName: "Ada" }),
      app.handle(new Request(`${profilesUrl}/not-a-uuid`)),
      app.handle(new Request(`${profilesUrl}?limit=0&offset=0`)),
      app.handle(new Request(profilesUrl)),
    ]);

    for (const response of responses) {
      const body = errorResponseSchema.parse(await response.json());
      expect(response.status).toBe(UNPROCESSABLE_ENTITY);
      expect(body.error.code).toBe("VALIDATION");
    }
  });
});
