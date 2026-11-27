import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../../settings/db.js'
import { users } from './schema.js'
import { fieldErrors } from './field-errors.js'
import { ApiError } from '../../middleware/errors.js'

import { JWT_SECRET, ACCESS_TOKEN_LIFETIME } from '../../settings/env.js'

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
})

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: fieldErrors(parsed.error) })
  }
  const { email, password } = parsed.data
  const [user] = await db.select().from(users).where(eq(users.email, email))
  const passwordMatches = user
    ? await bcrypt.compare(password, user.password)
    : false
  if (!passwordMatches) {
    throw new ApiError(401, 'Wrong email or password')
  }
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME })
  res.status(200).json({
    token,
    user: { id: user.id, email: user.email, nickname: user.nickname, role: user.role },
  })
}
