import type { ChangeEvent, SubmitEvent } from "react";

/** Represents the browser-side check of a form, matching the result shape of the form parsers the server action also uses. */
export type ClientFormCheck<FieldErrors> =
  | { kind: "valid" }
  | { kind: "invalid"; state: { fieldErrors: FieldErrors } };

/** Exposes the browser-side validation state and the form handlers that apply it. */
export interface ClientFormValidation<FieldErrors> {
  /** Contains the latest browser-side check, which blocks submission while invalid. */
  check: ClientFormCheck<FieldErrors>;
  /** Validates the form before submission and cancels it when any field is invalid. */
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  /** Revalidates the form while the user corrects the fields of a blocked submission. */
  handleChange: (event: ChangeEvent<HTMLFormElement>) => void;
}
