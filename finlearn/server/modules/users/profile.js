import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../../db.js'
import { users } from './schema.js'

const JWT_SECRET = process.env.JWT_SECRET

const SESSION_ERROR = 'Invalid or expired session'

export async function profile(req, res) {
  const [, token] = (req.headers.authorization ?? '').split(' ')
  let payload
  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({ message: SESSION_ERROR })
  }
  const [user] = await db
    .select({ id: users.id, email: users.email, nickname: users.nickname })
    .from(users)
    .where(eq(users.id, payload.sub))
  if (!user) {
    return res.status(401).json({ message: SESSION_ERROR })
  }
  res.status(200).json(user)
}
