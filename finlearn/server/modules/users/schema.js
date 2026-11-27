import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  nickname: text('nickname').notNull(),
  password: text('password').notNull(),
  // 'player' (default) or 'admin'; no self-service promotion.
  role: text('role').notNull().default('player'),
})
