'use server'

import db from '../lib/db/connection'
import users from '../lib/db/schema/users'

/**
 *
 */
export async function fetchUsers() {
  try {
    const userResults = await db.select().from(users)
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
    await db.insert(users).values({ name, email, password }).run()
  } catch (err) {
    if (err instanceof Error) console.error(err.stack)
  }
}
