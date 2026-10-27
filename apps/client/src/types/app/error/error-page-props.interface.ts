/** Supplies the error details and recovery action Next.js passes to an error boundary. */
export interface ErrorPageProps {
  /** Carries the thrown error; its digest is the Next.js server error ID, absent for browser errors. */
  error: Error & { digest?: string };
  /** Re-renders the failed route segment to retry after an error. */
  reset: () => void;
}
