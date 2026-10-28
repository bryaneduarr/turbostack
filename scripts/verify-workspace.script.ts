import { mkdir } from "node:fs/promises";

const migrationsPath = "packages/database/src/migrations";
const resultDirectory = ".turbo/verify";
const resultPath = `${resultDirectory}/last-result.json`;
// Turbo adds arguments after `--` to the build's cache key too, so the tests run
// with `--only` after the types and builds step has built every app.
const browserCommand =
  "bunx turbo run test:e2e --only -- --project=api --project=chromium";
const prepareTestDatabase = "bunx turbo run api-server#db:test:prepare";
const lastRunPath = "apps/client/test-results/.last-run.json";

/** A verification step; fix-loop-only steps run again unless they passed last time. */
interface VerificationStep {
  id: string;
  name: string;
  run: () => Promise<boolean>;
  rerunOnlyAfterFailure: boolean;
}

interface StepOutcome {
  id: string;
  passed: boolean;
  seconds: number;
}

interface VerificationResult {
  failedStep: string | null;
  passedSteps: string[];
}

// Runs the commands in order and stops at the first that fails.
async function runCommand(...commands: string[]): Promise<boolean> {
  for (const command of commands) {
    const child = Bun.spawn(command.split(" "), { stdout: "inherit" });
    if ((await child.exited) !== 0) return false;
  }
  return true;
}

const readMigrationsStatus = (): Promise<string> =>
  Bun.$`git status --porcelain --untracked-files=all ${migrationsPath}`.text();

// Generating must leave the migrations folder unchanged; any new or edited
// file means the tables changed without a committed migration.
async function checkMigrationsMatchTables(): Promise<boolean> {
  const databaseScript = (script: string) =>
    runCommand(`bun run --cwd packages/database ${script}`);

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

// A missing or damaged file reads as no record, like a first run.
async function readRecord(path: string): Promise<object | null> {
  const record: unknown = await Bun.file(path)
    .json()
    .catch(() => null);
  return typeof record === "object" ? record : null;
}

async function readPreviousResult(): Promise<VerificationResult> {
  const record = await readRecord(resultPath);
  if (record === null) return { failedStep: null, passedSteps: [] };
  const failedStep =
    "failedStep" in record && typeof record.failedStep === "string"
      ? record.failedStep
      : null;
  const passedSteps =
    "passedSteps" in record && Array.isArray(record.passedSteps)
      ? record.passedSteps.filter((id) => typeof id === "string")
      : [];
  return { failedStep, passedSteps };
}

// Any later Playwright run rewrites this list, so the fix loop reruns only
// failures it can still see and otherwise runs every browser test.
async function hasRecordedBrowserFailures(): Promise<boolean> {
  const lastRun = await readRecord(lastRunPath);
  if (lastRun === null || !("failedTests" in lastRun)) return false;
  return Array.isArray(lastRun.failedTests) && lastRun.failedTests.length > 0;
}

async function recordResult(result: VerificationResult): Promise<void> {
  await mkdir(resultDirectory, { recursive: true });
  await Bun.write(resultPath, `${JSON.stringify(result, null, 2)}\n`);
}

function commandStep(
  id: string,
  name: string,
  command: string,
  rerunOnlyAfterFailure = false,
): VerificationStep {
  return { id, name, run: () => runCommand(command), rerunOnlyAfterFailure };
}

function createSteps(browserArgs: string): VerificationStep[] {
  return [
    commandStep(
      "lockfile",
      "Lockfile matches package manifests",
      "bun install --frozen-lockfile",
      true,
    ),
    commandStep("biome", "Formatting and lint (Biome)", "bunx biome ci ."),
    commandStep("boundaries", "Package boundaries", "bunx turbo boundaries"),
    commandStep("rules", "Project rules", "bun run check:rules"),
    commandStep("compose", "Compose", "bun run check:compose", true),
    {
      id: "migrations",
      name: "Migrations match the tables",
      run: checkMigrationsMatchTables,
      rerunOnlyAfterFailure: true,
    },
    commandStep(
      "types-builds",
      "Types and builds",
      "bunx turbo run check-types build",
    ),
    {
      id: "browser",
      name: "Browser tests (API and Chromium)",
      run: () => runCommand(prepareTestDatabase, browserCommand + browserArgs),
      rerunOnlyAfterFailure: false,
    },
  ];
}

const fixLoop = Bun.argv.includes("--failed");
const previous: VerificationResult = fixLoop
  ? await readPreviousResult()
  : { failedStep: null, passedSteps: [] };
const rerunFailedOnly =
  previous.failedStep === "browser" && (await hasRecordedBrowserFailures());
const allSteps = createSteps(rerunFailedOnly ? " --last-failed" : "");
const plan = allSteps.filter(
  (step) =>
    !fixLoop ||
    !step.rerunOnlyAfterFailure ||
    !previous.passedSteps.includes(step.id),
);

const outcomes: StepOutcome[] = [];
let failedStep: string | null = null;
for (const [index, step] of plan.entries()) {
  console.info(`\n━━ [${index + 1}/${plan.length}] ${step.name}\n`);
  const startedAt = performance.now();
  const passed = await step.run().catch((error: unknown) => {
    console.error(error);
    return false;
  });
  const seconds = (performance.now() - startedAt) / 1000;
  outcomes.push({ id: step.id, passed, seconds });
  if (!passed) {
    failedStep = step.id;
    break;
  }
}

console.info("\n━━ Verification summary\n");
for (const step of plan) {
  const outcome = outcomes.find((item) => item.id === step.id);
  if (outcome === undefined) {
    console.info(`skipped  ${step.name}`);
  } else {
    const label = outcome.passed ? "PASS" : "FAIL";
    console.info(`${label}     ${step.name} (${outcome.seconds.toFixed(1)}s)`);
  }
}

// Steps skipped in this fix loop keep their pass from the earlier run.
const passedSteps = allSteps
  .map((step) => step.id)
  .filter(
    (id) =>
      outcomes.some((outcome) => outcome.id === id && outcome.passed) ||
      (!plan.some((step) => step.id === id) &&
        previous.passedSteps.includes(id)),
  );
await recordResult({ failedStep, passedSteps });

if (failedStep !== null) {
  console.error(
    "\nVerification failed. Fix the cause, then run `bun run verify --failed`.",
  );
  process.exit(1);
}
console.info(`\nAll ${plan.length} checks passed.`);
