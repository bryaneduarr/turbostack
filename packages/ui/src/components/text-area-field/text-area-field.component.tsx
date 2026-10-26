import { fieldControlClassName } from "@workspace/ui/config/forms/fields/field-control.config";
import {
  fieldErrorsClassName,
  fieldFrameClassName,
  fieldLabelClassName,
} from "@workspace/ui/config/forms/fields/field-frame.config";
import type { TextAreaFieldProps } from "@workspace/ui/types/components/text-area-field/text-area-field-props.interface";
import { useId } from "react";

export function TextAreaField({
  label,
  name,
  errors,
  ...props
}: TextAreaFieldProps) {
  const id = useId();
  const errorsId = `${id}-errors`;
  const invalid = errors.length > 0;

  return (
    <div className={fieldFrameClassName}>
      <label htmlFor={id} className={fieldLabelClassName}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorsId : undefined}
        className={`min-h-20 py-2 ${fieldControlClassName}`}
        {...props}
      />
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
