-- Baseline migration, hand-tuned to be re-runnable: it also runs against
-- databases whose "users" table predates drizzle-kit.
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"nickname" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'player' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'player' NOT NULL;

-- Legacy databases name the unique constraint users_email_key; rename it to
-- drizzle's naming so future diffs stay consistent.
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_key') THEN
		ALTER TABLE "users" RENAME CONSTRAINT "users_email_key" TO "users_email_unique";
	END IF;
END $$;
