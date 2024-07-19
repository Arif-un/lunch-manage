/* eslint-disable prettier/prettier */
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import Users from './Users'
import Meals from './Meals'

const MealsLog = sqliteTable('meals_log', {
  id: integer('id').primaryKey(),
  type: text('type').notNull(),
  meal_id: integer('meal_id').notNull().references(()=> Meals.id),
  user_id: integer('user_id').notNull().references(() => Users.id),
  quantity: integer('quantity').notNull().default(1),
  amount: integer('amount').notNull().default(0),
  note: text('note'),
  created_by: integer('created_by').notNull().references(() => Users.id),
  updated_by: integer('updated_by').notNull().references(() => Users.id),
  created_at: integer('created_at', { mode: 'timestamp' }),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(DATETIME('now', 'localtime'))`)
})
export default MealsLog
