import { healthLiveRoute } from "@workspace/schemas/server/routes/health/live/health-live.route";
import { healthReadyRoute } from "@workspace/schemas/server/routes/health/ready/health-ready.route";
import { createRouter } from "@/config/http/routing/http-router.config";
import { healthLiveContract } from "@/routes/health/live/health-live.contract";
import { healthLiveHandler } from "@/routes/health/live/health-live.handler";
import { healthReadyContract } from "@/routes/health/ready/health-ready.contract";
import { healthReadyHandler } from "@/routes/health/ready/health-ready.handler";

const healthRouter = createRouter()
  .route(
    healthLiveRoute.method,
    healthLiveRoute.path,
    healthLiveHandler,
    healthLiveContract,
  )
  .route(
    healthReadyRoute.method,
    healthReadyRoute.path,
    healthReadyHandler,
    healthReadyContract,
  );

export default healthRouter;
