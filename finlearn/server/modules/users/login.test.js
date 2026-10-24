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

// AC2 (happy path): logging in with correct email and password → enters as that user
it('login: with correct credentials → responds 200, token and nickname', async () => {
  const register = await request(app)
    .post('/api/register')
    .send({ email: 'login-ok@email.com', nickname: 'loginny', password: 'login-pass' })
  expect(register.status).toBe(201) // sanity: the account exists before logging in

  const res = await request(app)
    .post('/api/login')
    .send({ email: 'login-ok@email.com', password: 'login-pass' })

  expect(res.status).toBe(200)
  expect(res.body.token).toBeTruthy()
  expect(res.body.user.nickname).toBe('loginny')
})
