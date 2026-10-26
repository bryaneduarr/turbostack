import type { ComponentProps } from "react";

/** Configures a vertical list whose items are separated by hairlines. */
export interface DividedListProps extends Omit<ComponentProps<"ul">, "ref"> {
  /** Selects an unordered list, or an ordered list when the sequence matters. */
  as: "ul" | "ol";
}
