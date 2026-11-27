-- Migration 0000 is the baseline. It also runs against databases created
-- before drizzle-kit (the dev database's "users" table predates migrations),
-- so every statement is written to be re-runnable there: IF NOT EXISTS and a
-- conditional constraint rename instead of drizzle-kit's plain output.
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"nickname" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'player' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Pre-drizzle databases got the role column via a raw ALTER TABLE at boot.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'player' NOT NULL;

-- Those same databases carry Postgres' default constraint name
-- (users_email_key). Future drizzle-kit diffs name it users_email_unique, so
-- rename it here to keep them in sync. No-op on fresh databases.
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_key') THEN
		ALTER TABLE "users" RENAME CONSTRAINT "users_email_key" TO "users_email_unique";
	END IF;
END $$;
