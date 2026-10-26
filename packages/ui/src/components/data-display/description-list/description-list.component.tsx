import type { DescriptionListProps } from "@workspace/ui/types/components/data-display/description-list-props.interface";

export function DescriptionList({ entries }: DescriptionListProps) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[minmax(8rem,auto)_1fr]">
      {entries.map(({ term, description }) => (
        <div key={term} className="contents">
          <dt className="text-muted-foreground">{term}</dt>
          <dd className="mb-2 break-all text-foreground sm:mb-0">
            {description}
          </dd>
        </div>
      ))}
    </dl>
  );
}
