import type { ComponentProps } from "react";

/** Configures a labeled native text input with its validation messages. */
export interface TextFieldProps extends ComponentProps<"input"> {
  /** Contains the visible label that names the field for every user. */
  label: string;
  /** Identifies the submitted form value. */
  name: string;
  /** Selects the native input type, which controls keyboards and browser validation. */
  type: "text" | "email" | "password" | "search" | "tel" | "url" | "date";
  /** Contains the validation messages to show; an empty list means the value is valid. */
  errors: string[];
  /** Explains what the field expects, announced together with the input. */
  description?: string;
}
