'use server'

import { and, eq, sql } from 'drizzle-orm'

import db from '../lib/db/connection'
import Meals from '../lib/db/schema/Meals'
import Users from '../lib/db/schema/Users'

export async function fetchUsersWithMeals(date: string) {
  try {
    const userResults = await db
      .select({
        userId: Users.id,
        name: Users.name,
        mealPrice: Meals.amount,
        lastUpdatedBy: sql`(SELECT name FROM ${Users} WHERE id = ${Meals.updated_by})`,
        lastUpdatedAt: sql`datetime(${Meals.updated_at})`
      })
      .from(Users)
      .leftJoin(
        Meals,
        and(eq(Users.id, Meals.user_id), eq(sql`date(${Meals.created_at})`, sql`date(${date})`))
      )

    return userResults
  } catch (err) {
    if (err instanceof Error) console.error(err.stack)
  }
}

export async function fetchUsers() {
  try {
    return await db.select().from(Users)
  } catch (error) {
    console.error(error)
  }
}

/**
 *
 * @param name
 * @param email
 * @param password
 */
export async function createUser(name: string, email: string, password: string) {
  try {
    db.insert(Users).values({ name, email, password }).run()
  } catch (err) {
    if (err instanceof Error) console.error(err.stack)
  }
}
