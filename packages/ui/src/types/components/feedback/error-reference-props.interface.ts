import type { SupportReference } from "@workspace/schemas/support/errors/codes/support-reference.interface";

/** Configures the line that shows a support error code and request ID with a copy action. */
export interface ErrorReferenceProps {
  /** Holds the error code and request ID that support uses to find the failure in the logs. */
  reference: SupportReference;
  /** Selects the text color: `muted` on page or surface backgrounds, `default` inside an error alert. */
  tone: "default" | "muted";
}
