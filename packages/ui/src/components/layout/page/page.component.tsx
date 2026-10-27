import type { PageProps } from "@workspace/ui/types/components/layout/page-props.interface";

const widthClassNames = {
  form: "max-w-sm",
  app: "max-w-5xl",
} satisfies Record<PageProps["width"], string>;

const alignClassNames = {
  start: "",
  center: "justify-center",
} satisfies Record<PageProps["align"], string>;

// The landmark clips the entrance's downward offset so it never adds a scrollbar.
export function Page({ width, align, children }: PageProps) {
  return (
    <main className="flex w-full flex-1 flex-col overflow-clip px-4 py-6 sm:px-6 sm:py-10">
      <div
        className={`mx-auto flex w-full min-w-0 flex-1 animate-rise-in flex-col gap-6 ${widthClassNames[width]} ${alignClassNames[align]}`}
      >
        {children}
      </div>
    </main>
  );
}
