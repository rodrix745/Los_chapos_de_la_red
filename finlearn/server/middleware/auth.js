import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../settings/db.js'
import { users } from '../modules/users/schema.js'
import { JWT_SECRET } from '../settings/env.js'
import { ApiError } from './errors.js'

const SESSION_ERROR = 'Invalid or expired session'

export async function requireAuth(req, res, next) {
  const [, token] = (req.headers.authorization ?? '').split(' ')
  let payload
  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch {
    return next(new ApiError(401, SESSION_ERROR))
  }
  const [user] = await db
    .select({ id: users.id, email: users.email, nickname: users.nickname, role: users.role })
    .from(users)
    .where(eq(users.id, payload.sub))
  if (!user) {
    return next(new ApiError(401, SESSION_ERROR))
  }
  req.user = user
  next()
}

// The role comes from the DB on every request (not from token claims), so
// promoting or demoting applies without waiting for the token to expire.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to do that'))
    }
    next()
  }
}
