import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useSession } from '@tanstack/react-start/server'
import { Result, TaggedError } from 'better-result'
import * as z from 'zod'

import type { SerializableSignUpSession } from '@/schemas/auth'
import type { SignUpState } from '@/types/auth'

import { env } from '@/env/server'
import { safeSerialize } from '@/lib/result'
import { serializableSignUpSession } from '@/schemas/auth'
import { signUpState } from '@/types/auth'

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

  return session.data ?? {}
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

export const validateSignUpSession = createServerFn()
  .inputValidator(z.enum(signUpState))
  .handler(async ({ data: state }) => {
    const session = await getSignUpSession()

    const flowOrder: Array<SignUpState | undefined> = ['account', 'user-data', 'success']
    const currentIdx = flowOrder.indexOf(session.state)
    const expectedIdx = flowOrder.indexOf(state)

    // Can't go back to a previous step
    if (currentIdx > expectedIdx) {
      throw redirect({ to: '/auth/sign-up' })
    }

    // Step-specific guards
    if (state === 'user-data' && !session.accountData) {
      throw redirect({ to: '/auth/sign-up' })
    }

    return session
  })
