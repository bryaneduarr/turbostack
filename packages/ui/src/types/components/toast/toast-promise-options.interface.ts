import type { ToastContent } from "@workspace/ui/types/components/toast/toast-options.interface";

/** Describes the messages one toast shows while a promise settles. */
export interface ToastPromiseOptions<Value> {
  /** Contains the message shown while the promise is pending. */
  loading: ToastContent;
  /** Builds the message shown when the promise resolves, from its resolved value. */
  success: ToastContent | ((value: Value) => ToastContent);
  /** Builds the message shown when the promise rejects, from its rejection reason. */
  error: ToastContent | ((reason: unknown) => ToastContent);
}
