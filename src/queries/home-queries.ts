import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { db } from '@/db'
import { users } from '@/db/schemas'

const getUsersServerFn = createServerFn().handler(async () => await db.select().from(users))

export const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: getUsersServerFn,
})
