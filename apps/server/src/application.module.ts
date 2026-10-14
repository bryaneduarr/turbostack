import { createApp } from "@/config/http/application/http-application.config";
import { API_VX_PREFIX } from "@/config/http/routing/api-prefix.constant";
import OpenApiConfig from "@/config/openapi/openapi.config";
import healthRouter from "@/routes/health/health.router";
import helloWorldRouter from "@/routes/hello-world/hello-world.router";

const app = createApp()
  .use(OpenApiConfig())
  .use(healthRouter)
  .group(API_VX_PREFIX, (app) => app.use(helloWorldRouter));

export default app;
