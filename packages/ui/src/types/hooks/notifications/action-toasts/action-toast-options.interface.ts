import type { ToastOptions } from "@workspace/ui/types/components/toast/toast-options.interface";

/** Connects a form action's progress and result to one toast. */
export interface ActionToastOptions<State> {
  /** Reports whether the action is running, which shows the loading toast. */
  pending: boolean;
  /** Contains the latest state the action returned. */
  state: State;
  /** Describes the loading toast; must be a stable module constant. */
  loading: ToastOptions;
  /** Turns a returned state into the toast that replaces the loading one, or null to close it. */
  describeResult: (state: State) => ToastOptions | null;
}
