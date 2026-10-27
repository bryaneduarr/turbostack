import { existsSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { databaseTargetEnvSchema } from "@workspace/schemas/database/environment/target/database-target-env.schema";
import {
  environmentFilePath,
  readEnvironmentFile,
} from "@workspace/setup/doctor/preflight/read-environment-file.service";
import type { DoctorFailure } from "@workspace/setup/types/doctor/doctor-failure.interface";
import type { PortClaim } from "@workspace/setup/types/doctor/preflight/port-claim.interface";

const repositoryRoot = path.resolve(import.meta.dirname, "../../../../..");

const fixedPortClaims: readonly PortClaim[] = [
  { port: 3000, service: "web client" },
  { port: 3001, service: "API server" },
];

export async function checkPorts(): Promise<readonly DoctorFailure[]> {
  const claims = [...fixedPortClaims, ...(await databasePortClaims())];
  const probes = await Promise.all(
    claims.map(async (claim) => ({
      claim,
      free: await isPortFree(claim.port),
    })),
  );
  const busyClaims = probes
    .filter(({ free }) => !free)
    .map(({ claim }) => claim);
  if (busyClaims.length === 0) return [];
  const runningServices = await runningComposeServices();
  return Promise.all(
    busyClaims
      .filter((claim) => !isOwnedByRunningService(claim, runningServices))
      .map((claim) => busyPortFailure(claim)),
  );
}

export function isOwnedByRunningService(
  claim: PortClaim,
  runningServices: readonly string[],
): boolean {
  return (
    claim.composeService !== undefined &&
    runningServices.includes(claim.composeService)
  );
}

async function runningComposeServices(): Promise<readonly string[]> {
  if (Bun.which("docker") === null) return [];
  const child = Bun.spawn(
    [
      "docker",
      "compose",
      "--env-file",
      "apps/server/.env",
      "ps",
      "--services",
      "--status",
      "running",
    ],
    {
      cwd: repositoryRoot,
      stdin: "ignore",
      stdout: "pipe",
      stderr: "ignore",
    },
  );
  const [exitCode, output] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
  ]);
  if (exitCode !== 0) return [];
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

async function databasePortClaims(): Promise<readonly PortClaim[]> {
  const serverPath = environmentFilePath("server");
  const values: Record<string, string> = existsSync(serverPath)
    ? await readEnvironmentFile(serverPath)
    : {};
  const parsed = databaseTargetEnvSchema.shape.DB_PORT.safeParse(
    values.DB_PORT ?? "5432",
  );
  return parsed.success
    ? [{ port: parsed.data, service: "PostgreSQL", composeService: "postgres" }]
    : [];
}

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.listen(port, () => server.close(() => resolve(true)));
  });
}

async function busyPortFailure({
  port,
  service,
}: {
  readonly port: number;
  readonly service: string;
}): Promise<DoctorFailure> {
  const inspect = `lsof -nP -iTCP:${port} -sTCP:LISTEN`;
  const holder = await listeningProcess(port);
  if (holder === undefined) {
    return {
      summary: `Port ${port} is busy`,
      reason: `The ${service} needs port ${port}. Inspect it with ${inspect} once lsof is installed.`,
      fix: `Stop the process listening on port ${port}.`,
    };
  }
  return {
    summary: `Port ${port} is busy, held by ${holder.name} (pid ${holder.pid})`,
    reason: `The ${service} needs port ${port}. Inspect it with ${inspect}.`,
    fix: `kill ${holder.pid}`,
  };
}

async function listeningProcess(
  port: number,
): Promise<{ readonly pid: string; readonly name: string } | undefined> {
  if (Bun.which("lsof") === null) return undefined;
  const pid = (
    await runCommand(["lsof", "-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"])
  ).split("\n")[0];
  if (pid === undefined || pid === "") return undefined;
  const name = await runCommand(["ps", "-p", pid, "-o", "args="]);
  return name === "" ? undefined : { pid, name };
}

async function runCommand(command: readonly string[]): Promise<string> {
  const child = Bun.spawn([...command], { stdout: "pipe", stderr: "ignore" });
  const output = await new Response(child.stdout).text();
  await child.exited;
  return output.trim();
}
