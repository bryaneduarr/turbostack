import { expect, test } from "@playwright/test";
import { E2E_CLIENT_URL } from "@/e2e/config/servers/e2e-servers.constant";

test.describe("security headers", () => {
  test("every page response carries the baseline headers", async ({ page }) => {
    for (const path of ["/", "/profiles"]) {
      const response = await page.goto(`${E2E_CLIENT_URL}${path}`);
      if (response === null) throw new Error(`${path} has no response.`);
      const headers = response.headers();

      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["referrer-policy"]).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(headers["content-security-policy"]).toContain(
        "frame-ancestors 'none'",
      );
    }
  });
});
