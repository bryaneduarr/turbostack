import { createRouter } from "@/config/http/routing/http-router.config";
import onError from "@/middleware/errors/on-error.handler";
import { cors } from "@/middleware/http/cors/cors.middleware";
import { serveEmojiFavicon } from "@/middleware/http/favicon/serve-emoji-favicon.middleware";
import { requestLogger } from "@/middleware/logging/requests/request-logger.middleware";
import { completeRequestLog } from "@/services/logging/requests/complete-request-log.service";

export function createApp() {
  const app = createRouter();
  const favicon = serveEmojiFavicon("📦");

  return (
    app
      .use(requestLogger)
        .onRequest((context) => {
        const response = cors(context);
        if (response) {
          completeRequestLog({
            request: context.request,
            status: response.status,
            route: "<preflight>",
          });
        }
        return response;
      })
      .onRequest((context) => {
        const response = favicon(context);
        if (response) {
          completeRequestLog({
            request: context.request,
            status: response.status,
            route: "/favicon.ico",
          });
        }
        return response;
      })
          .mapResponse({ as: "global" }, ({ responseValue, set }) => {
        const contentType =
          responseValue instanceof Response
            ? (responseValue.headers.get("content-type") ??
              set.headers["content-type"])
            : set.headers["content-type"];
        if (typeof contentType === "string") {
          const normalized = contentType.startsWith("application/json")
            ? "application/json"
            : contentType.startsWith("text/html")
              ? "text/html; charset=UTF-8"
              : contentType;
          if (responseValue instanceof Response) {
            responseValue.headers.set("content-type", normalized);
          } else {
            set.headers["content-type"] = normalized;
          }
        } else if (
          responseValue !== null &&
          typeof responseValue === "object"
        ) {
          set.headers["content-type"] = "application/json";
        }
      })
      .onError(onError)
  );
}
