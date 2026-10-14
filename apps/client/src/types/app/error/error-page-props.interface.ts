/* Supplies the recovery action Next.js passes to a route error boundary. */
export interface ErrorPageProps {
  /* Re-renders the failed route segment to retry after an error. */
  reset: () => void;
}
