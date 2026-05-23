import { Activity } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

import { HealthMetricsHeader } from './header'

export function HealthMetricsLoader() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <HealthMetricsHeader />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-28 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-28 rounded-xl" />
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card/95 shadow-lg">
        <div className="flex items-center gap-3 border-b border-border/60 px-6 py-6">
          <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
            <Activity className="size-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4 p-6">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-12 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
