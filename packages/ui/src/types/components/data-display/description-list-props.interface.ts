import type { ReactNode } from "react";

/** Describes one labeled property in a description list. */
export interface DescriptionListEntry {
  /** Names the property. */
  term: string;
  /** Contains the property's value. */
  description: ReactNode;
}

/** Configures a two-column list of labeled properties that stacks on narrow screens. */
export interface DescriptionListProps {
  /** Lists the properties in display order; terms must be unique. */
  entries: readonly DescriptionListEntry[];
}
