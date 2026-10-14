import type { PreContext } from "elysia";

export function setSecurityHeaders({ set }: PreContext) {
  set.headers["x-content-type-options"] = "nosniff";
}
