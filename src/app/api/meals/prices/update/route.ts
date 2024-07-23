import { and, eq, gt, sql } from 'drizzle-orm'
import { type NextRequest } from 'next/server'

import { getSession } from '@/src/lib/auth'
import db from '@/src/lib/db/connection'
import MealPrices from '@/src/lib/db/schema/MealPrices'
import Meals from '@/src/lib/db/schema/Meals'
import MealsLog from '@/src/lib/db/schema/MealsLog'

export async function POST(request: NextRequest) {
  const [{ newPrice, date, note, label, isCustomPrice }, session] = await Promise.all([
    request.json(),
    getSession()
  ])

  const { id: loginUserId } = session || {}

  if (!date || loginUserId === undefined || newPrice === undefined) {
    return Response.json({ success: false, message: 'Invalid Date or LoggedIn user ID' })
  }

  if (!isCustomPrice) {
    const priceUpdateResult = await createCustomPrice({
      newPrice,
      loginUserId,
      label,
      note
    })

    if (!priceUpdateResult.success) {
      return Response.json({ ...priceUpdateResult })
    }
  }

  const mealsPriceUpdateResult = await updateMealsPrices(newPrice, loginUserId, date)

  return Response.json({ ...mealsPriceUpdateResult })
}

interface CreateCustomPriceParams {
  newPrice: number
  loginUserId: number
  note?: string
  label?: string
}

async function createCustomPrice({ newPrice, loginUserId, note, label }: CreateCustomPriceParams) {
  // create a price
  const { changes: insertChanges } = await db.insert(MealPrices).values({
    price: newPrice,
    label,
    description: note,
    created_by: loginUserId,
    updated_by: loginUserId,
    created_at: sql`(DATETIME('now', 'localtime'))`
  })

  if (!insertChanges) return { success: false, message: 'error while inserting new row' }

  return { success: true, message: 'Price updated successfully' }
}

async function updateMealsPrices(newPrice: number, loginUserId: number, date: string) {
  const updatedMealRows = await db
    .update(Meals)
    .set({
      amount: newPrice,
      updated_by: loginUserId
    })
    .where(and(eq(sql`date(${Meals.created_at})`, sql`date(${date})`), gt(Meals.amount, 0)))
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

  return { success: true, message: 'meals price updated successfully' }
}
