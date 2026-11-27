import { createApp } from "./app.js"
import { migrateToLatest } from "./settings/db.js"
import { env } from "./settings/env.js"

await migrateToLatest()

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`FinLearn backend listening on http://localhost:${env.PORT}`)
})
