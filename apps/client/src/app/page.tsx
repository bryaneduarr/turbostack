import { healthReadyRoute } from "@workspace/schemas/server/routes/health/ready/health-ready.route";
import { Button } from "@workspace/ui/components/button/button.component";
import { connection } from "next/server";
import { ServerReadinessStatus } from "@/components/health/readiness/server-readiness-status.component";
import { requestApi } from "@/services/api/requests/request-api.service";

export default async function Page() {
  await connection();
  const readiness = await requestApi({
    route: healthReadyRoute,
    params: null,
    query: null,
    body: null,
  });

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Web Client</h1>
      <ServerReadinessStatus readiness={readiness} />
      <form>
        <Button type="submit" variant="outline" size="medium">
          Check again
        </Button>
      </form>
    </main>
  );
}
