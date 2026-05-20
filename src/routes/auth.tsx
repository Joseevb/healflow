import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { getSession } from '@/lib/auth.functions'

export const Route = createFileRoute('/auth')({
  component: () => <Outlet />,
  beforeLoad: async ({ location }) => {
    // Onboarding sub-routes (social-callback, sign-up/user-data, payment)
    // need to be accessible to authenticated users who haven't completed onboarding
    if (location.pathname !== '/auth' && location.pathname !== '/auth/sign-up') return

    const session = await getSession()

    if (session) throw redirect({ to: '/dashboard' })
  },
})
