import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../../db.js'
import { users } from './schema.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export async function login(req, res) {
  const { email, password } = req.body
  const [user] = await db.select().from(users).where(eq(users.email, email))
  const passwordMatches = user
    ? await bcrypt.compare(password, user.password)
    : false
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Wrong email or password' })
  }
  const token = jwt.sign({ sub: user.id }, JWT_SECRET)
  res.status(200).json({
    token,
    user: { id: user.id, email: user.email, nickname: user.nickname },
  })
}
