import { getUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/get/get-user-profile.route";
import { userProfileParamsSchema } from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { updateUserProfileAction } from "@/actions/users/profiles/update/update-user-profile.action";
import { UserProfileForm } from "@/components/users/profiles/form/user-profile-form.component";
import { requestApi } from "@/services/api/requests/request-api.service";
import { describeApiFailure } from "@/services/api/results/describe-api-failure.service";
import type { ProfilePageProps } from "@/types/app/profiles/profile-page-props.interface";

export default async function ProfilePage({ params }: ProfilePageProps) {
  await connection();
  const parsedParams = userProfileParamsSchema.safeParse(await params);
  if (!parsedParams.success) notFound();

  const result = await requestApi({
    route: getUserProfileRoute,
    params: parsedParams.data,
    query: null,
    body: null,
  });
  if (result.kind === "failure" && result.response.error.code === "NOT_FOUND") {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <Link
        href="/profiles"
        className="text-sm text-muted-foreground hover:underline"
      >
        All profiles
      </Link>
      {result.kind !== "success" ? (
        <p className="text-destructive">{describeApiFailure(result)}</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold">
            {result.response.data.profile.firstName}{" "}
            {result.response.data.profile.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Updated {result.response.data.profile.updatedAt}
          </p>
          <UserProfileForm
            action={updateUserProfileAction.bind(
              null,
              result.response.data.profile.id,
            )}
            initialState={{
              kind: "editing",
              values: {
                firstName: result.response.data.profile.firstName,
                lastName: result.response.data.profile.lastName,
              },
            }}
            submitLabel="Save changes"
          />
        </>
      )}
    </main>
  );
}
