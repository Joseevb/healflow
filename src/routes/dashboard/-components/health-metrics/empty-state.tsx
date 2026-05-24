import { ClipboardList } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

import { HealthMetricsHeader } from './header'

export function HealthMetricsEmptyState() {
  return (
    <div className="space-y-8">
      <HealthMetricsHeader />

      <Card className="border border-border/60 bg-card/95 shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 px-8 py-14 text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-green-100 dark:bg-green-900/20">
            <ClipboardList className="size-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">No health metrics yet</h2>
            <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground">
              Once you start recording health data like blood pressure, glucose, or steps, your
              latest measurements and trends will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
