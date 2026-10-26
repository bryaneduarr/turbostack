import type { ToastPosition } from "@workspace/ui/types/components/toast/toast-options.interface";

/** Configures the region that renders every toast in the application. */
export interface ToasterProps {
  /** Sets the default position for toasts that do not choose their own. */
  position: ToastPosition;
}
