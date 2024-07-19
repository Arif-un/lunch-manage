'use server'

import { and, eq, sql } from 'drizzle-orm'

import db from '../lib/db/connection'
import Meals from '../lib/db/schema/Meals'
import Users from '../lib/db/schema/Users'
import users from '../lib/db/schema/Users'

/**
 *
 */
export async function fetchUsers(date: string) {
  try {
    const userResults = await db
      .select()
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

/**
 *
 * @param name
 * @param email
 * @param password
 */
export async function createUser(name: string, email: string, password: string) {
  try {
    db.insert(users).values({ name, email, password }).run()
  } catch (err) {
    if (err instanceof Error) console.error(err.stack)
  }
}
