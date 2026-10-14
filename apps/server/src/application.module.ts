import { Elysia } from "elysia";
import env from "@/config/environment/server-env.config";
import { createApp } from "@/config/http/application/http-application.config";
import OpenApiConfig from "@/config/openapi/openapi.config";
import healthRouter from "@/routes/health/health.router";

const app = createApp()
  .use(env.OPENAPI_ENABLED ? OpenApiConfig() : new Elysia())
  .use(healthRouter);

export default app;
