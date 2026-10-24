import { defineConfig } from 'vitest/config'

// Tests share one database, so they must not run in parallel against it.
// test-setup.js points the tests at a separate <DB_NAME>_test database.
export default defineConfig({
  test: {
    fileParallelism: false,
    setupFiles: ['./test-setup.js'],
  },
})
