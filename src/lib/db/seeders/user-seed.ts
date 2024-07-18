// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker'
import { sql } from 'drizzle-orm'

import db from '../connection'
import Users from '../schema/Users'

/**
 *
 */
export async function createUsers() {
  const usersArr = new Array(10).fill({}).map(_ => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'asdasd',
    created_at: sql`(DATETIME('now', 'localtime'))`
  }))

  await db.insert(Users).values(usersArr)
}
