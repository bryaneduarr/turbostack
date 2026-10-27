import { AppHeader } from "@/components/navigation/app-header/app-header.component";
import type { RootTemplateProps } from "@/types/app/template/root-template-props.interface";

// Unlike a layout, a template renders again on every navigation, which keeps the header current.
export default function RootTemplate({ children }: RootTemplateProps) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
