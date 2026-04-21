import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'
import { env } from '@/env/server'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas',
  dialect: 'turso',
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
})
