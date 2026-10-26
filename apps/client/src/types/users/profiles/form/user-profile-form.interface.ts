import type { UserProfileNamesInput } from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import type { SupportReference } from "@workspace/schemas/support/errors/codes/support-reference.interface";

/** Lists validation messages per profile field; an empty list means the field is valid. */
export interface UserProfileFormFieldErrors {
  /** Contains the messages for the given name. */
  firstName: string[];
  /** Contains the messages for the family name. */
  lastName: string[];
}

/** Represents the profile form after each submission, keeping the typed values for redisplay. */
export type UserProfileFormState =
  | { kind: "editing"; values: UserProfileNamesInput }
  | {
      kind: "invalid";
      values: UserProfileNamesInput;
      fieldErrors: UserProfileFormFieldErrors;
    }
  | {
      kind: "failed";
      values: UserProfileNamesInput;
      message: string;
      reference: SupportReference;
    }
  | { kind: "saved"; values: UserProfileNamesInput; message: string };

/** Handles one profile form submission and returns the next form state. */
export type UserProfileFormAction = (
  state: UserProfileFormState,
  formData: FormData,
) => Promise<UserProfileFormState>;

/** Configures the profile form for creating or editing a profile. */
export interface UserProfileFormProps {
  /** Submits the form through a Server Action. */
  action: UserProfileFormAction;
  /** Supplies the values shown before the first submission. */
  initialState: UserProfileFormState;
  /** Labels the submit button with the action it performs. */
  submitLabel: string;
}
