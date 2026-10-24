import { createApp } from "./app.js"
import { ensureSchema } from "./db.js"

const PORT = process.env.PORT ?? 8000

await ensureSchema()

const app = createApp()

app.listen(PORT, () => {
  console.log(`FinLearn backend escuchando en http://localhost:${PORT}`)
})
