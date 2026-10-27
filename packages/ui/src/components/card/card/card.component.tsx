import {
  cardBaseClassName,
  cardToneClassNames,
} from "@workspace/ui/config/card/card-styles.config";
import type { CardProps } from "@workspace/ui/types/components/card/card-props.interface";

export function Card({ tone, className, ...props }: CardProps) {
  const classNames = `${cardBaseClassName} ${cardToneClassNames[tone]}`;

  return (
    <div
      className={
        className === undefined ? classNames : `${classNames} ${className}`
      }
      {...props}
    />
  );
}
