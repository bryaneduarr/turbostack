/* Supplies the unvalidated route segment Next.js passes to the profile page. */
export interface ProfilePageProps {
  /* Resolves to the raw `[profileId]` segment, validated before use. */
  params: Promise<{ profileId: string }>;
}
