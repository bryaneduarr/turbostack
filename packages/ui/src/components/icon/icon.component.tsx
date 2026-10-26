import type { IconProps } from "@workspace/ui/types/components/icon/icon-props.interface";

const sizeClassNames = {
  small: "size-4",
  medium: "size-4.5",
  large: "size-5",
} satisfies Record<IconProps["size"], string>;

const toneClassNames = {
  inherit: "",
  muted: "text-muted-foreground",
} satisfies Record<IconProps["tone"], string>;

// Decorative only; the control or text beside it carries the accessible name.
export function Icon({ iconClassName, size, tone }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 ${iconClassName} ${sizeClassNames[size]} ${toneClassNames[tone]}`}
    />
  );
}
