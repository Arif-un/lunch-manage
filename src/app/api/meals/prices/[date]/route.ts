import { eq, sql } from 'drizzle-orm'
import { type NextRequest } from 'next/server'

import db from '@/src/lib/db/connection'
import MealPrices from '@/src/lib/db/schema/MealPrices'

export async function GET(request: NextRequest, { params: { date } }: { params: { date: string } }) {
  const [mealPrices, priceByDate] = await Promise.all([fetchAllMealPrices(), getMealPriceByDate(date)])
  // console.log(date)
  // console.log('==== ~ mealPrices, priceByDate:', mealPrices, priceByDate)
  // const getTodaysMealPrice =
  return Response.json({ success: true, mealPrices, priceByDate })
}

async function fetchAllMealPrices() {
  return db.select().from(MealPrices)
}

async function getMealPriceByDate(date: string) {
  const [priceByDate] = await db
    .select({
      price: MealPrices.price,
      id: MealPrices.id,
      createdAt: sql`date(${MealPrices.created_at})`
    })
    .from(MealPrices)
    .where(eq(sql`date(${MealPrices.created_at})`, sql`date(${date})`))
    .limit(1)
    .execute()

  return priceByDate
}
