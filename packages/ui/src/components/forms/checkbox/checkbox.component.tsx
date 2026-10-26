import type { CheckboxProps } from "@workspace/ui/types/components/forms/checkbox-props.interface";
import { useId } from "react";

export function Checkbox({ label, description, ...props }: CheckboxProps) {
  const descriptionId = useId();

  return (
    <label className="group flex items-start gap-3 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-50">
      <span className="relative mt-0.5 inline-flex size-4 shrink-0">
        <input
          type="checkbox"
          aria-describedby={description === null ? undefined : descriptionId}
          className="pressable peer size-4 shrink-0 appearance-none rounded-[5px] border border-border-strong bg-background shadow-xs checked:border-primary checked:bg-primary group-hover:border-foreground/40 disabled:pointer-events-none"
          {...props}
        />
        <span
          aria-hidden="true"
          className="icon-[lucide--check] pointer-events-none absolute inset-0 size-4 scale-75 text-primary-foreground opacity-0 transition-[opacity,scale,clip-path] duration-(--duration-spring) ease-spring [clip-path:inset(0_100%_0_0)] peer-checked:scale-100 peer-checked:opacity-100 peer-checked:[clip-path:inset(0)]"
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-medium text-foreground">{label}</span>
        {description === null ? null : (
          <span id={descriptionId} className="text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
