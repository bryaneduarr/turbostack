import type {
  UserProfileNames,
  UserProfileNamesInput,
} from "@workspace/schemas/server/routes/users/profiles/user-profile.interface";
import type { UserProfileFormState } from "@/types/users/profiles/form/user-profile-form.interface";

/* Represents submitted profile form data, either validated names or the invalid form state to show. */
export type ParsedUserProfileForm =
  | { kind: "valid"; values: UserProfileNamesInput; names: UserProfileNames }
  | {
      kind: "invalid";
      state: Extract<UserProfileFormState, { kind: "invalid" }>;
    };
