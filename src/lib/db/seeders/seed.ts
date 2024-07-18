import { createUsers } from './user-seed'

/**
 *
 */
async function seeder() {
  await Promise.all([createUsers()])
}

seeder()
