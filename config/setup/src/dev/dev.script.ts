import { existsSync } from "node:fs";
import path from "node:path";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../..");
const turboBinary = path.join(repositoryRoot, "node_modules/.bin/turbo");

function runInherited(command: string[], cwd: string): Promise<number> {
  const child = Bun.spawn(command, {
    cwd,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  return child.exited;
}

async function main(): Promise<number> {
  if (!existsSync(turboBinary)) {
    const installExitCode = await runInherited(
      ["bun", "install"],
      repositoryRoot,
    );
    if (installExitCode !== 0) {
      console.error("Dependency install failed. Fix it, then run: bun install");
      return 1;
    }
    if (!existsSync(turboBinary)) {
      console.error(
        "Dependency install did not create Turbo. Fix it, then run: bun install",
      );
      return 1;
    }
    // A process started before the install cannot resolve the workspace packages.
    return runInherited(
      ["bun", "run", "--cwd", "config/setup", "dev-entry"],
      repositoryRoot,
    );
  }

  // Dynamic imports keep workspace modules unloaded until node_modules exists.
  const { setupEnvironment } = await import(
    "@workspace/setup/environment/setup-environment.module"
  );
  try {
    await setupEnvironment();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }

  const { runDoctor } = await import(
    "@workspace/setup/doctor/run-doctor.module"
  );
  const { printDoctorFailures } = await import(
    "@workspace/setup/doctor/doctor-report.module"
  );
  const failures = await runDoctor({ production: false });
  if (failures.length > 0) {
    printDoctorFailures(failures);
    return 1;
  }

  return runInherited(["bunx", "turbo", "dev"], repositoryRoot);
}

process.exit(await main());
