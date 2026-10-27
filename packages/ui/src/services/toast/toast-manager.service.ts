import type {
  ToastContent,
  ToastOptions,
} from "@workspace/ui/types/components/toast/toast-options.interface";
import type { ToastPromiseOptions } from "@workspace/ui/types/components/toast/toast-promise-options.interface";
import type { ToastRecord } from "@workspace/ui/types/components/toast/toast-record.interface";
import type { ToastTimer } from "@workspace/ui/types/components/toast/toast-timer.interface";

const DEFAULT_TIMEOUT = 5000;
// Must match the exit transition duration in the toast card.
export const TOAST_EXIT_DURATION = 200;

let toasts: ToastRecord[] = [];
let pauseHolds = 0;
let lastId = 0;
const listeners = new Set<() => void>();
const timers = new Map<string, ToastTimer>();

function publish(nextToasts: ToastRecord[]) {
  toasts = nextToasts;
  for (const listener of listeners) listener();
}

function createRecord(id: string, options: ToastOptions): ToastRecord {
  const type = options.type ?? "default";
  const defaultTimeout = type === "loading" ? 0 : DEFAULT_TIMEOUT;

  return {
    ...options,
    id,
    type,
    timeout: options.timeout ?? defaultTimeout,
    status: "open",
  };
}

function stopTimer(id: string) {
  const timer = timers.get(id);
  if (timer === undefined) return;
  if (timer.handle !== null) clearTimeout(timer.handle);
  timers.delete(id);
}

function startTimer(id: string, remaining: number) {
  stopTimer(id);
  if (remaining === 0) return;
  timers.set(id, {
    handle: pauseHolds > 0 ? null : setTimeout(() => close(id), remaining),
    remaining,
    startedAt: Date.now(),
  });
}

function add(options: ToastOptions) {
  lastId += 1;
  const record = createRecord(`toast-${lastId}`, options);
  publish([...toasts, record]);
  startTimer(record.id, record.timeout);
  return record.id;
}

function update(id: string, options: ToastOptions) {
  const current = toasts.find((record) => record.id === id);
  if (current === undefined || current.status === "closing") return;

  const position = options.position ?? current.position;
  const record = createRecord(
    id,
    position === undefined ? options : { ...options, position },
  );
  publish(toasts.map((existing) => (existing.id === id ? record : existing)));
  startTimer(id, record.timeout);
}

function close(id: string) {
  const current = toasts.find((record) => record.id === id);
  if (current === undefined || current.status === "closing") return;

  stopTimer(id);
  publish(
    toasts.map((record) =>
      record.id === id ? { ...record, status: "closing" } : record,
    ),
  );
  setTimeout(
    () => publish(toasts.filter((record) => record.id !== id)),
    TOAST_EXIT_DURATION,
  );
}

function resolveContent<Input>(
  content: ToastContent | ((input: Input) => ToastContent),
  input: Input,
) {
  return typeof content === "function" ? content(input) : content;
}

function promise<Value>(
  pending: Promise<Value>,
  options: ToastPromiseOptions<Value>,
) {
  const id = add({ ...options.loading, type: "loading" });
  pending.then(
    (value) =>
      update(id, {
        ...resolveContent(options.success, value),
        type: "success",
      }),
    (reason: unknown) =>
      update(id, { ...resolveContent(options.error, reason), type: "error" }),
  );
  return pending;
}

export function pauseToastTimers() {
  pauseHolds += 1;
  if (pauseHolds > 1) return;
  const now = Date.now();
  for (const timer of timers.values()) {
    if (timer.handle !== null) clearTimeout(timer.handle);
    timer.handle = null;
    timer.remaining -= now - timer.startedAt;
  }
}

export function resumeToastTimers() {
  if (pauseHolds === 0) return;
  pauseHolds -= 1;
  if (pauseHolds > 0) return;
  for (const [id, timer] of timers) {
    timer.startedAt = Date.now();
    timer.handle = setTimeout(() => close(id), Math.max(timer.remaining, 0));
  }
}

export function subscribeToToasts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readToasts() {
  return toasts;
}

export const toast = { add, update, close, promise };
