import { Icon } from "@workspace/ui/components/icon/icon.component";
import { HeaderMenu } from "@workspace/ui/components/navigation/header-menu/header-menu.component";
import { NavLinks } from "@workspace/ui/components/navigation/nav-links/nav-links.component";
import type { AppBarProps } from "@workspace/ui/types/components/navigation/app-bar-props.interface";
import Link from "next/link";

export function AppBar({ brand, navigation, children }: AppBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-(--header-height) items-center gap-2 px-3 sm:gap-6 sm:px-6">
        {navigation === null ? null : (
          <div className="flex md:hidden">
            <HeaderMenu
              id="app-navigation"
              triggerLabel="Open navigation"
              triggerShape="icon"
              placement="start"
              trigger={
                <Icon
                  iconClassName="icon-[lucide--menu]"
                  size="medium"
                  tone="inherit"
                />
              }
            >
              <NavLinks
                label={navigation.label}
                links={navigation.links}
                orientation="vertical"
              />
            </HeaderMenu>
          </div>
        )}
        <Link
          href={brand.href}
          aria-label={brand.label}
          className="pressable flex min-w-0 shrink-0 items-center gap-2 rounded-md text-sm font-semibold text-foreground no-underline max-[11.25rem]:hidden"
        >
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Icon
              iconClassName={brand.iconClassName}
              size="small"
              tone="inherit"
            />
          </span>
          <span className="hidden truncate min-[25rem]:inline">
            {brand.label}
          </span>
        </Link>
        {navigation === null ? null : (
          <div className="hidden min-w-0 flex-1 md:block">
            <NavLinks
              label={navigation.label}
              links={navigation.links}
              orientation="horizontal"
            />
          </div>
        )}
        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
          {children}
        </div>
      </div>
    </header>
  );
}
