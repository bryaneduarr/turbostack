import { invalidFormToast } from "@workspace/ui/config/forms/validation/invalid-form-toast.config";
import type { ToastOptions } from "@workspace/ui/types/components/toast/toast-options.interface";
import type { UserProfileFormState } from "@/types/users/profiles/form/user-profile-form.interface";

export const saveUserProfileLoadingToast = {
  title: "Saving the profile",
  description: "This only takes a moment.",
} satisfies ToastOptions;

export function describeUserProfileToast(
  state: UserProfileFormState,
): ToastOptions | null {
  if (state.kind === "editing") return null;
  if (state.kind === "invalid") return invalidFormToast;
  if (state.kind === "saved") return { type: "success", title: state.message };
  return {
    type: "error",
    title: "The profile was not saved",
    description: state.message,
    reference: state.reference,
  };
}
