// Connection to PostgreSQL. The URL comes from DATABASE_URL; if it is not
// defined, we use the project's local convention.
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgres://postgres:postgres_password@localhost:5432/finlearn',
})

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      email text NOT NULL UNIQUE,
      nickname text NOT NULL,
      password text NOT NULL
    )
  `)
}
