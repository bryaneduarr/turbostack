import type { DividedListProps } from "@workspace/ui/types/components/data-display/divided-list-props.interface";
import type { ComponentProps } from "react";

export function DividedList({
  as: Element,
  className,
  ...props
}: DividedListProps) {
  return (
    <Element
      className={
        className === undefined
          ? "flex flex-col divide-y divide-border"
          : `flex flex-col divide-y divide-border ${className}`
      }
      {...props}
    />
  );
}

export function DividedListItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={
        className === undefined
          ? "flex flex-col gap-1.5 py-3 text-sm"
          : `flex flex-col gap-1.5 py-3 text-sm ${className}`
      }
      {...props}
    />
  );
}
