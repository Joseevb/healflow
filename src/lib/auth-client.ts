import { stripeClient } from '@better-auth/stripe/client'
import { createAuthClient } from 'better-auth/client'
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'

import type { auth } from '@/lib/auth'

import { ac, admin, client, specialist } from '@/lib/permissions'

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: { admin, client, specialist },
    }),
    stripeClient({
      subscription: true,
    }),
    inferAdditionalFields<typeof auth>(),
  ],
})

export const { signUp, signIn, signOut, deleteUser, useSession } = authClient
