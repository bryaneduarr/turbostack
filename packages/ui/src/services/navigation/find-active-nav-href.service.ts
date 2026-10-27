import type { NavLinkTarget } from "@workspace/ui/types/components/navigation/nav-links-props.interface";

// The longest match wins, so an overview link stays inactive on its subpages.
export function findActiveNavHref(
  pathname: string,
  links: readonly NavLinkTarget[],
): string | null {
  let activeHref: string | null = null;
  for (const { href } of links) {
    const matches =
      pathname === href ||
      pathname.startsWith(href === "/" ? href : `${href}/`);
    if (matches && (activeHref === null || href.length > activeHref.length)) {
      activeHref = href;
    }
  }
  return activeHref;
}
