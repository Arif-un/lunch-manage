import { eq } from 'drizzle-orm'
import { type NextRequest } from 'next/server'

import { getSession } from '@/src/lib/auth'
import db from '@/src/lib/db/connection'
import users from '@/src/lib/db/schema/Users'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const unwrappedParams = await params;
    const userId = parseInt(unwrappedParams.userId, 10)

    // Get the current user's session
    const session = await getSession()
    const currentUserId = session?.id

    if (!currentUserId) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch the user to edit
    const userToEdit = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!userToEdit.length) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if current user is the user being edited or has admin role
    // First get current user to check their role
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUserId))
      .limit(1)

    if (!currentUser.length) {
      return Response.json(
        { error: 'Current user not found' },
        { status: 404 }
      )
    }

    const isAdmin = currentUser[0].role === 1
    const isSelfEdit = currentUserId === userId

    // Return the user data along with permission flags
    return Response.json({
      user: userToEdit[0],
      isAdmin,
      isSelfEdit
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return Response.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}