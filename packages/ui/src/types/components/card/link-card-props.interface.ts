/** Configures a clickable card that opens an internal page. */
export interface LinkCardProps {
  /** Contains the internal path the card opens. */
  href: string;
  /** Names the destination as the card's heading. */
  title: string;
  /** Explains in one sentence what the destination offers. */
  description: string;
  /** Contains the Iconify utility class drawn beside the title, such as `icon-[lucide--users]`. */
  iconClassName: string;
}
