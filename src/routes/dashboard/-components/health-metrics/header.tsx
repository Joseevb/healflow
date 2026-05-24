import { Activity } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

type HealthMetricsHeaderProps = {
  recordsCount?: number
}

export function HealthMetricsHeader({ recordsCount }: HealthMetricsHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-100 p-2 dark:bg-green-900/20">
            <Activity className="size-5 text-green-600" />
          </div>
          <h1 className="bg-linear-to-r from-green-600 via-teal-600 to-green-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-green-400 dark:via-teal-400 dark:to-green-500">
            Health Metrics
          </h1>
          {typeof recordsCount === 'number' ? (
            <Badge variant="success" size="sm">
              {recordsCount} Records
            </Badge>
          ) : null}
        </div>
        <p className="max-w-2xl text-muted-foreground">
          Track your vital signs, wellness trends, and recent measurements in one place.
        </p>
      </div>
    </header>
  )
}
