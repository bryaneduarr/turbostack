import { expect, test } from "@playwright/test";
import { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";
import { NOT_FOUND } from "@workspace/utils/http/status-codes/http-status-code.constant";
import { E2E_CLIENT_URL } from "@/e2e/config/servers/e2e-servers.constant";

test.describe("support error codes", () => {
  test("a missing page shows its code and no request ID", async ({ page }) => {
    const response = await page.goto(
      `${E2E_CLIENT_URL}/missing-${crypto.randomUUID()}`,
    );
    if (response === null) throw new Error("The missing page has no response.");

    expect(response.status()).toBe(NOT_FOUND);
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    await expect(
      page.getByText(`Error code ${SUPPORT_ERROR_CODE.PAGE_NOT_FOUND}`, {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("a missing profile shows the not-found page", async ({ page }) => {
    await page.goto(`${E2E_CLIENT_URL}/profiles/${crypto.randomUUID()}`);

    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  });
});
