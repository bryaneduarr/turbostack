/** Represents the two parts of a file name that follows the role pattern. */
export interface FileRole {
  /** Contains the kebab-case responsibility before the role. */
  name: string;
  /** Contains the singular role suffix, such as service or interface. */
  role: string;
}
