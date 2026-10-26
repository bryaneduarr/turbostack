import type { StaggerItemProps } from "@workspace/ui/types/components/motion/stagger-item-props.interface";

const staggerMilliseconds = 40;

export function StaggerItem({ index, children }: StaggerItemProps) {
  return (
    <li
      className="animate-rise-in"
      style={{ animationDelay: `${index * staggerMilliseconds}ms` }}
    >
      {children}
    </li>
  );
}
