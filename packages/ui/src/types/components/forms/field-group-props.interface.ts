import type { ReactNode } from "react";

/** Configures a labeled group of related form controls with shared validation messages. */
export interface FieldGroupProps {
  /** Contains the visible legend that names the group. */
  legend: string;
  /** Contains the group's validation messages; an empty list means the selection is valid. */
  errors: string[];
  /** Contains the grouped controls. */
  children: ReactNode;
}
