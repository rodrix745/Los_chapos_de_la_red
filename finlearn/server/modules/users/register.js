import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../../settings/db.js'
import { users } from './schema.js'
import { fieldErrors } from './field-errors.js'

import { JWT_SECRET, ACCESS_TOKEN_LIFETIME } from '../../settings/env.js'

const registerSchema = z.object({
  email: z.email(),
  nickname: z.string(),
  password: z.string().min(8),
})

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: fieldErrors(parsed.error) })
  }
  const { email, nickname, password } = parsed.data
  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const [user] = await db
      .insert(users)
      .values({ email, nickname, password: passwordHash })
      .returning({ id: users.id, email: users.email, nickname: users.nickname, role: users.role })
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME })
    res.status(201).json({ token, user })
  } catch (err) {
    // Drizzle wraps the pg error, so the unique-violation code may sit in the cause.
    if (err.code === '23505' || err.cause?.code === '23505') {
      return res.status(409).json({ message: 'That email is already registered' })
    }
    throw err
  }
}
