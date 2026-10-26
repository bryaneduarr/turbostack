import type { TextLinkProps } from "@workspace/ui/types/components/link/text-link-props.interface";
import Link from "next/link";

const toneClassNames = {
  primary: "text-primary underline",
  muted:
    "text-muted-foreground no-underline hover:text-foreground hover:underline",
} satisfies Record<TextLinkProps["tone"], string>;

export function TextLink({ tone, className, ...props }: TextLinkProps) {
  const classNames = `rounded-sm ${toneClassNames[tone]}`;

  return (
    <Link
      className={
        className === undefined ? classNames : `${classNames} ${className}`
      }
      {...props}
    />
  );
}
