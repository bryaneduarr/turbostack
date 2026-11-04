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
import { chooseWorkerCount } from "@/e2e/config/workers/choose-worker-count.service";

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
  // Four workers peak at about 2 GiB and finish in 53 s; each one more saves 4 s
  // for 300 MiB. A machine with less free memory gets fewer. GitHub runners have 4 cores.
  workers: process.env.CI === undefined ? chooseWorkerCount() : 4,
  forbidOnly: process.env.CI !== undefined,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: E2E_CLIENT_URL,
    // The software GPU process spent three quarters of its CPU painting transitions.
    reducedMotion: "reduce",
    // Without it a click on a missing element waits out the whole test timeout.
    actionTimeout: 5_000,
    // Recording a trace and a video in every test costs an ffmpeg process and
    // memory per worker; a failing local run keeps only its screenshot and error context.
    trace: process.env.CI === undefined ? "off" : "retain-on-failure",
    video: process.env.CI === undefined ? "off" : "retain-on-failure",
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
        NODE_OPTIONS: "",
        BUN_OPTIONS: "--smol",
      },
      reuseExistingServer: false,
    },
    {
      command: "bun run start",
      url: E2E_CLIENT_URL,
      env: {
        PORT: String(E2E_CLIENT_PORT),
        SERVER_URL: E2E_API_URL,
        // Next binds to HOSTNAME, which a shell sets to the machine name; turbo hides it.
        HOSTNAME: "0.0.0.0",
        NODE_OPTIONS: "--max-old-space-size=160 --max-semi-space-size=2",
      },
      reuseExistingServer: false,
    },
  ],
});
