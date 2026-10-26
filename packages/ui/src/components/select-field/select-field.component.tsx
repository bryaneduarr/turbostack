import { fieldControlClassName } from "@workspace/ui/config/forms/fields/field-control.config";
import {
  fieldErrorsClassName,
  fieldFrameClassName,
  fieldLabelClassName,
} from "@workspace/ui/config/forms/fields/field-frame.config";
import type { SelectFieldProps } from "@workspace/ui/types/components/select-field/select-field-props.interface";
import { useId } from "react";

export function SelectField({
  label,
  name,
  options,
  errors,
  ...props
}: SelectFieldProps) {
  const id = useId();
  const errorsId = `${id}-errors`;
  const invalid = errors.length > 0;

  return (
    <div className={fieldFrameClassName}>
      <label htmlFor={id} className={fieldLabelClassName}>
        {label}
      </label>
      <span className="relative flex">
        <select
          id={id}
          name={name}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorsId : undefined}
          className={`h-9 appearance-none pr-9 ${fieldControlClassName}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="icon-[lucide--chevrons-up-down] pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </span>
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
