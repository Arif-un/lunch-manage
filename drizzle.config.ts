import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/db/schema/*',
  dbCredentials: {
    url: './src/lib/db/sqlite.db'
  }
})
