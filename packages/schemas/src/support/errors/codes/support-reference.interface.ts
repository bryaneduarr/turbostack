import type { SUPPORT_ERROR_CODE } from "@workspace/schemas/support/errors/codes/support-error-code.constant";

/** Represents a code support uses to identify one kind of failure. */
export type SupportErrorCode =
  (typeof SUPPORT_ERROR_CODE)[keyof typeof SUPPORT_ERROR_CODE];

/** Represents the support code and request ID shown with a failure. */
export interface SupportReference {
  /** Identifies the kind of failure for support. */
  code: SupportErrorCode;
  /** Holds the request ID the failure showed. */
  requestId: string | null;
}
