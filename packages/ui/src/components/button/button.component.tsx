import type { ButtonProps } from "@workspace/ui/types/components/button/button-props.interface";

const baseClassName =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent font-medium transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variantClassNames = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border-border bg-background hover:bg-muted",
  ghost: "hover:bg-muted",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
} satisfies Record<ButtonProps["variant"], string>;

const sizeClassNames = {
  small: "h-8 px-3 text-xs",
  medium: "h-9 px-4 text-sm",
  large: "h-10 px-6 text-base",
} satisfies Record<ButtonProps["size"], string>;

export function Button({
  variant,
  size,
  type,
  className,
  ...props
}: ButtonProps) {
  const classNames = `${baseClassName} ${variantClassNames[variant]} ${sizeClassNames[size]}`;

  return (
    <button
      type={type}
      className={
        className === undefined ? classNames : `${classNames} ${className}`
      }
      {...props}
    />
  );
}
