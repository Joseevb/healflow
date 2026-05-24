import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { HeroShell } from './hero-shell'

export function Loader() {
  return (
    <div className="space-y-8">
      <HeroShell>
        <div>
          <Skeleton className="mb-4 h-6 w-32 bg-background/55 dark:bg-white/12" />
          <Skeleton className="mb-2 h-9 w-64 bg-background/55 dark:bg-white/12" />
          <Skeleton className="mb-6 h-6 w-96 max-w-full bg-background/50 dark:bg-white/10" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-40 bg-background/60 dark:bg-white/14" />
            <Skeleton className="h-10 w-48 bg-background/45 dark:bg-white/10" />
          </div>
        </div>
      </HeroShell>

      {/* Stats Grid Skeleton */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick Actions Skeleton */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardHeader>
              <Skeleton className="mb-2 h-12 w-12 rounded-xl" />
              <Skeleton className="mb-2 h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Activity Skeleton */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Card className="border-0 shadow-md">
          <CardContent className="divide-y divide-slate-100 p-0 dark:divide-slate-700">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
