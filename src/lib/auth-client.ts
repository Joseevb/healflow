import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient()

export const { signUp, signIn, signOut, useSession } = authClient
