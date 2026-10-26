import type { ComponentProps } from "react";

/** Configures a labeled multi-line text input with its validation messages. */
export interface TextAreaFieldProps extends ComponentProps<"textarea"> {
  /** Contains the visible label that names the field. */
  label: string;
  /** Identifies the submitted form value. */
  name: string;
  /** Contains the validation messages to show; an empty list means the value is valid. */
  errors: string[];
}
