import { defineConfig } from 'vitest/config'

// Tests share one database, so they must not run in parallel against it.
export default defineConfig({
  test: {
    fileParallelism: false,
  },
})
