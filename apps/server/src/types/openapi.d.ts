import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

// This is the one that we need to pass to every route handler we create.
export type AppRouterHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
