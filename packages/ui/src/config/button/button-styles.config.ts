import type { ButtonProps } from "@workspace/ui/types/components/button/button-props.interface";

export const buttonBaseClassName =
  "pressable inline-flex max-w-full items-center justify-center gap-2 rounded-lg text-center border border-transparent font-medium no-underline select-none disabled:pointer-events-none disabled:opacity-50 [&>[class*=icon-]]:size-4 [&>[class*=icon-]]:shrink-0";

export const buttonVariantClassNames = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-border",
  outline:
    "border-border bg-background text-foreground shadow-xs hover:border-border-strong hover:bg-surface",
  ghost: "text-foreground hover:bg-muted",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover",
} satisfies Record<ButtonProps["variant"], string>;

export const buttonSizeClassNames = {
  small: "min-h-8 px-3 py-1 text-xs",
  medium: "min-h-9 px-3.5 py-1.5 text-sm",
  large: "min-h-11 px-5 py-2 text-sm",
  icon: "size-9 shrink-0 text-muted-foreground hover:text-foreground [&>[class*=icon-]]:size-4.5",
} satisfies Record<ButtonProps["size"], string>;
