import type { ComponentProps } from "react";

export function HeaderMenuSection(props: ComponentProps<"div">) {
  return (
    <div
      className="flex flex-col border-t border-border px-1 py-1.5 first:border-t-0"
      {...props}
    />
  );
}
