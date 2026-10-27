import type { SupportReference } from "@workspace/schemas/support/errors/codes/support-reference.interface";

/** Represents a failed change, with the message shown to the user and the support reference shown beside it. */
export interface FailedMutationState {
  /** Marks the state as a failed change. */
  kind: "failed";
  /** Contains the message describing why the change failed. */
  message: string;
  /** Identifies the failure for support, with the server request ID when one exists. */
  reference: SupportReference;
}
