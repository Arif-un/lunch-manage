import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

import { getSession } from '@/src/lib/auth'
import db from '@/src/lib/db/connection'
import users from '@/src/lib/db/schema/Users'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get the current user's session
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch the user data
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1)

    if (!currentUser.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return the user data
    return NextResponse.json({ user: currentUser[0] })
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching user data' },
      { status: 500 }
    )
  }
}