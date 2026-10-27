import type { ReactNode } from "react";

/** Configures a menu that drops down from the app bar. */
export interface HeaderMenuProps {
  /** Identifies the popover so its trigger can open it; unique per page. */
  id: string;
  /** Names the trigger for assistive technology, including whom or what the menu belongs to. */
  triggerLabel: string;
  /** Contains the trigger's visible content, such as an avatar and a name. */
  trigger: ReactNode;
  /** Shapes the trigger as a pill around an avatar and name or as a square icon button. */
  triggerShape: "pill" | "icon";
  /** Anchors the panel under the start or the end of the app bar. */
  placement: "start" | "end";
  /** Contains the menu panel's content. */
  children: ReactNode;
}

/** Configures one destination inside a header menu. */
export interface HeaderMenuLinkProps {
  /** Contains the internal path the item opens. */
  href: string;
  /** Names the destination. */
  label: string;
  /** Contains the Iconify utility class drawn before the label. */
  iconClassName: string;
}
