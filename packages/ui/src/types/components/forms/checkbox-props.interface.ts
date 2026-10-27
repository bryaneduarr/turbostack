import type { ComponentProps } from "react";

/** Configures a labeled native checkbox with an animated check mark. */
export interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
  /** Contains the visible label that names the option. */
  label: string;
  /** Explains the option below its label, announced with the checkbox; null shows no explanation. */
  description: string | null;
}
