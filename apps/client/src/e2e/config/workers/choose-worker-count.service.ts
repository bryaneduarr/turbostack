import { readFileSync } from "node:fs";
import { availableParallelism, freemem } from "node:os";

const MAX_WORKERS = 4;
const MEBIBYTE = 1024 * 1024;
// Measured on 172 tests: the servers, the API, and the runner hold about 900 MiB,
// and each worker with its Chromium about 300 MiB.
const SHARED_MEBIBYTES = 900;
const WORKER_MEBIBYTES = 300;

// A container reports the host's memory in /proc/meminfo, so its own limit is read too.
function readContainerLimitBytes(): number {
  try {
    const limit = Number(readFileSync("/sys/fs/cgroup/memory.max", "utf8"));
    return Number.isNaN(limit) ? Number.POSITIVE_INFINITY : limit;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

// Four workers give the lowest time times memory; a machine with little free
// memory or few cores gets fewer, so the suite never runs it out of memory.
export function chooseWorkerCount(): number {
  const budgetMebibytes =
    Math.min(freemem(), readContainerLimitBytes()) / MEBIBYTE;
  const byMemory = Math.floor(
    (budgetMebibytes - SHARED_MEBIBYTES) / WORKER_MEBIBYTES,
  );
  return Math.max(1, Math.min(MAX_WORKERS, byMemory, availableParallelism()));
}
