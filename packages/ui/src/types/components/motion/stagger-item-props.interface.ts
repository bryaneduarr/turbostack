import type { ReactNode } from "react";

/** Configures a list item that rises in after the items before it. */
export interface StaggerItemProps {
  /** Positions the item in its list, which delays its entrance. */
  index: number;
  /** Contains the item content. */
  children: ReactNode;
}
