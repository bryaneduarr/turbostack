import {
  testFilePattern,
  testSupportPattern,
} from "@workspace/rules/config/files/checked-files.config";
import { findRuntimeWorkspaceImports } from "@workspace/rules/services/imports/find-runtime-workspace-imports.service";
import type { RepositoryRuleCheck } from "@workspace/rules/types/checks/rule-check.interface";
import type { RuleViolation } from "@workspace/rules/types/checks/rule-violation.interface";

const ruleId = "runtime-dev-dependency";

const workspaceManifestPattern =
  /^(apps|packages|config)\/[a-z-]+\/package\.json$/;
const sourceFilePattern = /\.tsx?$/;

async function readDevOnlyWorkspacePackages(
  manifestPath: string,
): Promise<ReadonlySet<string>> {
  const manifest: unknown = await Bun.file(manifestPath).json();
  if (typeof manifest !== "object" || manifest === null) return new Set();

  const readNames = (field: string) => {
    const declared: unknown = Reflect.get(manifest, field);
    return typeof declared === "object" && declared !== null
      ? Object.keys(declared)
      : [];
  };
  const runtime = new Set(readNames("dependencies"));

  return new Set(
    readNames("devDependencies").filter(
      (name) => name.startsWith("@workspace/") && !runtime.has(name),
    ),
  );
}

export const runtimeDevDependencyCheck: RepositoryRuleCheck = {
  scope: "repository",
  ruleId,
  check: async ({ rootPath, trackedPaths }) => {
    const violations: RuleViolation[] = [];

    for (const manifest of trackedPaths.filter((path) =>
      workspaceManifestPattern.test(path),
    )) {
      const devOnly = await readDevOnlyWorkspacePackages(
        `${rootPath}/${manifest}`,
      );
      if (devOnly.size === 0) continue;

      const sourceRoot = manifest.replace(/package\.json$/, "src/");
      const runtimeSources = trackedPaths.filter(
        (path) =>
          path.startsWith(sourceRoot) &&
          sourceFilePattern.test(path) &&
          !testFilePattern.test(path) &&
          !testSupportPattern.test(path),
      );

      for (const path of runtimeSources) {
        const text = await Bun.file(`${rootPath}/${path}`).text();
        for (const { packageName, line } of findRuntimeWorkspaceImports(text)) {
          if (!devOnly.has(packageName)) continue;
          violations.push({
            ruleId,
            path,
            line,
            message: `Runtime code imports "${packageName}", which ${manifest} declares only in devDependencies; move it to dependencies.`,
          });
        }
      }
    }

    return violations;
  },
};
