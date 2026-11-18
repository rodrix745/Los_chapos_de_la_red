import { beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../../app.js'
import { pool, ensureSchema } from '../../settings/db.js'

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

// AC3: logging in with wrong data → sees a clear error message and does not stay authenticated
it('login: with wrong email or password → responds 401 with a message and no token', async () => {
  const wrongPassword = await request(app)
    .post('/api/login')
    .send({ email: 'login-ok@email.com', password: 'wrong-pass' })

  expect(wrongPassword.status).toBe(401)
  expect(wrongPassword.body.message).toBeTruthy()
  expect(wrongPassword.body.token).toBeUndefined()

  const wrongEmail = await request(app)
    .post('/api/login')
    .send({ email: 'ghost@email.com', password: 'login-pass' })

  expect(wrongEmail.status).toBe(401)
  expect(wrongEmail.body.message).toBeTruthy()
  expect(wrongEmail.body.token).toBeUndefined()
})

// Plan: login validates required fields before checking credentials
it('login: with a missing field → responds 400 with a field error', async () => {
  const res = await request(app)
    .post('/api/login')
    .send({})

  expect(res.status).toBe(400)
  expect(res.body.errors.email).toBeTruthy()
  expect(res.body.errors.password).toBeTruthy()
  expect(res.body.token).toBeUndefined()
})
