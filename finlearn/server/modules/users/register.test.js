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

// AC3 (happy path): register with a new email, nickname and password → enters already authenticated
it('register: with a new email, nickname and password → responds 201, token and nickname', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ email: 'anna@example.com', nickname: 'anna', password: 'secret123' })

  expect(res.status).toBe(201)
  expect(res.body.user.nickname).toBe('anna')
  expect(res.body.token).toBeTruthy()
})

// AC3: registering with an email already used → sees a clear error message and does not stay authenticated
it('register: with an email already used → responds 409 with a message and no token', async () => {
  const first = await request(app)
    .post('/api/register')
    .send({ email: 'duplicate@example.com', nickname: 'first', password: 'password123' })
  expect(first.status).toBe(201) // sanity: the first registration succeeds

  const res = await request(app)
    .post('/api/register')
    .send({ email: 'duplicate@example.com', nickname: 'second', password: 'other-password' })

  expect(res.status).toBe(409)
  expect(res.body.message).toBeTruthy()
  expect(res.body.token).toBeUndefined()
})
