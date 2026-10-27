import type { BadgeProps } from "@workspace/ui/types/components/badge/badge-props.interface";

const toneClassNames = {
  neutral: "border-border bg-muted text-foreground",
  primary: "border-accent/25 bg-accent/10 text-foreground",
  warning: "border-warning/30 bg-warning/10 text-foreground",
  success: "border-success/30 bg-success/10 text-foreground",
} satisfies Record<BadgeProps["tone"], string>;

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ${toneClassNames[tone]}`}
    >
      {children}
    </span>
  );
}
