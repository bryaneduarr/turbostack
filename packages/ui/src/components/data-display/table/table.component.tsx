import type { ComponentProps } from "react";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-border shadow-xs">
      <table
        className={
          className === undefined
            ? "w-full text-left text-sm"
            : `w-full text-left text-sm ${className}`
        }
        {...props}
      />
    </div>
  );
}

export function TableHead({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={
        className === undefined
          ? "border-b border-border bg-surface text-xs text-muted-foreground"
          : `border-b border-border bg-surface text-xs text-muted-foreground ${className}`
      }
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      className={
        className === undefined
          ? "divide-y divide-border"
          : `divide-y divide-border ${className}`
      }
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={
        className === undefined
          ? "transition-colors duration-(--duration-base) ease-smooth hover:bg-surface/60"
          : `transition-colors duration-(--duration-base) ease-smooth hover:bg-surface/60 ${className}`
      }
      {...props}
    />
  );
}

export function TableHeaderCell({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={
        className === undefined
          ? "px-4 py-2.5 font-medium whitespace-nowrap"
          : `px-4 py-2.5 font-medium whitespace-nowrap ${className}`
      }
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={
        className === undefined
          ? "min-w-36 px-4 py-3 align-top"
          : `min-w-36 px-4 py-3 align-top ${className}`
      }
      {...props}
    />
  );
}
