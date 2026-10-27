import type { ComponentProps } from "react";

/** Configures a native button with explicit visual style and form behavior. */
export interface ButtonProps extends ComponentProps<"button"> {
  /** Selects the visual emphasis, from the main call to action to a quiet text button. */
  variant: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  /** Selects the button's height, horizontal padding, and text size. */
  size: "small" | "medium" | "large";
  /** Declares the native behavior, because browsers submit forms by default. */
  type: "button" | "submit" | "reset";
}
