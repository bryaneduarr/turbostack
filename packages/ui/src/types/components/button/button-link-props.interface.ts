import type { ButtonProps } from "@workspace/ui/types/components/button/button-props.interface";
import type Link from "next/link";
import type { ComponentProps } from "react";

/** Configures an internal navigation link that looks like a button. */
export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  /** Selects the same visual emphasis a button of this variant has. */
  variant: ButtonProps["variant"];
  /** Selects the same height, padding, and text size a button of this size has. */
  size: ButtonProps["size"];
}
