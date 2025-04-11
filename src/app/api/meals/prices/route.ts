import { type NextRequest } from 'next/server'

import db from '@/src/lib/db/connection'
import MealPrices from '@/src/lib/db/schema/MealPrices'

export async function GET(_request: NextRequest) {
  const prices = await db.select().from(MealPrices)

  return Response.json({ success: true, prices })
}
