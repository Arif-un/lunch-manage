import { eq, sql } from 'drizzle-orm'
import { type NextRequest } from 'next/server'

import db from '@/src/lib/db/connection'
import MealPrices from '@/src/lib/db/schema/MealPrices'

export async function GET(request: NextRequest) {
  const mealPrices = await Promise.all([fetchAllMealPrices(), getMealPriceByDate(date)])
  // const getTodaysMealPrice =
  return Response.json({ mealPrices })
}

async function fetchAllMealPrices() {
  return db.select().from(MealPrices)
}

async function getMealPriceByDate(date: string) {
  const [todaysPrice] = await db
    .select({ price: MealPrices.price })
    .from(MealPrices)
    .where(eq(sql`date(${MealPrices.created_at})`, sql`date(${date})`))
    .limit(1)
    .execute()
}
