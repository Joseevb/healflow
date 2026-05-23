import { AlertTriangle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

import { HealthMetricsHeader } from './header'

export function HealthMetricsErrorState() {
  return (
    <div className="space-y-8">
      <HealthMetricsHeader />

      <Card className="border-red-200 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20">
        <CardContent className="flex flex-col items-center gap-5 px-8 py-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Unable to load health metrics</h2>
            <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground">
              Something went wrong while loading your health measurements. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
