import type {
  ToastContent,
  ToastOptions,
  ToastType,
} from "@workspace/ui/types/components/toast/toast-options.interface";

/** Represents a toast held by the toast manager after its options are normalized. */
export interface ToastRecord extends ToastContent {
  /** Identifies the toast so it can be updated or closed. */
  id: string;
  /** Selects the status icon and color. */
  type: ToastType;
  /** Overrides the Toaster's position for this toast only. */
  position?: ToastOptions["position"];
  /** Sets how many milliseconds the toast stays open; 0 keeps it open until closed. */
  timeout: number;
  /** Tracks whether the toast is visible or playing its exit animation before removal. */
  status: "open" | "closing";
}
