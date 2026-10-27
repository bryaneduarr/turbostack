import type { ToastPosition } from "@workspace/ui/types/components/toast/toast-options.interface";
import type { ToastRecord } from "@workspace/ui/types/components/toast/toast-record.interface";

/** Configures one rendered toast inside its position's stack. */
export interface ToastCardProps {
  /** Contains the toast's current content, type, and lifecycle status. */
  toast: ToastRecord;
  /** Sets the resolved position, which decides the edge the toast slides from. */
  position: ToastPosition;
}
