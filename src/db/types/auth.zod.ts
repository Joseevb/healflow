// just select schemas
import type * as z from 'zod'

import { createSelectSchema } from 'drizzle-zod'

import { users } from '@/db/schemas'

export const selectUsersSchema = createSelectSchema(users)

export type User = z.infer<typeof selectUsersSchema>
