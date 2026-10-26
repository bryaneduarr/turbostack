import type { SupportReference } from "@workspace/schemas/support/errors/codes/support-reference.interface";
import type { ComponentProps } from "react";

/** Names the screen edge or corner where a toast appears and slides in from. */
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/** Names the kind of message, which selects the toast's status icon and color. */
export type ToastType =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "loading";

/** Describes the text and optional action a toast shows. */
export interface ToastContent {
  /** Contains the short headline that states what happened. */
  title: string;
  /** Adds supporting detail below the title. */
  description?: string;
  /** Identifies a failed request for support; only error toasts carry one. */
  reference?: SupportReference;
  /** Configures a button that lets the user respond to the message, such as undoing it. */
  actionProps?: ComponentProps<"button">;
}

/** Configures a toast when it is added or updated. */
export interface ToastOptions extends ToastContent {
  /** Selects the status icon and color; "default" shows no icon. */
  type?: ToastType;
  /** Overrides the Toaster's position for this toast only. */
  position?: ToastPosition;
  /** Sets how many milliseconds the toast stays open; 0 keeps it open until closed. */
  timeout?: number;
}
