import type { ReactNode } from "react";

/** Configures the main landmark that frames a page's content below the header. */
export interface PageProps {
  /** Selects the narrow form width for standalone pages or the shared app width for every signed-in page. */
  width: "form" | "app";
  /** Selects whether content starts at the top or sits in the vertical center. */
  align: "start" | "center";
  /** Contains the page content. */
  children: ReactNode;
}
