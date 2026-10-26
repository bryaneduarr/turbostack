import type { ComponentProps } from "react";

/** Configures body copy drawn from the shared type scale and color roles. */
export interface TextProps extends ComponentProps<"p"> {
  /** Selects a paragraph for standalone copy or a span for inline copy. */
  as: "p" | "span";
  /** Selects the type size, from captions to lead paragraphs. */
  size: "caption" | "small" | "body" | "lead";
  /** Selects the color role that conveys the text's emphasis or status. */
  tone: "default" | "muted" | "destructive" | "success";
  /** Selects the font weight. */
  weight: "regular" | "medium";
}
