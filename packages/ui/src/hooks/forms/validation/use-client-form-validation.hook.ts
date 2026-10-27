import { invalidFormToast } from "@workspace/ui/config/forms/validation/invalid-form-toast.config";
import { toast } from "@workspace/ui/services/toast/toast-manager.service";
import type {
  ClientFormCheck,
  ClientFormValidation,
} from "@workspace/ui/types/hooks/forms/validation/client-form-validation.interface";
import { type ChangeEvent, type SubmitEvent, useRef, useState } from "react";

export function useClientFormValidation<FieldErrors>(
  validate: (formData: FormData) => ClientFormCheck<FieldErrors>,
): ClientFormValidation<FieldErrors> {
  const [check, setCheck] = useState<ClientFormCheck<FieldErrors>>({
    kind: "valid",
  });
  const invalidToastId = useRef<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    // The pressed button's name and value are part of what the form submits.
    const result = validate(
      new FormData(event.currentTarget, event.nativeEvent.submitter),
    );
    setCheck(result);
    if (invalidToastId.current !== null) toast.close(invalidToastId.current);
    invalidToastId.current = null;
    if (result.kind === "valid") return;
    event.preventDefault();
    invalidToastId.current = toast.add(invalidFormToast);
  }

  function handleChange(event: ChangeEvent<HTMLFormElement>) {
    if (check.kind === "valid") return;
    setCheck(validate(new FormData(event.currentTarget)));
  }

  return { check, handleSubmit, handleChange };
}
