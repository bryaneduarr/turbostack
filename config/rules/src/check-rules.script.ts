import { runRuleChecks } from "@workspace/rules/services/checks/run-rule-checks.service";

const rootPath = (await Bun.$`git rev-parse --show-toplevel`.text()).trim();
const startedAt = performance.now();
const violations = await runRuleChecks(rootPath);
const seconds = ((performance.now() - startedAt) / 1000).toFixed(2);

for (const { ruleId, path, line, message } of violations) {
  console.error(`${path}:${line}  [${ruleId}]  ${message}`);
}

if (violations.length > 0) {
  const files = new Set(violations.map(({ path }) => path)).size;
  console.error(
    `\n${violations.length} rule violations in ${files} files (${seconds}s). Rules: .agents/rules/; reviewed exceptions: config/rules/src/config/exceptions/rule-exceptions.config.ts.`,
  );
  process.exit(1);
}
console.info(`Project rules: no violations (${seconds}s).`);
