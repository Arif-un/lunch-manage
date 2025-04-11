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
 * Creates a new user in the database
 * @param name The user's full name
 * @param email The user's email address (must be unique)
 * @param password The user's password
 * @returns The created user or throws an error
 */
export async function createUser(name: string, email: string, password: string) {
  try {
    // Check if email already exists
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      throw new Error('Email already exists')
    }

    // Create the new user
    const result = await db.insert(Users).values({
      name,
      email,
      password, // In a production app, the password should be hashed
      created_at: sql`(DATETIME('now', 'localtime'))`,
      updated_at: sql`(DATETIME('now', 'localtime'))`
    }).returning({ id: Users.id })

    if (!result.length) {
      throw new Error('Failed to create user')
    }

    return result[0]
  } catch (err) {
    console.error('Error creating user:', err)
    throw err
  }
}
