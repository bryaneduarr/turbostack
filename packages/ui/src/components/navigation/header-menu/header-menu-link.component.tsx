import { Icon } from "@workspace/ui/components/icon/icon.component";
import type { HeaderMenuLinkProps } from "@workspace/ui/types/components/navigation/header-menu-props.interface";
import Link from "next/link";

export function HeaderMenuLink({
  href,
  label,
  iconClassName,
}: HeaderMenuLinkProps) {
  return (
    <Link
      href={href}
      className="pressable flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-foreground no-underline hover:bg-muted"
    >
      <Icon iconClassName={iconClassName} size="small" tone="muted" />
      {label}
    </Link>
  );
}
