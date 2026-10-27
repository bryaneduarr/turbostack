import {
  buttonBaseClassName,
  buttonSizeClassNames,
  buttonVariantClassNames,
} from "@workspace/ui/config/button/button-styles.config";
import type { ButtonLinkProps } from "@workspace/ui/types/components/button/button-link-props.interface";
import Link from "next/link";

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  const classNames = `${buttonBaseClassName} ${buttonVariantClassNames[variant]} ${buttonSizeClassNames[size]}`;

  return (
    <Link
      className={
        className === undefined ? classNames : `${classNames} ${className}`
      }
      {...props}
    />
  );
}
