/** Configures a decorative Lucide icon drawn with an Iconify utility class. */
export interface IconProps {
  /** Contains the Iconify utility class, such as `icon-[lucide--bell]`. */
  iconClassName: string;
  /** Selects the icon size: inline with text, toolbar, or feature tile. */
  size: "small" | "medium" | "large";
  /** Selects whether the icon matches the surrounding text or recedes. */
  tone: "inherit" | "muted";
}
