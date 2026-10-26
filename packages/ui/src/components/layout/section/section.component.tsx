import { Heading } from "@workspace/ui/components/typography/heading/heading.component";
import type { SectionProps } from "@workspace/ui/types/components/layout/section-props.interface";
import { useId } from "react";

export function Section({ title, children }: SectionProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <Heading id={titleId} level={2} size="section">
        {title}
      </Heading>
      {children}
    </section>
  );
}
