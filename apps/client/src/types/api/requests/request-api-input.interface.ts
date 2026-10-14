import type { SendApiRequestInput } from "@workspace/api-client/types/requests/send-api-request.interface";
import type { RouteDefinition } from "@workspace/schemas/server/routes/definition/route-definition.interface";

/* Supplies one API request from the client's server; the base URL, caching, and timeout are fixed. */
export type RequestApiInput<Route extends RouteDefinition> = Omit<
  SendApiRequestInput<Route>,
  "baseUrl" | "init"
>;
