import { listUserProfilesRoute } from "@workspace/schemas/server/routes/users/profiles/list/list-user-profiles.route";
import {
  DividedList,
  DividedListItem,
} from "@workspace/ui/components/data-display/divided-list/divided-list.component";
import { ApiFailureAlert } from "@workspace/ui/components/feedback/api-failure-alert/api-failure-alert.component";
import { Page } from "@workspace/ui/components/layout/page/page.component";
import { Section } from "@workspace/ui/components/layout/section/section.component";
import { TextLink } from "@workspace/ui/components/link/text-link/text-link.component";
import { Heading } from "@workspace/ui/components/typography/heading/heading.component";
import { Text } from "@workspace/ui/components/typography/text/text.component";
import { connection } from "next/server";
import { createUserProfileAction } from "@/actions/users/profiles/create/create-user-profile.action";
import { UserProfileForm } from "@/components/users/profiles/form/user-profile-form.component";
import { requestApi } from "@/services/api/requests/request-api.service";

export default async function ProfilesPage() {
  await connection();
  const result = await requestApi({
    route: listUserProfilesRoute,
    params: null,
    query: { limit: 50, offset: 0 },
    body: null,
  });

  return (
    <Page width="app" align="start">
      <Heading level={1} size="page">
        User profiles
      </Heading>
      <Section title="New profile">
        <UserProfileForm
          action={createUserProfileAction}
          initialState={{
            kind: "editing",
            values: { firstName: "", lastName: "" },
          }}
          submitLabel="Create profile"
        />
      </Section>
      <Section title="Newest profiles">
        {result.kind !== "success" ? (
          <ApiFailureAlert result={result} />
        ) : result.response.data.profiles.length === 0 ? (
          <Text as="p" size="small" tone="muted" weight="regular">
            No profiles yet.
          </Text>
        ) : (
          <DividedList as="ul">
            {result.response.data.profiles.map((profile) => (
              <DividedListItem key={profile.id}>
                <TextLink href={`/profiles/${profile.id}`} tone="primary">
                  {profile.firstName} {profile.lastName}
                </TextLink>
              </DividedListItem>
            ))}
          </DividedList>
        )}
      </Section>
    </Page>
  );
}
