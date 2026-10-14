import { listUserProfilesRoute } from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.route";
import Link from "next/link";
import { connection } from "next/server";
import { createUserProfileAction } from "@/actions/users/profiles/create/create-user-profile.action";
import { UserProfileForm } from "@/components/users/profiles/form/user-profile-form.component";
import { requestApi } from "@/services/api/requests/request-api.service";
import { describeApiFailure } from "@/services/api/results/describe-api-failure.service";

export default async function ProfilesPage() {
  await connection();
  const result = await requestApi({
    route: listUserProfilesRoute,
    params: null,
    query: { limit: 50, offset: 0 },
    body: null,
  });

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-8 p-6">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        Home
      </Link>
      <h1 className="text-2xl font-bold">User profiles</h1>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">New profile</h2>
        <UserProfileForm
          action={createUserProfileAction}
          initialState={{
            kind: "editing",
            values: { firstName: "", lastName: "" },
          }}
          submitLabel="Create profile"
        />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Newest profiles</h2>
        {result.kind !== "success" ? (
          <p className="text-destructive">{describeApiFailure(result)}</p>
        ) : result.response.data.profiles.length === 0 ? (
          <p className="text-muted-foreground">No profiles yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {result.response.data.profiles.map((profile) => (
              <li key={profile.id}>
                <Link
                  href={`/profiles/${profile.id}`}
                  className="block py-2 hover:underline"
                >
                  {profile.firstName} {profile.lastName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
