import { createServerFn } from '@tanstack/react-start'
import { Result } from 'better-result'
import { eq } from 'drizzle-orm'
import * as z from 'zod'

import type { UpdateUserData } from '@/types/auth'

import { db } from '@/db'
import { accounts, sessions, users } from '@/db/schemas'
import { authClient } from '@/lib/auth-client'
import { createRoleMiddleware } from '@/lib/auth.functions'
import { safeSerialize } from '@/lib/result'

export const softDeleteUserById = createServerFn()
  .inputValidator(z.string().nonempty().nonoptional())
  .middleware([createRoleMiddleware('admin')])
  .handler(async ({ data: userId }) => {
    const result = await Result.tryPromise(async () => {
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            name: 'Deleted User',
            email: `deleted_${userId}@deleted.invalid`,
            firstName: 'Deleted User',
            lastName: 'Deleted User',
            image: null,
            emailVerified: false,
            deletedAt: new Date(),
          })
          .where(eq(users.id, userId))

        await tx.delete(accounts).where(eq(accounts.userId, userId))
        await tx.delete(sessions).where(eq(sessions.userId, userId))
      })
    })

    return safeSerialize(result)
  })

export const updateUserById = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      userId: z.string().nonempty().nonoptional(),
      data: z.custom<UpdateUserData>(),
    }),
  )
  .middleware([createRoleMiddleware('admin')])
  .handler(async ({ data }) => {
    const { data: res, error } = await authClient.admin.updateUser(data)

    if (error) {
      return safeSerialize(Result.err({ message: error.message }))
    }

    return safeSerialize(Result.ok(res))
  })
