import {
  textSizeClassNames,
  textToneClassNames,
  textWeightClassNames,
} from "@workspace/ui/config/typography/text-styles.config";
import type { TextProps } from "@workspace/ui/types/components/typography/text-props.interface";

export function Text({
  as: Element,
  size,
  tone,
  weight,
  className,
  ...props
}: TextProps) {
  const classNames = `${textSizeClassNames[size]} ${textToneClassNames[tone]} ${textWeightClassNames[weight]}`;

  return (
    <Element
      className={
        className === undefined ? classNames : `${classNames} ${className}`
      }
      {...props}
    />
  );
}
