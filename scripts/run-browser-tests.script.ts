import { mkdir } from "node:fs/promises";

const resultDirectory = ".turbo/verify";
const logPath = `${resultDirectory}/browser-tests.log`;
const lastRunPath = "apps/client/test-results/.last-run.json";
const failureLine = /^\s*(\d+ (failed|flaky|did not run)|\[(api|chromium)\] ›)/;
const passedLine = /(\d+) passed/;
const workersArgument = /^--workers=\d+$/;
const testPathArgument = /^[\w./-]+$/;

// Playwright records the tests that failed in the last run; none recorded
// means the last run passed or never started, and --last-failed would error.
async function hasFailedTests(): Promise<boolean> {
  const lastRun: unknown = await Bun.file(lastRunPath)
    .json()
    .catch(() => null);
  if (typeof lastRun !== "object" || lastRun === null) return false;
  return (
    "failedTests" in lastRun &&
    Array.isArray(lastRun.failedTests) &&
    lastRun.failedTests.length > 0
  );
}

// A folder needs its trailing slash to match only itself; a test file is run as given.
function toFilter(path: string): string {
  return `src/e2e/${path}${path.endsWith(".e2e.ts") ? "" : "/"}`;
}

const testPaths = Bun.argv
  .slice(2)
  .filter((argument) => !argument.startsWith("--"));
const badPath = testPaths.find((path) => !testPathArgument.test(path));
if (badPath !== undefined) {
  console.error(`Not a test folder or file under src/e2e: ${badPath}`);
  process.exit(1);
}
// Fewer workers trade time for memory: two use about 1.4 GiB, four about 2 GiB.
const workers = Bun.argv.find((argument) => workersArgument.test(argument));
const rerunFailed = Bun.argv.includes("--failed") && (await hasFailedTests());
if (Bun.argv.includes("--failed") && !rerunFailed) {
  console.info(
    "No failed tests were recorded; running all the tests asked for.",
  );
}

// Playwright runs straight from the app: the builds come from `verify` or
// `turbo run build`, and Turbo's wrapper only added 110 MiB and a start-up per run.
const command = [
  "bun run --cwd apps/client test:e2e --project=api --project=chromium --reporter=dot",
  workers ?? "",
  rerunFailed ? "--last-failed" : "",
  ...testPaths.map(toFilter),
  `> ${logPath} 2>&1`,
].join(" ");
await mkdir(resultDirectory, { recursive: true });
const startedAt = performance.now();
const exitCode = await Bun.spawn(["sh", "-c", command]).exited;
const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);

const lines = (await Bun.file(logPath).text()).split("\n");
if (exitCode === 0) {
  const passed = lines.map((line) => passedLine.exec(line)?.[1]).find(Boolean);
  console.info(`PASS  ${passed ?? "0"} tests (${seconds}s)`);
} else {
  console.error(`FAIL  browser tests (${seconds}s), full output in ${logPath}`);
  for (const line of lines.filter((line) => failureLine.test(line))) {
    console.error(`  ${line.trim()}`);
  }
  process.exit(1);
}
