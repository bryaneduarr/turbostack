import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";
import type { DocumentDecoration } from "elysia";
import type { z } from "zod";

/** Supplies the OpenAPI documentation every route registration declares. */
interface RouteDocumentation {
  /** Describes the route's summary, tags, and documented responses. */
  detail: DocumentDecoration;
}

/** Requires one input validator when the route declares it and forbids it when the route declares null. */
type RouteInputHook<
  InputName extends "params" | "query" | "body",
  InputSchema extends z.ZodType | null,
> = InputSchema extends z.ZodType
  ? Record<InputName, InputSchema>
  : Record<never, never>;

/** Contains the Elysia route options derived from a shared route definition. */
export type RouteContract<Route extends RouteDefinition> = RouteDocumentation &
  RouteInputHook<"params", Route["params"]> &
  RouteInputHook<"query", Route["query"]> &
  RouteInputHook<"body", Route["body"]>;
