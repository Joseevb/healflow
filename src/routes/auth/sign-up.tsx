import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: () => <Outlet />,
})
