import type { TextProps } from "@workspace/ui/types/components/typography/text-props.interface";

export const textSizeClassNames = {
  caption: "text-xs",
  small: "text-sm",
  body: "text-base",
  lead: "text-lg",
} satisfies Record<TextProps["size"], string>;

export const textToneClassNames = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
  success: "text-success",
} satisfies Record<TextProps["tone"], string>;

export const textWeightClassNames = {
  regular: "font-normal",
  medium: "font-medium",
} satisfies Record<TextProps["weight"], string>;
