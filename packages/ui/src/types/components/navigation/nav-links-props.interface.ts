/** Describes one destination in a navigation bar. */
export interface NavLinkTarget {
  /** Contains the internal path the link opens. */
  href: string;
  /** Names the destination for sighted and assistive technology users. */
  label: string;
}

/** Configures a navigation list that highlights the current page. */
export interface NavLinksProps {
  /** Names the navigation landmark so several bars on one page stay distinct. */
  label: string;
  /** Lists the destinations in display order. */
  links: readonly NavLinkTarget[];
  /** Lays the links out in a row for bars or in a column for menus. */
  orientation: "horizontal" | "vertical";
}
