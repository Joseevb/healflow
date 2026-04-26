import type { auth } from '@/lib/auth'

export type BetterAuthUser = typeof auth.$Infer.Session.user

export type UpdateUserData = Partial<
  Omit<BetterAuthUser, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified'>
>

export type IsLoading = {
  loading: boolean
  type?: 'google' | 'apple' | 'email' | string
}

export type SocialSignOnProvider = {
  name: string
  imageUrl: string
  callbackUrl?: string
  onClick?: () => void
}
