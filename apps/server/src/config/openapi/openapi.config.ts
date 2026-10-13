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
    scalar: {
      theme: "kepler",
      defaultHttpClient: { targetKey: "js", clientKey: "fetch" },
      hideClientButton: false,
      showSidebar: true,
      showDeveloperTools: "localhost",
      operationTitleSource: "summary",
      persistAuth: false,
      telemetry: true,
      externalUrls: {
        dashboardUrl: "https://dashboard.scalar.com",
        registryUrl: "https://registry.scalar.com",
        proxyUrl: "https://proxy.scalar.com",
        apiBaseUrl: "https://api.scalar.com",
      },
      layout: "modern",
      isEditable: false,
      hideModels: false,
      hideModelNames: false,
      modelsSectionLabel: "Models",
      documentDownloadType: "both",
      hideTestRequestButton: false,
      hideSearch: false,
      showOperationId: false,
      hideDarkModeToggle: false,
      withDefaultFonts: true,
      defaultOpenFirstTag: true,
      defaultOpenAllTags: false,
      expandAllModelSections: false,
      expandAllParameters: true,
      expandAllResponses: false,
      expandAllSchemaProperties: false,
      maxVisibleRequestBodyProperties: 12,
      orderSchemaPropertiesBy: "alpha",
      schemaKeyboardNav: false,
      orderRequiredPropertiesFirst: true,
    } satisfies ApiReferenceConfiguration,
  });
}
