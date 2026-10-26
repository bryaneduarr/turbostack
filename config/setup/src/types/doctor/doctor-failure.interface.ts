/** Describes one problem that blocks the development stack and the single fix for it. */
export interface DoctorFailure {
  /** Names the problem in a few words. */
  readonly summary: string;
  /** Explains why the problem blocks startup, as a clause without a final period. */
  readonly reason: string;
  /** Holds the one command or instruction that resolves the problem. */
  readonly fix: string;
}

/** Runs one doctor check and returns every problem it finds. */
export type DoctorCheck = () => Promise<readonly DoctorFailure[]>;
