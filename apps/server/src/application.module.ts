import { Elysia } from "elysia";
import env from "@/config/environment/server-env.config";
import { createApp } from "@/config/http/application/http-application.config";
import { API_VX_PREFIX } from "@/config/http/routing/api-prefix.constant";
import OpenApiConfig from "@/config/openapi/openapi.config";
import healthRouter from "@/routes/health/health.router";
import helloWorldRouter from "@/routes/hello-world/hello-world.router";

const app = createApp()
  .use(env.OPENAPI_ENABLED ? OpenApiConfig() : new Elysia())
  .use(healthRouter)
  .group(API_VX_PREFIX, (app) => app.use(helloWorldRouter));

export default app;
