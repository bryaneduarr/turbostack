import { fieldControlClassName } from "@workspace/ui/config/forms/fields/field-control.config";
import {
  fieldDescriptionClassName,
  fieldErrorsClassName,
  fieldFrameClassName,
  fieldLabelClassName,
} from "@workspace/ui/config/forms/fields/field-frame.config";
import type { TextFieldProps } from "@workspace/ui/types/components/text-field/text-field-props.interface";
import { useId } from "react";

export function TextField({
  label,
  name,
  type,
  errors,
  description,
  className,
  ...props
}: TextFieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorsId = `${id}-errors`;
  const invalid = errors.length > 0;
  const describingIds: string[] = [];
  if (description !== undefined) describingIds.push(descriptionId);
  if (invalid) describingIds.push(errorsId);
  const inputClassName = `h-9 ${fieldControlClassName}`;

  return (
    <div className={fieldFrameClassName}>
      <label htmlFor={id} className={fieldLabelClassName}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={invalid}
        aria-describedby={
          describingIds.length > 0 ? describingIds.join(" ") : undefined
        }
        className={
          className === undefined
            ? inputClassName
            : `${inputClassName} ${className}`
        }
        {...props}
      />
      {description === undefined ? null : (
        <p id={descriptionId} className={fieldDescriptionClassName}>
          {description}
        </p>
      )}
      {invalid ? (
        <ul id={errorsId} className={fieldErrorsClassName}>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
