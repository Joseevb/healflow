import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
    // TURSO_DATABASE_URL: z.string().min(1),
    // TURSO_AUTH_TOKEN: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().nonempty(),
    BETTER_AUTH_URL: z.string().url(),
    DB_FILE_NAME: z.string().nonempty().nonoptional(),

    GOOGLE_CLIENT_ID: z.string().nonempty().nonoptional(),
    GOOGLE_CLIENT_SECRET: z.string().nonempty().nonoptional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
