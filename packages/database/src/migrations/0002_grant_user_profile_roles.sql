-- The API reads, creates, and renames profiles; the operator role only reads.
GRANT SELECT, INSERT, UPDATE ("first_name", "last_name", "updated_at") ON TABLE "users_profile" TO app_runtime;
--> statement-breakpoint
GRANT SELECT ON TABLE "users_profile" TO app_cli;
