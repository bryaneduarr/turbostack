import type { NavLinksProps } from "@workspace/ui/types/components/navigation/nav-links-props.interface";
import type { ReactNode } from "react";

/** Describes the product mark at the start of the app bar. */
export interface AppBarBrand {
  /** Contains the internal path the mark links to, usually the home page. */
  href: string;
  /** Contains the product name shown beside the mark on wider screens. */
  label: string;
  /** Contains the Iconify utility class drawn inside the mark. */
  iconClassName: string;
}

/** Configures the sticky, translucent bar shared by every app's pages. */
export interface AppBarProps {
  /** Describes the product mark that links home. */
  brand: AppBarBrand;
  /** Describes the main navigation, inline on wide screens and in a menu on narrow ones, or null for none. */
  navigation: Omit<NavLinksProps, "orientation"> | null;
  /** Contains the actions at the end of the bar, such as menus and buttons. */
  children: ReactNode;
}
