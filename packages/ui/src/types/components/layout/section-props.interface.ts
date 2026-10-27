import type { ReactNode } from "react";

/** Configures a titled page region that assistive technology lists by its title. */
export interface SectionProps {
  /** Contains the visible section title, which also names the region. */
  title: string;
  /** Contains the section content below the title. */
  children: ReactNode;
}
