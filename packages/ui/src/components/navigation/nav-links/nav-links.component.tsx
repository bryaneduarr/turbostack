"use client";

import { findActiveNavHref } from "@workspace/ui/services/navigation/find-active-nav-href.service";
import type { NavLinksProps } from "@workspace/ui/types/components/navigation/nav-links-props.interface";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

const orientationClassNames = {
  horizontal: "-mx-2 flex flex-wrap gap-1",
  vertical: "flex flex-col gap-0.5",
} satisfies Record<NavLinksProps["orientation"], string>;

// A persistent layout keeps its menu open across client navigations unless the link closes it.
function closeEnclosingPopover(event: MouseEvent<HTMLAnchorElement>) {
  const popover = event.currentTarget.closest<HTMLElement>("[popover]");
  if (popover !== null) popover.hidePopover();
}

export function NavLinks({ label, links, orientation }: NavLinksProps) {
  const activeHref = findActiveNavHref(usePathname(), links);

  return (
    <nav
      aria-label={label}
      className={`text-sm ${orientationClassNames[orientation]}`}
    >
      {links.map(({ href, label: linkLabel }) => (
        <Link
          key={href}
          href={href}
          aria-current={href === activeHref ? "page" : undefined}
          onClick={closeEnclosingPopover}
          className="pressable rounded-md px-2.5 py-1.5 text-muted-foreground no-underline hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-foreground"
        >
          {linkLabel}
        </Link>
      ))}
    </nav>
  );
}
