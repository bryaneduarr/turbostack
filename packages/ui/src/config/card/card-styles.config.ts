import type { CardProps } from "@workspace/ui/types/components/card/card-props.interface";

export const cardBaseClassName = "rounded-xl border border-border p-5";

export const cardToneClassNames = {
  plain: "bg-background shadow-xs",
  subtle: "bg-surface",
} satisfies Record<CardProps["tone"], string>;
