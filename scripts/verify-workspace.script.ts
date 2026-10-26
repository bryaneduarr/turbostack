interface VerificationStep {
  name: string;
  run: () => Promise<boolean>;
}

const migrationsPath = "packages/database/src/migrations";

async function runCommand(command: string[]): Promise<boolean> {
  const child = Bun.spawn(command, {
    stdout: "inherit",
    stderr: "inherit",
  });
  return (await child.exited) === 0;
}

async function readMigrationsStatus(): Promise<string> {
  const status = Bun.spawn(
    ["git", "status", "--porcelain", "--untracked-files=all", migrationsPath],
    { stdout: "pipe", stderr: "inherit" },
  );
  return new Response(status.stdout).text();
}

// Generating must leave the migrations folder unchanged; any new or edited
// file means the tables changed without a committed migration.
async function checkMigrationsMatchTables(): Promise<boolean> {
  const databaseScript = (script: string) =>
    runCommand(["bun", "run", "--cwd", "packages/database", script]);

  if (!(await databaseScript("drizzle:check"))) return false;
  const before = await readMigrationsStatus();
  if (!(await databaseScript("drizzle:generate"))) return false;
  const after = await readMigrationsStatus();
  if (before !== after) {
    console.error(
      `drizzle:generate changed ${migrationsPath}; review and keep or delete the new migration.`,
    );
    return false;
  }
  return true;
}

const steps: VerificationStep[] = [
  {
    name: "Lockfile matches package manifests",
    run: () => runCommand(["bun", "install", "--frozen-lockfile"]),
  },
  {
    name: "Formatting and lint (Biome)",
    run: () => runCommand(["bunx", "biome", "ci", "."]),
  },
  {
    name: "Package boundaries",
    run: () => runCommand(["bunx", "turbo", "boundaries"]),
  },
  {
    name: "Project structure and naming rules",
    run: () => runCommand(["bun", "run", "check:rules"]),
  },
  {
    name: "Migrations match the tables",
    run: checkMigrationsMatchTables,
  },
  {
    name: "Types, unit tests, and builds",
    run: () =>
      runCommand(["bunx", "turbo", "run", "check-types", "test", "build"]),
  },
  {
    name: "End-to-end tests (Playwright, API and Chromium)",
    run: () =>
      runCommand([
        "bunx",
        "turbo",
        "run",
        "test:e2e",
        "--",
        "--project=api",
        "--project=chromium",
      ]),
  },
];

const results: { name: string; passed: boolean; seconds: number }[] = [];

for (const [index, step] of steps.entries()) {
  console.info(`\n━━ [${index + 1}/${steps.length}] ${step.name}\n`);
  const startedAt = performance.now();
  const passed = await step.run();
  results.push({
    name: step.name,
    passed,
    seconds: (performance.now() - startedAt) / 1000,
  });
}

console.info("\n━━ Verification summary\n");
for (const { name, passed, seconds } of results) {
  console.info(`${passed ? "PASS" : "FAIL"}  ${name} (${seconds.toFixed(1)}s)`);
}

const failed = results.filter(({ passed }) => !passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.info(`\nAll ${results.length} checks passed.`);
