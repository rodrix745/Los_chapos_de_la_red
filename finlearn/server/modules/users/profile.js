import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../../db.js'
import { users } from './schema.js'

const JWT_SECRET = process.env.JWT_SECRET

export async function profile(req, res) {
  const [, token] = (req.headers.authorization ?? '').split(' ')
  const payload = jwt.verify(token, JWT_SECRET)
  const [user] = await db
    .select({ id: users.id, email: users.email, nickname: users.nickname })
    .from(users)
    .where(eq(users.id, payload.sub))
  res.status(200).json(user)
}
