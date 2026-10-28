import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";
import { loadNixosBrowserLibraries } from "@/e2e/config/browsers/load-nixos-browser-libraries.config";
import { loadDatabaseEnvironment } from "@/e2e/config/environment/load-database-environment.config";
import {
  E2E_API_PORT,
  E2E_API_URL,
  E2E_CLIENT_PORT,
  E2E_CLIENT_URL,
} from "@/e2e/config/servers/e2e-servers.constant";

loadDatabaseEnvironment();
loadNixosBrowserLibraries();

const apiContractTests = /api-contracts\/.*\.e2e\.ts$/;

// Playwright's WebKit build needs older system libraries than nixpkgs ships and
// the devcontainer image installs only Chromium and Firefox, so both skip it.
const webkitProjects =
  existsSync("/etc/NIXOS") || process.env.DEVCONTAINER === "true"
    ? []
    : [
        {
          name: "webkit",
          testIgnore: apiContractTests,
          use: { ...devices["Desktop Safari"] },
        },
      ];

export default defineConfig({
  testDir: "./src/e2e",
  testMatch: /.*\.e2e\.ts$/,
  fullyParallel: true,
  // Measured on a 119-test suite in the 8 GiB container: 10 workers peak at 6.1 GiB
  // (76 %); 12 saved 2 s at 87 %. GitHub runners have 4 cores, so CI keeps 4.
  workers: process.env.CI === undefined ? 10 : 4,
  forbidOnly: process.env.CI !== undefined,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: E2E_CLIENT_URL,
    // Without it a click on a missing element waits out the whole test timeout.
    actionTimeout: 5_000,
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "api", testMatch: apiContractTests },
    {
      name: "chromium",
      testIgnore: apiContractTests,
      use: {
        ...devices["Desktop Chrome"],
        // Headless pages draw nothing on screen, and the software GPU process cost
        // a third of a 119-test run: 142 s with it, 97 s without.
        launchOptions: { args: ["--disable-gpu"] },
      },
    },
    {
      name: "firefox",
      testIgnore: apiContractTests,
      use: { ...devices["Desktop Firefox"] },
    },
    ...webkitProjects,
  ],
  // Every app must already be built; `turbo run test:e2e` builds them first.
  webServer: [
    {
      command: "bun run start",
      cwd: "../server",
      url: `${E2E_API_URL}/health/live`,
      env: {
        PORT: String(E2E_API_PORT),
        CLIENT_URL: E2E_CLIENT_URL,
        LOG_LEVEL: "warn",
      },
      reuseExistingServer: false,
    },
    {
      command: "bun run start",
      url: E2E_CLIENT_URL,
      env: {
        PORT: String(E2E_CLIENT_PORT),
        SERVER_URL: E2E_API_URL,
      },
      reuseExistingServer: false,
    },
  ],
});
