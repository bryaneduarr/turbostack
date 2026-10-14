"use client";

import { Button } from "@workspace/ui/components/button/button.component";
import { TextField } from "@workspace/ui/components/text-field/text-field.component";
import { useActionState } from "react";
import type { UserProfileFormProps } from "@/types/users/profiles/form/user-profile-form.interface";

export function UserProfileForm({
  action,
  initialState,
  submitLabel,
}: UserProfileFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldErrors =
    state.kind === "invalid"
      ? state.fieldErrors
      : { firstName: [], lastName: [] };

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-3">
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
      {state.kind === "failed" ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}
      {state.kind === "saved" ? (
        <p className="text-sm text-success">{state.message}</p>
      ) : null}
    </form>
  );
}
