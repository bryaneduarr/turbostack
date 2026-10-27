import { checkEnvironmentFiles } from "@workspace/setup/doctor/preflight/check-environment-files.service";
import { checkPorts } from "@workspace/setup/doctor/preflight/check-ports.service";
import { checkToolchain } from "@workspace/setup/doctor/preflight/check-toolchain.service";
import { checkWorkspaces } from "@workspace/setup/doctor/preflight/check-workspaces.service";
import { checkProductionEnvironment } from "@workspace/setup/doctor/production/check-production-environment.service";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";

export async function runDoctor({
  production,
}: {
  readonly production: boolean;
}): Promise<readonly DoctorFailure[]> {
  const toolchainFailures = await checkToolchain();
  const workspaceFailures = await checkWorkspaces();
  const environmentFileFailures = await checkEnvironmentFiles();
  const portFailures = await checkPorts();
  const productionFailures = production
    ? await checkProductionEnvironment()
    : [];

  return [
    ...toolchainFailures,
    ...workspaceFailures,
    ...environmentFileFailures,
    ...portFailures,
    ...productionFailures,
  ];
}
