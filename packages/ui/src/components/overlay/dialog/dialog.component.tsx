import type { ComponentProps } from "react";

export function Dialog(props: ComponentProps<"dialog">) {
  return (
    <dialog
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-background p-4 sm:p-6 text-foreground shadow-lg open:animate-scale-in backdrop:bg-foreground/30 backdrop:backdrop-blur-sm"
      {...props}
    />
  );
}
