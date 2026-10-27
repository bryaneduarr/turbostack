import type { ComponentProps } from "react";

/** Configures an inline message that reports an outcome or a problem. */
export interface AlertProps extends ComponentProps<"div"> {
  /** Selects the status color and icon that match the message. */
  tone: "error" | "warning" | "success" | "info";
}
