ALTER TABLE "users_profile" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users_profile" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "users_profile_created_at_id_idx" ON "users_profile" USING btree ("created_at" DESC NULLS LAST,"id" DESC NULLS LAST);