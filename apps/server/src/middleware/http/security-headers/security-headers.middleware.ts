import type { PreContext } from "elysia";

// Browsers must not reinterpret JSON or documentation responses as another type.
export function setSecurityHeaders({ set }: PreContext) {
  set.headers["x-content-type-options"] = "nosniff";
}
