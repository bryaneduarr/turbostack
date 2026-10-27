import type { HeadingProps } from "@workspace/ui/types/components/typography/heading-props.interface";

const sizeClassNames = {
  display: "text-4xl font-semibold tracking-tight sm:text-5xl",
  page: "text-2xl font-semibold tracking-tight sm:text-3xl",
  section: "text-lg font-semibold",
  label: "text-sm font-semibold",
} satisfies Record<HeadingProps["size"], string>;

export function Heading({ level, size, className, ...props }: HeadingProps) {
  const Element = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
  const classNames = `text-foreground ${sizeClassNames[size]}`;

  return (
    <Element
      className={
        className === undefined ? classNames : `${classNames} ${className}`
      }
      {...props}
    />
  );
}
