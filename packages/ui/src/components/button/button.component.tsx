import {
  buttonBaseClassName,
  buttonSizeClassNames,
  buttonVariantClassNames,
} from "@workspace/ui/config/button/button-styles.config";
import type { ButtonProps } from "@workspace/ui/types/components/button/button-props.interface";

export function Button({
  variant,
  size,
  type,
  className,
  ...props
}: ButtonProps) {
  const classNames = `${buttonBaseClassName} ${buttonVariantClassNames[variant]} ${buttonSizeClassNames[size]}`;

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
