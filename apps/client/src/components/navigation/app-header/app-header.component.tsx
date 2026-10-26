import { AppBar } from "@workspace/ui/components/navigation/app-bar/app-bar.component";
import { APP_NAME } from "@/config/branding/app-name.config";

const brand = {
  href: "/",
  label: APP_NAME,
  iconClassName: "icon-[lucide--layers]",
};

const navigation = {
  label: "Main",
  links: [
    { href: "/", label: "Home" },
    { href: "/profiles", label: "Profiles" },
  ],
};

export function AppHeader() {
  return (
    <AppBar brand={brand} navigation={navigation}>
      {null}
    </AppBar>
  );
}
