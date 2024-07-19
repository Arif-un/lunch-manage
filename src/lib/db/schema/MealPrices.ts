/* eslint-disable prettier/prettier */
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import Users from './Users'

const MealPrices = sqliteTable('meal_prices', {
  id: integer('id').primaryKey(),
  label: text('label'),
  price: integer('price').notNull().default(0),
  description: text('description'),
  is_default: integer('is_default'),
  created_by: integer('created_by').notNull().references(() => Users.id),
  updated_by: integer('updated_by').notNull().references(() => Users.id),
  created_at: integer('created_at', { mode: 'timestamp' }),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(DATETIME('now', 'localtime'))`)
})

export default MealPrices
