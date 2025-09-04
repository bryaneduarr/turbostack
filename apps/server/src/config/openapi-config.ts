import type { AppOpenAPI } from "@/types/openapi";
import { Scalar } from "@scalar/hono-api-reference";

import packageJson from "../../package.json";

/**
 * Configures OpenAPI documentation and reference UI for the application.
 *
 * Sets up the OpenAPI specification endpoint at `/doc` with version information
 * from package.json and creates a 'Scalar-powered API' reference UI at `/reference`
 * with Kepler theme and fetch client configuration.
 *
 * @param app - The OpenAPI-enabled application instance to configure
 */
export default function OpenApiConfig(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "Back-End API",
    },
  });

  app.get(
    "/reference",
    Scalar({
      url: "/doc",
      theme: "kepler", // Change Scalar theme here.
      defaultHttpClient: {
        targetKey: "js", // Change this to a specific language.
        clientKey: "fetch", // Change this to the method you will be using for the language.
      },
    }),
  );
}
