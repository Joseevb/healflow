import { createAuthClient } from 'better-auth/client'
import { adminClient } from 'better-auth/client/plugins'

import { ac, admin, client, specialist } from '@/lib/permissions'

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: { admin, client, specialist },
    }),
  ],
})

export const { signUp, signIn, signOut, deleteUser, useSession } = authClient
