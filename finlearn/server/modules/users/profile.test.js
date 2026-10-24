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

// AC2: session persists — with the login/register token the app knows who you are
it('session: with the login token, GET /api/me returns the nickname', async () => {
  const register = await request(app)
    .post('/api/register')
    .send({ email: 'me@email.com', nickname: 'mey', password: 'me-password' })
  expect(register.status).toBe(201) // sanity: the account exists before using the token

  const res = await request(app)
    .get('/api/me')
    .set('Authorization', `Bearer ${register.body.token}`)

  expect(res.status).toBe(200)
  expect(res.body.nickname).toBe('mey')
})
