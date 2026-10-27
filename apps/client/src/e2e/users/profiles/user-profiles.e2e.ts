import { expect, test } from "@playwright/test";
import { E2E_CLIENT_URL } from "@/e2e/config/servers/e2e-servers.constant";

test.describe("user profiles", () => {
  test("creates a profile, opens it, and renames it", async ({ page }) => {
    const lastName = `Browser ${crypto.randomUUID().slice(0, 8)}`;
    await page.goto(`${E2E_CLIENT_URL}/profiles`);

    await page.getByLabel("First name").fill("Ada");
    await page.getByLabel("Last name").fill(lastName);
    await page.getByRole("button", { name: "Create profile" }).click();
    const profileLink = page.getByRole("link", { name: `Ada ${lastName}` });
    await expect(profileLink).toBeVisible();

    await profileLink.click();
    await expect(
      page.getByRole("heading", { level: 1, name: `Ada ${lastName}` }),
    ).toBeVisible();
    await page.getByLabel("First name").fill("Grace");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: `Grace ${lastName}` }),
    ).toBeVisible();
  });

  test("blocks a blank form in the browser and names each field", async ({
    page,
  }) => {
    const actionRequests: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") actionRequests.push(request.url());
    });
    await page.goto(`${E2E_CLIENT_URL}/profiles`);

    await page.getByRole("button", { name: "Create profile" }).click();

    await expect(page.getByText("Enter a first name.")).toBeVisible();
    await expect(page.getByText("Enter a last name.")).toBeVisible();
    expect(actionRequests).toEqual([]);
  });
});
