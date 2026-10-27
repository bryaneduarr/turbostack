"use client";

import { ToastCard } from "@workspace/ui/components/toast/toast-card.component";
import {
  readToasts,
  subscribeToToasts,
} from "@workspace/ui/services/toast/toast-manager.service";
import type { ToastPosition } from "@workspace/ui/types/components/toast/toast-options.interface";
import type { ToastRecord } from "@workspace/ui/types/components/toast/toast-record.interface";
import type { ToasterProps } from "@workspace/ui/types/components/toast/toaster-props.interface";
import { useSyncExternalStore } from "react";

const noToasts: ToastRecord[] = [];

const stackClassNames = {
  "top-left": "top-4 left-4 flex-col-reverse",
  "top-center": "top-4 left-1/2 -translate-x-1/2 flex-col-reverse",
  "top-right": "top-4 right-4 flex-col-reverse",
  "middle-left": "top-1/2 left-4 -translate-y-1/2 flex-col",
  "middle-right": "top-1/2 right-4 -translate-y-1/2 flex-col",
  "bottom-left": "bottom-4 left-4 flex-col",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col",
  "bottom-right": "bottom-4 right-4 flex-col",
} satisfies Record<ToastPosition, string>;

const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function Toaster({ position }: ToasterProps) {
  const toasts = useSyncExternalStore(
    subscribeToToasts,
    readToasts,
    () => noToasts,
  );

  return (
    <section aria-label="Notifications">
      {positions.map((stackPosition) => {
        const stack = toasts.filter(
          (record) => (record.position ?? position) === stackPosition,
        );
        if (stack.length === 0) return null;

        return (
          <ol
            key={stackPosition}
            className={`pointer-events-none fixed z-50 flex w-[calc(100%-2rem)] max-w-sm ${stackClassNames[stackPosition]}`}
          >
            {stack.map((record) => (
              <ToastCard
                key={record.id}
                toast={record}
                position={stackPosition}
              />
            ))}
          </ol>
        );
      })}
    </section>
  );
}
