import type { ToastOptions } from "@workspace/ui/types/components/toast/toast-options.interface";

export const invalidFormToast = {
  type: "warning",
  title: "Check the highlighted fields",
  description: "Some values need changes before they can be sent.",
} satisfies ToastOptions;
