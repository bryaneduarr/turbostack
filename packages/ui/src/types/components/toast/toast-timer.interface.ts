/** Tracks the auto-close countdown of one toast so it can pause and resume. */
export interface ToastTimer {
  /** Holds the scheduled close while counting down; null while paused. */
  handle: ReturnType<typeof setTimeout> | null;
  /** Contains the milliseconds left when the countdown last started. */
  remaining: number;
  /** Records when the countdown last started, to subtract elapsed time on pause. */
  startedAt: number;
}
