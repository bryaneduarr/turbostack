import { openapi } from "@elysia/openapi";
import type { ApiReferenceConfiguration } from "@scalar/types/api-reference";
import { errorResponseSchema } from "@workspace/schemas/server/responses/errors/error-response.schema";
import { successResponseSchema } from "@workspace/schemas/server/responses/success/success-response.schema";
import { API_VX_PREFIX } from "@/config/http/routing/api-prefix.constant";
import { requestIdHeader } from "@/config/openapi/headers/request-id-header.constant";
import { jsonContent } from "@/config/openapi/responses/content/json-response-content.config";
import { errorResponseComponents } from "@/config/openapi/responses/errors/default-error-responses.config";
import packageJson from "@/package.json";

export default function OpenApiConfig() {
  return openapi({
    path: `${API_VX_PREFIX}/reference`,
    specPath: `${API_VX_PREFIX}/doc`,
    openapiVersion: "3.0.0",
    documentation: {
      info: {
        version: packageJson.version,
        title: "Back-End API",
        description:
          "JSON API responses use { success, message, data, error, status, requestId }. Success has route-specific data and error=null; failure has data=null and a safe error.code. status matches the HTTP status, and requestId matches X-Request-ID. Request bodies, query parameters, and path parameters are defined per route. HTML, files, streams, HEAD, and bodyless responses are not wrapped.",
      },
      components: {
        schemas: {
          SuccessResponse: jsonContent(
            successResponseSchema,
            "Standard success envelope",
          ).content["application/json"].schema,
          ErrorResponse: jsonContent(
            errorResponseSchema,
            "Standard error envelope",
          ).content["application/json"].schema,
        },
        headers: { RequestId: requestIdHeader },
        responses: errorResponseComponents,
        parameters: {},
      },
    },
    // The plugin types require every option, so Scalar's values are listed in full.
    scalar: {
      // Color preset for the reference page.
      theme: "kepler",
      // Request example shown first in the client snippets.
      defaultHttpClient: { targetKey: "js", clientKey: "fetch" },
      // Shows the button that opens requests in the Scalar API client.
      hideClientButton: false,
      // Shows the navigation sidebar listing tags and operations.
      showSidebar: true,
      // Shows Scalar's developer toolbar only when served from localhost.
      showDeveloperTools: "localhost",
      // Titles operations with their summary instead of their path.
      operationTitleSource: "summary",
      // Keeps entered credentials out of browser storage between visits.
      persistAuth: false,
      // Stops the reference page from sending usage analytics to Scalar.
      telemetry: false,
      // Scalar-hosted services used by the reference page; these are Scalar's defaults.
      externalUrls: {
        dashboardUrl: "https://dashboard.scalar.com",
        registryUrl: "https://registry.scalar.com",
        proxyUrl: "https://proxy.scalar.com",
        apiBaseUrl: "https://api.scalar.com",
      },
      // Uses Scalar's modern layout instead of the classic one.
      layout: "modern",
      // Prevents editing the OpenAPI document in the browser.
      isEditable: false,
      // Shows the schema models section.
      hideModels: false,
      // Shows schema names next to their models.
      hideModelNames: false,
      // Heading for the schema models section.
      modelsSectionLabel: "Models",
      // Offers the OpenAPI document as both JSON and YAML downloads.
      documentDownloadType: "both",
      // Shows the button that sends test requests from the page.
      hideTestRequestButton: false,
      // Shows the operation search box.
      hideSearch: false,
      // Hides internal operation IDs from readers.
      showOperationId: false,
      // Shows the light and dark mode toggle.
      hideDarkModeToggle: false,
      // Loads Scalar's default fonts.
      withDefaultFonts: true,
      // Expands the first tag when the page loads.
      defaultOpenFirstTag: true,
      // Keeps the remaining tags collapsed on load.
      defaultOpenAllTags: false,
      // Keeps model sections collapsed on load.
      expandAllModelSections: false,
      // Expands operation parameters on load.
      expandAllParameters: true,
      // Keeps responses collapsed on load.
      expandAllResponses: false,
      // Keeps nested schema properties collapsed on load.
      expandAllSchemaProperties: false,
      // Number of request body properties shown before collapsing the rest.
      maxVisibleRequestBodyProperties: 12,
      // Sorts schema properties alphabetically.
      orderSchemaPropertiesBy: "alpha",
      // Disables keyboard navigation inside schema views.
      schemaKeyboardNav: false,
      // Lists required schema properties before optional ones.
      orderRequiredPropertiesFirst: true,
    } satisfies ApiReferenceConfiguration,
  });
}
