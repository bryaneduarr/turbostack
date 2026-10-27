"use client";

import { Button } from "@workspace/ui/components/button/button.component";
import { ErrorReference } from "@workspace/ui/components/feedback/error-reference/error-reference.component";
import {
  pauseToastTimers,
  resumeToastTimers,
  toast,
} from "@workspace/ui/services/toast/toast-manager.service";
import type { ToastCardProps } from "@workspace/ui/types/components/toast/toast-card-props.interface";
import type {
  ToastPosition,
  ToastType,
} from "@workspace/ui/types/components/toast/toast-options.interface";
import { useEffect, useState } from "react";

const iconClassNames = {
  default: "hidden",
  success: "icon-[lucide--circle-check] text-success",
  info: "icon-[lucide--info] text-info",
  warning: "icon-[lucide--triangle-alert] text-warning",
  error: "icon-[lucide--circle-x] text-destructive",
  loading: "icon-[lucide--loader-circle] animate-spin text-muted-foreground",
} satisfies Record<ToastType, string>;

const slideClassNames = {
  "top-left":
    "starting:-translate-x-full data-[status=closing]:-translate-x-full",
  "top-center":
    "starting:-translate-y-full data-[status=closing]:-translate-y-full",
  "top-right":
    "starting:translate-x-full data-[status=closing]:translate-x-full",
  "middle-left":
    "starting:-translate-x-full data-[status=closing]:-translate-x-full",
  "middle-right":
    "starting:translate-x-full data-[status=closing]:translate-x-full",
  "bottom-left":
    "starting:-translate-x-full data-[status=closing]:-translate-x-full",
  "bottom-center":
    "starting:translate-y-full data-[status=closing]:translate-y-full",
  "bottom-right":
    "starting:translate-x-full data-[status=closing]:translate-x-full",
} satisfies Record<ToastPosition, string>;

// The closing duration must match TOAST_EXIT_DURATION.
const transitionClassName =
  "grid grid-rows-[1fr] transition-[grid-template-rows,opacity,translate,scale] duration-300 ease-spring starting:grid-rows-[0fr] starting:scale-95 starting:opacity-0 data-[status=closing]:grid-rows-[0fr] data-[status=closing]:scale-95 data-[status=closing]:opacity-0 data-[status=closing]:duration-200 data-[status=closing]:ease-smooth motion-reduce:transition-none";

export function ToastCard({ toast: record, position }: ToastCardProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const holding = hovered || focused;

  useEffect(() => {
    if (!holding) return;
    pauseToastTimers();
    return resumeToastTimers;
  }, [holding]);

  return (
    <li
      data-status={record.status}
      className={`${transitionClassName} ${slideClassNames[position]}`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="p-1.5">
          <div
            role="status"
            aria-live={record.type === "error" ? "assertive" : "polite"}
            aria-atomic="true"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-background/95 p-4 text-sm shadow-lg backdrop-blur-md"
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <span
              aria-hidden="true"
              className={`mt-px size-4.5 shrink-0 ${iconClassNames[record.type]}`}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="font-medium">{record.title}</p>
              {record.description === undefined ? null : (
                <p className="text-muted-foreground">{record.description}</p>
              )}
              {record.reference === undefined ? null : (
                <ErrorReference reference={record.reference} tone="muted" />
              )}
            </div>
            {record.actionProps === undefined ? null : (
              <Button
                {...record.actionProps}
                variant="outline"
                size="small"
                type="button"
              />
            )}
            <button
              type="button"
              aria-label="Close notification"
              onClick={() => toast.close(record.id)}
              className="pressable -m-1 inline-flex shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span aria-hidden="true" className="icon-[lucide--x] size-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
