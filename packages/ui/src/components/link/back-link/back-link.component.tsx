import type { BackLinkProps } from "@workspace/ui/types/components/link/back-link-props.interface";
import Link from "next/link";

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 self-start rounded-md text-sm text-muted-foreground no-underline hover:text-foreground"
    >
      <span
        aria-hidden="true"
        className="icon-[lucide--arrow-left] size-4 transition-[translate] duration-(--duration-spring) ease-spring group-hover:-translate-x-0.5"
      />
      {label}
    </Link>
  );
}
