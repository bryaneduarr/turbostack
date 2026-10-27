/** Names the database role a connection authenticates as and its password. */
export interface DatabaseRoleLogin {
  /** Identifies the PostgreSQL role. */
  user: string;
  /** Contains the role's password without transformation. */
  password: string;
}
