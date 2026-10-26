/** Holds the database role and password that a stack check connects with. */
export interface DatabaseLogin {
  /** Names the PostgreSQL role. */
  readonly user: string;
  /** Holds the role's password from the environment file. */
  readonly password: string;
}
