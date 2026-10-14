import { createRouter } from "@/config/http/routing/http-router.config";
import { healthLiveContract } from "@/routes/health/live/health-live.contract";
import { healthLiveHandler } from "@/routes/health/live/health-live.handler";
import { healthReadyContract } from "@/routes/health/ready/health-ready.contract";
import { healthReadyHandler } from "@/routes/health/ready/health-ready.handler";

const healthRouter = createRouter()
  .get("/health/live", healthLiveHandler, healthLiveContract)
  .get("/health/ready", healthReadyHandler, healthReadyContract);

export default healthRouter;
