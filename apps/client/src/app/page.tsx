import { healthReadyRoute } from "@workspace/schemas/server/routes/health/ready/health-ready.route";
import { Button } from "@workspace/ui/components/button/button.component";
import { ButtonLink } from "@workspace/ui/components/button/button-link.component";
import { Page } from "@workspace/ui/components/layout/page/page.component";
import { Heading } from "@workspace/ui/components/typography/heading/heading.component";
import { connection } from "next/server";
import { ServerReadinessStatus } from "@/components/health/readiness/server-readiness-status.component";
import { APP_NAME } from "@/config/branding/app-name.config";
import { requestApi } from "@/services/api/requests/request-api.service";

export default async function HomePage() {
  await connection();
  const readiness = await requestApi({
    route: healthReadyRoute,
    params: null,
    query: null,
    body: null,
  });

  return (
    <Page width="form" align="center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Heading level={1} size="page">
          {APP_NAME}
        </Heading>
        <ServerReadinessStatus readiness={readiness} />
        <div className="flex flex-wrap justify-center gap-2">
          <form>
            <Button type="submit" variant="outline" size="medium">
              Check again
            </Button>
          </form>
          <ButtonLink href="/profiles" variant="primary" size="medium">
            Manage user profiles
          </ButtonLink>
        </div>
      </div>
    </Page>
  );
}
