/** Describes one host TCP port that a development service needs before it starts. */
export interface PortClaim {
  /** Holds the host port number the service binds. */
  readonly port: number;
  /** Names the service in the failure message for a busy port. */
  readonly service: string;
  /** Names the compose service that publishes this port, when this project's own container may hold it. */
  readonly composeService?: string;
}
