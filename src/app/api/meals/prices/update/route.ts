import { and, eq, not, sql } from 'drizzle-orm'
import { type NextRequest } from 'next/server'

import { getSession } from '@/src/lib/auth'
import db from '@/src/lib/db/connection'
import MealPrices from '@/src/lib/db/schema/MealPrices'
import Meals from '@/src/lib/db/schema/Meals'
import MealsLog from '@/src/lib/db/schema/MealsLog'

export async function POST(request: NextRequest) {
  const [{ newPrice, date, note }, session] = await Promise.all([request.json(), getSession()])
  const { id: loginUserId } = session || {}

  if (!date || loginUserId === undefined || newPrice === undefined) {
    return Response.json({ message: 'Invalid Date or LoggedIn user ID' })
  }

  const result = await createOrUpdatePrice(date, newPrice, loginUserId, note)

  return Response.json({ ...result })
}

async function createOrUpdatePrice(date: string, newPrice: number, loginUserId: number, note?: string) {
  const [existingRow] = await db
    .select()
    .from(MealPrices)
    .where(
      and(eq(sql`date(${MealPrices.created_at})`, sql`date(${date})`), not(eq(MealPrices.is_default, 1)))
    )
    .execute()

  if (existingRow) {
    const { changes } = await db
      .update(MealPrices)
      .set({
        price: newPrice,
        updated_by: loginUserId
      })
      .where(eq(MealPrices.id, existingRow.id))
      .execute()

    if (!changes) return { success: false, message: 'error while updating existing row' }
  }

  if (!existingRow) {
    const { changes: insertChanges } = await db.insert(MealPrices).values({
      price: newPrice,
      description: note,
      created_by: loginUserId,
      updated_by: loginUserId,
      created_at: sql`(DATETIME('now', 'localtime'))`
    })

    if (!insertChanges) return { success: false, message: 'error while inserting new row' }
  }

  const updatedMealRows = await db
    .update(Meals)
    .set({
      amount: newPrice,
      updated_by: loginUserId
    })
    .where(eq(sql`date(${Meals.created_at})`, sql`date(${date})`))
    .returning()

  if (!updatedMealRows.length)
    return { success: false, message: 'can not update meals price while price update' }

  const { changes: logUpdateChange } = await db
    .insert(MealsLog)
    .values(
      updatedMealRows.map(row => ({
        ...row,
        id: undefined, // for default db inc id
        meal_id: row.id,
        type: 'update'
      }))
    )
    .execute()

  if (!logUpdateChange) return { success: false, message: 'error while updating logs' }

  return { success: true, message: 'Price updated successfully' }
}
