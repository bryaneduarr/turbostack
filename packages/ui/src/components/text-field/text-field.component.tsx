import type { TextFieldProps } from "@workspace/ui/types/components/text-field/text-field-props.interface";
import { useId } from "react";

export function TextField({
  label,
  name,
  type,
  errors,
  className,
  ...props
}: TextFieldProps) {
  const id = useId();
  const errorsId = `${id}-errors`;
  const invalid = errors.length > 0;
  const inputClassName =
    "h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 aria-invalid:border-destructive";

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorsId : undefined}
        className={
          className === undefined
            ? inputClassName
            : `${inputClassName} ${className}`
        }
        {...props}
      />
      {invalid ? (
        <ul id={errorsId} className="text-xs text-destructive">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
