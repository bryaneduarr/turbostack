import type Link from "next/link";
import type { ComponentProps } from "react";

/** Configures an inline text link that inherits the surrounding text size. */
export interface TextLinkProps extends ComponentProps<typeof Link> {
  /** Selects an underlined primary link or a quiet muted link that underlines on hover. */
  tone: "primary" | "muted";
}
