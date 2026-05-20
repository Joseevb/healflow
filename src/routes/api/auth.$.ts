import { createFileRoute } from '@tanstack/react-router'

import { auth } from '@/lib/auth'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        try {
          return await auth.handler(request)
        } catch (err) {
          console.error('[AUTH API] GET error:', err)
          throw err
        }
      },
      POST: async ({ request }: { request: Request }) => {
        try {
          return await auth.handler(request)
        } catch (err) {
          console.error('[AUTH API] POST error:', err)
          throw err
        }
      },
    },
  },
})
