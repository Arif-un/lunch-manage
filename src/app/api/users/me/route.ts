import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { getSession } from '@/src/lib/auth'
import db from '@/src/lib/db/connection'
import users from '@/src/lib/db/schema/Users'

export async function GET() {
  try {
    const session = await getSession()

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const currentUser = await db.select().from(users).where(eq(users.id, session.id)).limit(1)

    if (!currentUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: currentUser[0] })
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json({ error: 'An error occurred while fetching user data' }, { status: 500 })
  }
}
