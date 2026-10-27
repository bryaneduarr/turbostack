import fs from "node:fs";

const stackDirectory = ".turbo/dev-stack";
const logPath = `${stackDirectory}/dev-stack.log`;
const pidPath = `${stackDirectory}/dev-stack.pid`;
const temporaryPidPath = `${pidPath}.${process.pid}.tmp`;
const turboCommand = ["bunx", "turbo", "dev", "--ui=stream"];
const readyTimeoutSeconds = 240;
const stopTimeoutSeconds = 20;

const readinessUrls = [
  "http://localhost:3001/health/live",
  "http://localhost:3001/health/ready",
  "http://localhost:3000/",
];
const stackPorts = [3000, 3001];

const sleep = (seconds: number) => Bun.sleep(seconds * 1000);

function fail(message: string): number {
  console.error(message);
  return 1;
}

// An identity is "<pid> <start time>"; a reused pid has a different start time.
function readIdentity(pid: number): string | null {
  try {
    const stat = fs.readFileSync(`/proc/${pid}/stat`, "utf8");
    // Start time is field 22, counted after the last ")" because the command name may contain any text.
    const startTime = stat.slice(stat.lastIndexOf(")") + 2).split(" ")[19];
    return startTime ? `${pid} ${startTime}` : null;
  } catch {
    return null;
  }
}

function readRecordedIdentity(): string | null {
  try {
    return fs.readFileSync(pidPath, "utf8").trim();
  } catch {
    return null;
  }
}

const readPidOf = (identity: string) => Number(identity.split(" ")[0]);

function removePidFileOwnedBy(identity: string) {
  if (readRecordedIdentity() === identity) fs.rmSync(pidPath, { force: true });
}

function readSessionPids(session: number): number[] {
  const listing = Bun.spawnSync(["pgrep", "-s", String(session)]);
  return listing.stdout.toString().split("\n").filter(Boolean).map(Number);
}

function readOwnedIdentity(): string | null {
  const recorded = readRecordedIdentity();
  if (recorded === null) return null;
  const pid = readPidOf(recorded);
  if (pid > 1 && readIdentity(pid) === recorded) return recorded;
  removePidFileOwnedBy(recorded);
  return null;
}

// Links a file holding this run's identity into place, which fails if another run holds it.
function claimPidFile(self: string, canRetry = true): boolean {
  fs.writeFileSync(temporaryPidPath, self);
  try {
    fs.linkSync(temporaryPidPath, pidPath);
    return true;
  } catch {
    return (
      readOwnedIdentity() === null && canRetry && claimPidFile(self, false)
    );
  } finally {
    fs.rmSync(temporaryPidPath, { force: true });
  }
}

function readAllStatuses() {
  return Promise.all(
    readinessUrls.map((url) =>
      fetch(url, { redirect: "manual" }).then(
        ({ status, ok }) => ({ url, status, ok }),
        () => ({ url, status: 0, ok: false }),
      ),
    ),
  );
}

function findBusyPorts(): number[] {
  return stackPorts.filter((port) => {
    try {
      Bun.listen({
        hostname: "0.0.0.0",
        port,
        socket: { data() {} },
      }).stop(true);
      return false;
    } catch {
      return true;
    }
  });
}

async function start(): Promise<number> {
  const self = readIdentity(process.pid);
  if (self === null) return fail("Cannot read the process start time.");
  fs.mkdirSync(stackDirectory, { recursive: true });
  if (!claimPidFile(self)) {
    return fail(
      `The dev stack is already running (${readRecordedIdentity()}).`,
    );
  }
  const busyPorts = findBusyPorts();
  if (busyPorts.length > 0) {
    removePidFileOwnedBy(self);
    return fail(`Ports already in use: ${busyPorts.join(", ")}.`);
  }

  const logDescriptor = fs.openSync(logPath, "w");
  const child = Bun.spawn(turboCommand, {
    detached: true,
    stdin: "ignore",
    stdout: logDescriptor,
    stderr: logDescriptor,
    env: { ...process.env, NO_COLOR: "1" },
  });
  fs.closeSync(logDescriptor);
  child.unref();
  const leader = readIdentity(child.pid) ?? self;
  fs.writeFileSync(temporaryPidPath, leader);
  fs.renameSync(temporaryPidPath, pidPath);
  console.info(`Dev stack starting: pid ${child.pid}, log ${logPath}.`);

  for (let second = 0; second < readyTimeoutSeconds; second++) {
    await sleep(1);
    if (readSessionPids(child.pid).length === 0) {
      removePidFileOwnedBy(leader);
      return fail(`The dev stack exited early; see ${logPath}.`);
    }
    const statuses = await readAllStatuses();
    if (statuses.every(({ ok }) => ok)) {
      console.info("Dev stack ready: API :3001, client :3000.");
      return 0;
    }
  }
  await stopStack(leader);
  return fail(
    `Not ready after ${readyTimeoutSeconds}s; the stack was stopped, see ${logPath}.`,
  );
}

async function status(): Promise<number> {
  const owned = readOwnedIdentity();
  console.info(
    owned === null
      ? "Not running."
      : `Running: pid ${readPidOf(owned)}, log ${logPath}.`,
  );
  const statuses = await readAllStatuses();
  console.info(
    statuses.map(({ url, status: code }) => `${code} ${url}`).join("\n"),
  );
  return owned !== null && statuses.every(({ ok }) => ok) ? 0 : 1;
}

async function stopStack(leader: string) {
  const leaderPid = readPidOf(leader);
  Bun.spawnSync(["pkill", "-TERM", "-s", String(leaderPid)]);
  for (let second = 0; second < stopTimeoutSeconds; second++) {
    if (readSessionPids(leaderPid).length === 0) break;
    await sleep(1);
  }
  Bun.spawnSync(["pkill", "-KILL", "-s", String(leaderPid)]);
  removePidFileOwnedBy(leader);
}

async function stop(): Promise<number> {
  const recorded = readOwnedIdentity();
  if (recorded !== null) await stopStack(recorded);
  console.info(recorded === null ? "Not running." : "Dev stack stopped.");
  return 0;
}

const commands = { start, status, stop };
const commandName = Bun.argv[2];

if (
  commandName !== "start" &&
  commandName !== "status" &&
  commandName !== "stop"
) {
  console.error("Usage: bun scripts/dev-stack.script.ts <start|status|stop>");
  process.exit(1);
}

process.exit(await commands[commandName]());
