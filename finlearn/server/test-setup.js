// Runs before test files, so the DB_NAME override is in place before db.js
// creates its pool. The test suite must never touch the developer's real DB.
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { Pool } from 'pg'

const envFile = fileURLToPath(new URL('../.env', import.meta.url))
if (existsSync(envFile)) {
  loadEnvFile(envFile)
}

const testDbName = `${process.env.DB_NAME}_test` // e.g. finlearn_test

// Create the test database if it does not exist, via a connection to the
// system "postgres" database instead of the real one.
const admin = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: 'postgres',
})
const existing = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [testDbName])
if (existing.rowCount === 0) {
  await admin.query(`CREATE DATABASE ${testDbName}`)
}
await admin.end()

process.env.DB_NAME = testDbName
