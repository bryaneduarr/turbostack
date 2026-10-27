import {
  buttonBaseClassName,
  buttonSizeClassNames,
  buttonVariantClassNames,
} from "@workspace/ui/config/button/button-styles.config";
import type { HeaderMenuProps } from "@workspace/ui/types/components/navigation/header-menu-props.interface";

const triggerClassNames = {
  pill: "pressable flex shrink-0 items-center gap-2 rounded-full border border-transparent p-0.5 text-sm text-foreground hover:border-border hover:bg-muted sm:pr-2.5",
  icon: `${buttonBaseClassName} ${buttonVariantClassNames.ghost} ${buttonSizeClassNames.icon}`,
} satisfies Record<HeaderMenuProps["triggerShape"], string>;

const placementClassNames = {
  start: "left-2 origin-top-left sm:left-6",
  end: "right-2 origin-top-right sm:right-6",
} satisfies Record<HeaderMenuProps["placement"], string>;

// A native popover opens, closes on outside clicks and Escape, and works without JavaScript.
export function HeaderMenu({
  id,
  triggerLabel,
  trigger,
  triggerShape,
  placement,
  children,
}: HeaderMenuProps) {
  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        aria-label={triggerLabel}
        className={triggerClassNames[triggerShape]}
      >
        {trigger}
      </button>
      <div
        id={id}
        popover="auto"
        className={`inset-auto top-[calc(var(--header-height)-0.25rem)] m-0 w-72 max-w-[calc(100vw-1rem)] scale-95 rounded-xl border border-border bg-background p-1.5 text-foreground opacity-0 shadow-lg transition-[opacity,scale,display,overlay] transition-discrete duration-200 ease-smooth open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0 ${placementClassNames[placement]}`}
      >
        {children}
      </div>
    </>
  );
}
