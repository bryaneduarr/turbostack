import type { ComponentProps } from "react";

/** Configures a bordered panel that groups related content. */
export interface CardProps extends ComponentProps<"div"> {
  /** Selects a raised panel on the page canvas or a quiet tinted panel. */
  tone: "plain" | "subtle";
}
