"use client";

import { Button } from "@workspace/ui/components/button/button.component";
import { FailureAlert } from "@workspace/ui/components/feedback/failure-alert/failure-alert.component";
import { TextField } from "@workspace/ui/components/text-field/text-field.component";
import { useClientFormValidation } from "@workspace/ui/hooks/forms/validation/use-client-form-validation.hook";
import { useActionToast } from "@workspace/ui/hooks/notifications/action-toasts/use-action-toast.hook";
import { useActionState } from "react";
import {
  describeUserProfileToast,
  saveUserProfileLoadingToast,
} from "@/services/users/profiles/form/describe-user-profile-toast.service";
import { parseUserProfileForm } from "@/services/users/profiles/form/parse-user-profile-form.service";
import type { UserProfileFormProps } from "@/types/users/profiles/form/user-profile-form.interface";

export function UserProfileForm({
  action,
  initialState,
  submitLabel,
}: UserProfileFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const validation = useClientFormValidation(parseUserProfileForm);
  useActionToast({
    pending,
    state,
    loading: saveUserProfileLoadingToast,
    describeResult: describeUserProfileToast,
  });
  const fieldErrors =
    validation.check.kind === "invalid"
      ? validation.check.state.fieldErrors
      : state.kind === "invalid"
        ? state.fieldErrors
        : { firstName: [], lastName: [] };

  return (
    <form
      action={formAction}
      onSubmit={validation.handleSubmit}
      onChange={validation.handleChange}
      noValidate
      className="flex w-full max-w-sm flex-col gap-3"
    >
      <TextField
        label="First name"
        name="firstName"
        type="text"
        autoComplete="given-name"
        defaultValue={state.values.firstName}
        errors={fieldErrors.firstName}
      />
      <TextField
        label="Last name"
        name="lastName"
        type="text"
        autoComplete="family-name"
        defaultValue={state.values.lastName}
        errors={fieldErrors.lastName}
      />
      <Button type="submit" variant="primary" size="medium" disabled={pending}>
        {submitLabel}
      </Button>
      <div role="status">
        {state.kind === "failed" ? (
          <FailureAlert message={state.message} reference={state.reference} />
        ) : null}
      </div>
    </form>
  );
}
