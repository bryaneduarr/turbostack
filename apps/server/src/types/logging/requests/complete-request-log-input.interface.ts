/** Supplies the final HTTP metadata needed to complete a request log. */
export interface CompleteRequestLogInput {
  /** Identifies the request whose log is completed at most once. */
  request: Request;
  /** Contains the final HTTP response status used to select log severity. */
  status: number;
  /** Contains the matched route pattern or the explicit unmatched-route label. */
  route: string;
}
