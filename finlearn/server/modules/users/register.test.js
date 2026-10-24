import { beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../../app.js'
import { pool, ensureSchema } from '../../db.js'

const app = createApp()

beforeAll(async () => {
  await ensureSchema()
  await pool.query('DELETE FROM users')
})

afterAll(async () => {
  await pool.end()
})

// AC3 (lado feliz): registro con email nuevo, apodo y contraseña → entra autenticado
it('registro: con email nuevo, apodo y contraseña → responde 201, token y apodo', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ email: 'ana@example.com', nickname: 'ana', password: 'secreto123' })

  expect(res.status).toBe(201)
  expect(res.body.user.nickname).toBe('ana')
  expect(res.body.token).toBeTruthy()
})
