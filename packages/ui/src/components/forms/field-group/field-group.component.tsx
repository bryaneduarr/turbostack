import type { FieldGroupProps } from "@workspace/ui/types/components/forms/field-group-props.interface";
import { useId } from "react";

export function FieldGroup({ legend, errors, children }: FieldGroupProps) {
  const errorsId = useId();
  const invalid = errors.length > 0;

  return (
    <fieldset
      aria-describedby={invalid ? errorsId : undefined}
      className="flex flex-col gap-3"
    >
      <legend className="mb-3 text-sm font-medium text-foreground">
        {legend}
      </legend>
      {children}
      {invalid ? (
        <ul id={errorsId} className="animate-shake text-xs text-destructive">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </fieldset>
  );
}
