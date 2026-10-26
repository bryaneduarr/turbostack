import type { ComponentProps } from "react";

/** Describes one choice in a select field. */
export interface SelectFieldOption {
  /** Contains the submitted value. */
  value: string;
  /** Contains the text shown for the choice. */
  label: string;
}

/** Configures a labeled native select with its validation messages. */
export interface SelectFieldProps extends ComponentProps<"select"> {
  /** Contains the visible label that names the field. */
  label: string;
  /** Identifies the submitted form value. */
  name: string;
  /** Lists the choices in display order. */
  options: readonly SelectFieldOption[];
  /** Contains the validation messages to show; an empty list means the value is valid. */
  errors: string[];
}
