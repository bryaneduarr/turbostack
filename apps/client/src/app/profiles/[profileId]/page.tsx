import { getUserProfileRoute } from "@workspace/schemas/server/routes/users/profiles/get/get-user-profile.route";
import { userProfileParamsSchema } from "@workspace/schemas/server/routes/users/profiles/user-profile.schema";
import { DescriptionList } from "@workspace/ui/components/data-display/description-list/description-list.component";
import { ApiFailureAlert } from "@workspace/ui/components/feedback/api-failure-alert/api-failure-alert.component";
import { Page } from "@workspace/ui/components/layout/page/page.component";
import { Section } from "@workspace/ui/components/layout/section/section.component";
import { BackLink } from "@workspace/ui/components/link/back-link/back-link.component";
import { Heading } from "@workspace/ui/components/typography/heading/heading.component";
import { formatTimestamp } from "@workspace/utils/time/format-timestamp.service";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { updateUserProfileAction } from "@/actions/users/profiles/update/update-user-profile.action";
import { UserProfileForm } from "@/components/users/profiles/form/user-profile-form.component";
import { requestApi } from "@/services/api/requests/request-api.service";
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
    <Page width="app" align="start">
      <BackLink href="/profiles" label="All profiles" />
      {result.kind !== "success" ? (
        <>
          <Heading level={1} size="page">
            Profile
          </Heading>
          <ApiFailureAlert result={result} />
        </>
      ) : (
        <>
          <Heading level={1} size="page">
            {result.response.data.profile.firstName}{" "}
            {result.response.data.profile.lastName}
          </Heading>
          <DescriptionList
            entries={[
              {
                term: "Created",
                description: formatTimestamp(
                  result.response.data.profile.createdAt,
                ),
              },
              {
                term: "Updated",
                description: formatTimestamp(
                  result.response.data.profile.updatedAt,
                ),
              },
            ]}
          />
          <Section title="Rename">
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
          </Section>
        </>
      )}
    </Page>
  );
}
