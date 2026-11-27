// drizzle-kit config. `generate` is offline (no dbCredentials needed): it diffs
// the schema models against the snapshot in drizzle/meta. Applying migrations
// happens at boot via settings/db.js (drizzle-orm migrator), not through the CLI.
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // One schema file per domain module; new modules are picked up automatically.
  schema: './modules/**/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
})
