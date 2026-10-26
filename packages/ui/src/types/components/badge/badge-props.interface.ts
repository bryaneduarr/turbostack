import type { ReactNode } from "react";

/** Configures a short inline label that marks a status or category. */
export interface BadgeProps {
  /** Selects the badge's emphasis color. */
  tone: "neutral" | "primary" | "warning" | "success";
  /** Contains the badge's short text. */
  children: ReactNode;
}
