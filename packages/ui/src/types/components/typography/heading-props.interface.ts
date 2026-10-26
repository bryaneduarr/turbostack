import type { ComponentProps } from "react";

/** Configures a document heading whose outline level and visual size are chosen separately. */
export interface HeadingProps extends ComponentProps<"h1"> {
  /** Selects the heading element, which sets its place in the document outline. */
  level: 1 | 2 | 3;
  /** Selects the visual scale: landing hero, page title, section title, or small group label. */
  size: "display" | "page" | "section" | "label";
}
