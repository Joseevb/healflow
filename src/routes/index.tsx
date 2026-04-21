import { createFileRoute } from '@tanstack/react-router'

import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <Card className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </Card>
  )
}
