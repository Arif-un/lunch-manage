import { and, eq, sql } from 'drizzle-orm'
import { type NextRequest } from 'next/server'

import { getSession } from '@/src/lib/auth'
import db from '@/src/lib/db/connection'
import MealPrices from '@/src/lib/db/schema/MealPrices'
import Meals from '@/src/lib/db/schema/Meals'
import MealsLog from '@/src/lib/db/schema/MealsLog'

interface Meal {
  amount: number
  id: number
  user_id: number
  created_at: Date | null
  updated_at: Date | null
  quantity: number
  note: string | null
  created_by: number
  updated_by: number
}

/**
 *
 * @param request
 * @param userId
 * @param userId.params
 * @param userId.params.userId
 */
export async function POST(
  request: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  const { status, date } = await request.json()
  const userIdForMeal = Number(userId)
  const { id: loginUserId } = (await getSession()) || {}

  if (Number.isNaN(userIdForMeal) || loginUserId === undefined) {
    return Response.json({ message: 'Invalid User ID or LoggedIn user ID' })
  }

  let amount = 0
  if (status === 'yes') {
    amount = await getMealPrice(date)
  }
  const existingMealRow = await findExistingMeal(userId, date)

  let isSuccess: boolean | undefined = true

  if (existingMealRow) {
    isSuccess = await updateExistingMeal(existingMealRow, amount, loginUserId)
  } else {
    isSuccess = await createNewMeal({ userId, amount, date, loginUserId })
  }

  return Response.json({ success: isSuccess, message: 'Meal Updated' })
}

async function createNewMeal({
  userId,
  amount,
  loginUserId
}: {
  userId: string
  amount: number
  date: string
  loginUserId: number
}) {
  const insertData = {
    user_id: Number(userId),
    amount,
    created_by: loginUserId,
    updated_by: loginUserId,
    created_at: sql`(DATETIME('now', 'localtime'))`
  }

  const [{ id }] = await db.insert(Meals).values(insertData).returning({ id: MealPrices.id })

  if (id === undefined) return

  const { changes } = await db.insert(MealsLog).values({
    ...insertData,
    type: 'create',
    meal_id: id
  })

  if (!changes) return

  return true
}

/**
 * Find existing meal for the user on the given date
 * @param userId user id
 * @param date date
 */
async function findExistingMeal(userId: string, date: string) {
  const [row] = await db
    .select()
    .from(Meals)
    .where(
      and(eq(Meals.user_id, Number(userId)), eq(sql`date(${Meals.created_at})`, sql`date(${date})`))
    )
    .execute()

  return row
}

async function updateExistingMeal(row: Meal, amount: number, loginUserId: number) {
  const { changes } = await db
    .update(Meals)
    .set({
      amount,
      updated_by: loginUserId
    })
    .where(eq(Meals.id, row.id))
    .execute()

  if (!changes) return

  const { changes: logChanges } = await db.insert(MealsLog).values({
    ...row,
    id: undefined, // default SQL value
    updated_at: undefined, // default SQL value
    type: 'update',
    meal_id: row.id,
    updated_by: loginUserId,
    created_by: loginUserId,
    created_at: sql`(DATETIME('now', 'localtime'))`
  })

  if (!logChanges) return

  return true
}

export async function getMealPrice(date: string) {
  const [todaysPrice] = await db
    .select({ price: Meals.amount })
    .from(Meals)
    .where(eq(sql`date(${Meals.created_at})`, sql`date(${date})`))
    .limit(1)
    .execute()

  if (todaysPrice?.price > 0) {
    return todaysPrice.price
  }

  // default price
  const [defaultPrice] = await db
    .select({ price: MealPrices.price })
    .from(MealPrices)
    .where(eq(MealPrices.is_default, 1))

  return defaultPrice.price
}
