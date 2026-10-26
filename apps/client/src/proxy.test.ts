import { describe, expect, it } from "bun:test";
import { readClientSecurityHeaders } from "@/config/http/security-headers/client-security-headers.config";
import { proxy } from "@/proxy";

process.env.SERVER_URL = "http://localhost:3001";

describe("proxy", () => {
  it("sends the baseline security headers and continues the request", () => {
    const response = proxy();

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-frame-options")).toBe("DENY");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(response.headers.get("content-security-policy")).toContain(
      "frame-ancestors 'none'",
    );
    expect(response.headers.get("strict-transport-security")).toBeNull();
  });

  it("adds HSTS only in production", () => {
    const headerNames = (production: boolean) =>
      readClientSecurityHeaders(production).map(([name]) => name);

    expect(headerNames(true)).toContain("Strict-Transport-Security");
    expect(headerNames(false)).not.toContain("Strict-Transport-Security");
  });
});
