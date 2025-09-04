import { createRouter } from "@/config/create-router";

import { helloWorldHandler } from "./handler.hello-world";
import { helloWorldRoute } from "./route.hello-world";

// In here specify all the routes that you want to expose in the OpenAPI documentation with their handlers.
// First is the route and then the handler.
// To add more routes in here just create new ones `.openapi(route, handler).openapi(route, handler)`.
const router = createRouter().openapi(helloWorldRoute, helloWorldHandler);

export default router;
