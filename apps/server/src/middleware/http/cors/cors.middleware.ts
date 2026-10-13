import { NO_CONTENT } from "@workspace/utils/http/status-codes/http-status-code.constant";
import type { PreContext } from "elysia";
import env from "@/config/environment/server-env.config";

export function cors({ request, set }: PreContext) {
  if (request.headers.get("origin") === env.CLIENT_URL) {
    set.headers["access-control-allow-origin"] = env.CLIENT_URL;
  }
  set.headers.vary = "Origin";

  if (request.method === "OPTIONS") {
    set.status = NO_CONTENT;
    set.headers["access-control-allow-methods"] =
      "GET,HEAD,PUT,POST,DELETE,PATCH,QUERY";
    const headers = request.headers.get("access-control-request-headers");
    if (headers) {
      set.headers["access-control-allow-headers"] = headers
        .split(",")
        .map((header) => header.trim())
        .join(",");
      set.headers.vary = "Origin, Access-Control-Request-Headers";
    }
    return new Response(null, { status: NO_CONTENT });
  }
}
