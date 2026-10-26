import { usersProfile } from "@workspace/database/tables/users/profile/user-profile.table";
import { client, db } from "@/config/database/database-connection.config";

const exampleProfiles = [
  { firstName: "Alex", lastName: "Example" },
  { firstName: "Sam", lastName: "Example" },
];

try {
  const existingProfiles = await db
    .select({ id: usersProfile.id })
    .from(usersProfile)
    .limit(1);
  if (existingProfiles.length > 0) {
    console.info("seed:dev kept the existing profiles.");
  } else {
    await db.insert(usersProfile).values(exampleProfiles);
    console.info(`seed:dev added ${exampleProfiles.length} example profiles.`);
  }
} catch (error) {
  console.error("seed:dev failed.", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
