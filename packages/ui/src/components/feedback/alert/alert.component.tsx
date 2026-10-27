import { Icon } from "@workspace/ui/components/icon/icon.component";
import type { AlertProps } from "@workspace/ui/types/components/feedback/alert-props.interface";

const toneClassNames = {
  error: "border-destructive/25 bg-destructive/8 text-destructive",
  warning: "border-warning/30 bg-warning/10 text-foreground",
  success: "border-success/30 bg-success/10 text-foreground",
  info: "border-border bg-surface text-foreground",
} satisfies Record<AlertProps["tone"], string>;

const iconClassNames = {
  error: "icon-[lucide--circle-alert]",
  warning: "icon-[lucide--triangle-alert]",
  success: "icon-[lucide--circle-check]",
  info: "icon-[lucide--info]",
} satisfies Record<AlertProps["tone"], string>;

export function Alert({ tone, className, children, ...props }: AlertProps) {
  const classNames = `flex animate-rise-in items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${toneClassNames[tone]}`;

  return (
    <div
      className={
        className === undefined ? classNames : `${classNames} ${className}`
      }
      {...props}
    >
      <span className="mt-0.5 flex">
        <Icon
          iconClassName={iconClassNames[tone]}
          size="small"
          tone="inherit"
        />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
