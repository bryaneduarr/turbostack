import { createSecurityHeaders } from "@workspace/utils/http/security-headers/create-security-headers.service";

// Scripts and styles keep their defaults; tighten this policy once the app knows its sources.
const contentSecurityPolicy =
  "frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'";

export function readClientSecurityHeaders(production: boolean) {
  return createSecurityHeaders({
    contentSecurityPolicy,
    referrerPolicy: "strict-origin-when-cross-origin",
    production,
  });
}
