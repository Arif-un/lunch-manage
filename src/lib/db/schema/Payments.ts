/* eslint-disable prettier/prettier */
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import users from './Users'

const Payments = sqliteTable('payments', {
  id: integer('id').primaryKey(),
  amount: integer('amount').notNull().default(0),
  paid_by: integer('paid_by').notNull().references(() => users.id),
  paid_to: integer('paid_to').notNull().references(() => users.id),
  note: text('note').default(''),
  created_by: integer('created_by').notNull().references(() => users.id),
  updated_by: integer('updated_by').notNull().references(() => users.id),
  created_at: integer('created_at', { mode: 'timestamp' }),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(DATETIME('now', 'localtime'))`)
})

export default Payments
