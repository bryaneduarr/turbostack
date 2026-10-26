import { afterEach, beforeEach, describe, expect, jest, test } from "bun:test";
import {
  pauseToastTimers,
  readToasts,
  resumeToastTimers,
  TOAST_EXIT_DURATION,
  toast,
} from "@workspace/ui/services/toast/toast-manager.service";

function findToast(id: string) {
  return readToasts().find((record) => record.id === id);
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  for (const record of readToasts()) toast.close(record.id);
  jest.advanceTimersByTime(TOAST_EXIT_DURATION);
  jest.useRealTimers();
});

describe("toast manager", () => {
  test("closes a toast after its timeout and removes it after the exit animation", () => {
    const id = toast.add({ title: "Saved", timeout: 1000 });
    expect(findToast(id)).toMatchObject({ type: "default", status: "open" });

    jest.advanceTimersByTime(1000);
    expect(findToast(id)?.status).toBe("closing");

    jest.advanceTimersByTime(TOAST_EXIT_DURATION);
    expect(findToast(id)).toBeUndefined();
  });

  test("keeps loading toasts open until they are updated", () => {
    const id = toast.add({ title: "Uploading", type: "loading" });
    jest.advanceTimersByTime(60_000);
    expect(findToast(id)?.status).toBe("open");
  });

  test("turns a promise toast into a success toast with the resolved value", async () => {
    const pending = Promise.resolve(3);
    toast.promise(pending, {
      loading: { title: "Uploading", description: "Please wait" },
      success: (count) => ({ title: `Uploaded ${count} files` }),
      error: { title: "Upload failed" },
    });
    const [loading] = readToasts();
    expect(loading).toMatchObject({ type: "loading", timeout: 0 });

    await pending;
    expect(readToasts()).toEqual([
      expect.objectContaining({ type: "success", title: "Uploaded 3 files" }),
    ]);
    expect(readToasts()[0]?.description).toBeUndefined();
  });

  test("turns a promise toast into an error toast with the rejection reason", async () => {
    const pending = Promise.reject(new Error("Disk full"));
    const settled = toast
      .promise(pending, {
        loading: { title: "Uploading" },
        success: { title: "Uploaded" },
        error: (reason) => ({
          title: reason instanceof Error ? reason.message : "Upload failed",
        }),
      })
      .catch(() => undefined);

    await settled;
    expect(readToasts()).toEqual([
      expect.objectContaining({ type: "error", title: "Disk full" }),
    ]);
  });

  test("keeps its position when updated without a new one", () => {
    const id = toast.add({ title: "Draft", position: "top-left" });
    toast.update(id, { title: "Published", type: "success" });
    expect(findToast(id)).toMatchObject({
      title: "Published",
      position: "top-left",
    });
  });

  test("waits for every pause hold to end before resuming timers", () => {
    const id = toast.add({ title: "Saved", timeout: 1000 });
    jest.advanceTimersByTime(400);
    pauseToastTimers();
    pauseToastTimers();
    jest.advanceTimersByTime(5000);
    resumeToastTimers();
    jest.advanceTimersByTime(5000);
    expect(findToast(id)?.status).toBe("open");

    resumeToastTimers();
    jest.advanceTimersByTime(599);
    expect(findToast(id)?.status).toBe("open");
    jest.advanceTimersByTime(1);
    expect(findToast(id)?.status).toBe("closing");
  });
});
