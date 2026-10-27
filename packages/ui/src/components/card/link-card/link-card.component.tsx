import { Icon } from "@workspace/ui/components/icon/icon.component";
import {
  cardBaseClassName,
  cardToneClassNames,
} from "@workspace/ui/config/card/card-styles.config";
import type { LinkCardProps } from "@workspace/ui/types/components/card/link-card-props.interface";
import Link from "next/link";

export function LinkCard({
  href,
  title,
  description,
  iconClassName,
}: LinkCardProps) {
  return (
    <Link
      href={href}
      className={`group lift flex h-full flex-col gap-3 no-underline active:scale-[0.99] ${cardBaseClassName} ${cardToneClassNames.plain}`}
    >
      <span className="flex items-center justify-between">
        <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground">
          <Icon iconClassName={iconClassName} size="medium" tone="inherit" />
        </span>
        <span
          aria-hidden="true"
          className="icon-[lucide--arrow-up-right] size-4 text-muted-foreground opacity-0 transition-[opacity,translate] duration-200 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </span>
    </Link>
  );
}
