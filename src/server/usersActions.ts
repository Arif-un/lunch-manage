'use server'

import { and, eq, sql } from 'drizzle-orm'

import { getSession } from '../lib/auth'
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
    const existingUser = await db.select().from(Users).where(eq(Users.email, email)).limit(1)

    if (existingUser.length > 0) {
      throw new Error('Email already exists')
    }

    // Create the new user
    const result = await db
      .insert(Users)
      .values({
        name,
        email,
        password, // In a production app, the password should be hashed
        created_at: sql`(DATETIME('now', 'localtime'))`,
        updated_at: sql`(DATETIME('now', 'localtime'))`
      })
      .returning({ id: Users.id })

    if (!result.length) {
      throw new Error('Failed to create user')
    }

    return result[0]
  } catch (err) {
    console.error('Error creating user:', err)
    throw err
  }
}

/**
 * Updates a user in the database
 * @param userId The ID of the user to update
 * @param name The user's updated full name
 * @param email The user's updated email address
 * @param password The user's updated password (if provided)
 * @param status The user's updated status
 * @returns The updated user or throws an error
 */
export async function updateUser(
  userId: number,
  data: {
    name?: string
    email?: string
    password?: string
    status?: string
  }
) {
  try {
    // Get the current user's session to check permissions
    const session = await getSession()
    const currentUserId = session?.id

    if (!currentUserId) {
      throw new Error('Authentication required')
    }

    // First get the user to update for validation purposes
    const userToUpdate = await db.select().from(Users).where(eq(Users.id, userId)).limit(1)

    if (!userToUpdate.length) {
      throw new Error('User not found')
    }

    // Check if current user is the user being updated or has admin role (assuming role 1 is admin)
    // First get current user to check their role
    const currentUser = await db.select().from(Users).where(eq(Users.id, currentUserId)).limit(1)

    if (!currentUser.length) {
      throw new Error('Current user not found')
    }

    const isAdmin = currentUser[0].role === 1
    const isSelfUpdate = currentUserId === userId

    // If not admin and not updating self, deny permission
    if (!isAdmin && !isSelfUpdate) {
      throw new Error('Permission denied: You can only update your own account')
    }

    // Check if email already exists (if email is being updated)
    if (data.email && data.email !== userToUpdate[0].email) {
      const existingUser = await db.select().from(Users).where(eq(Users.email, data.email)).limit(1)

      if (existingUser.length > 0) {
        throw new Error('Email already exists')
      }
    }

    // Update the user
    const updateData: Record<string, any> = {
      updated_at: sql`(DATETIME('now', 'localtime'))`
    }

    // Only include fields that are provided
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.password) updateData.password = data.password // In production, hash the password
    if (isAdmin && data.status) updateData.status = data.status

    const result = await db.update(Users).set(updateData).where(eq(Users.id, userId)).returning()

    if (!result.length) {
      throw new Error('Failed to update user')
    }

    return result[0]
  } catch (err) {
    console.error('Error updating user:', err)
    throw err
  }
}

/**
 * Deletes a user from the database
 * @param userId The ID of the user to delete
 * @returns True if deletion was successful
 */
export async function deleteUser(userId: number) {
  try {
    // Delete the user
    const result = await db.delete(Users).where(eq(Users.id, userId)).returning({ id: Users.id })

    if (!result.length) {
      throw new Error('Failed to delete user')
    }

    return true
  } catch (err) {
    console.error('Error deleting user:', err)
    throw err
  }
}
