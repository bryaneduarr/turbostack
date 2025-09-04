import { createApp } from "@/config/create-app";
import OpenApiConfig from "@/config/openapi-config";

import helloWorld from "./routes/index";

// Using the custom 'createApp' function to create the Hono app instance.
const app = createApp();

// Define all the index routes in here and it will import all of the routes you defined in there.
const routes = [helloWorld];

// The OpenAPI configuration where we can see the documentation for each.
OpenApiConfig(app);

// This will iterate through all of the routes and make them available.
routes.forEach((route) => {
  app.route("/", route);
});

export default app;
