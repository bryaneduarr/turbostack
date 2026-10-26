import type {
  SecurityHeader,
  SecurityHeadersInput,
} from "@workspace/utils/types/http/security-headers/security-headers-input.interface";

// Two years, the HSTS preload list's minimum.
const strictTransportSecurity = "max-age=63072000; includeSubDomains; preload";

export function createSecurityHeaders({
  contentSecurityPolicy,
  referrerPolicy,
  production,
}: SecurityHeadersInput): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    ["Content-Security-Policy", contentSecurityPolicy],
    ["X-Frame-Options", "DENY"],
    ["X-Content-Type-Options", "nosniff"],
    ["Referrer-Policy", referrerPolicy],
  ];
  if (production) {
    headers.push(["Strict-Transport-Security", strictTransportSecurity]);
  }
  return headers;
}
