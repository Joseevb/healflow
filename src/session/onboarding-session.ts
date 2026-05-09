import { createServerFn } from '@tanstack/react-start'
import { useSession } from '@tanstack/react-start/server'
import { Result, TaggedError } from 'better-result'

import type { SerializableSignUpSession } from '@/schemas/auth'

import { env } from '@/env/server'
import { safeSerialize } from '@/lib/result'
import { serializableSignUpSession } from '@/schemas/auth'

export class OnboardingSessionError extends TaggedError('OnboardingSessionError')<{
  message?: string
}>() {}

// Get session data (serializable)
export const getSignUpSession = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useSession<SerializableSignUpSession>({
    name: 'signup-session',
    password: env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
    },
  })

  return session.data
})

// Update session data
export const updateSignUpSession = createServerFn({ method: 'POST' })
  .inputValidator(serializableSignUpSession)
  .handler(async ({ data }) =>
    Result.tryPromise({
      try: async () => {
        const session = await useSession<SerializableSignUpSession>({
          name: 'signup-session',
          password: env.SESSION_SECRET,
          cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: env.NODE_ENV === 'production',
          },
        })
        await session.update(data)
      },
      catch: (error) =>
        new OnboardingSessionError({
          message: error instanceof Error ? error.message : String(error),
        }),
    }).then(safeSerialize),
  )

// Clear session
export const clearSignUpSession = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useSession<SerializableSignUpSession>({
    name: 'signup-session',
    password: env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
    },
  })

  await session.clear()
  return { success: true }
})
