import type { SupportReference } from "@workspace/schemas/support/errors/codes/support-reference.interface";

/** Configures an error alert that states a failure and shows the reference support needs to find it. */
export interface FailureAlertProps {
  /** Describes the failure in a sentence the person can read. */
  message: string;
  /** Holds the error code and request ID shown under the message. */
  reference: SupportReference;
}
