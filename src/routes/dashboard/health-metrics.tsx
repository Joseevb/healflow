import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { subDays } from 'date-fns'

import { getRecentClientMetricsQueryOptions } from '@/queries/health-metrics-queries'
import { getClientLatestHealthScoreQueryOptions } from '@/queries/health-score-queries'

import { HealthMetricsEmptyState } from './-components/health-metrics/empty-state'
import { HealthMetricsErrorState } from './-components/health-metrics/error-state'
import { HealthMetricsHeader } from './-components/health-metrics/header'
import { HealthMetricsLoader } from './-components/health-metrics/loader'
import { HealthMetricsTable } from './-components/health-metrics/metrics-table'
import { HealthScoreCard } from './-components/health-metrics/score-card'
import { HealthMetricSummaryCards } from './-components/health-metrics/summary-cards'

export const Route = createFileRoute('/dashboard/health-metrics')({
  component: RouteComponent,
  pendingComponent: HealthMetricsLoader,
  errorComponent: HealthMetricsErrorState,
  loader: async ({ context }) => {
    const recentMetricsTo = new Date()
    const recentMetricsFrom = subDays(recentMetricsTo, 90)

    await Promise.all([
      context.queryClient.ensureQueryData(getClientLatestHealthScoreQueryOptions()),
      context.queryClient.ensureQueryData(
        getRecentClientMetricsQueryOptions({
          from: recentMetricsFrom,
          to: recentMetricsTo,
        }),
      ),
    ])

    return {
      recentMetricsFrom: recentMetricsFrom.toISOString(),
      recentMetricsTo: recentMetricsTo.toISOString(),
    }
  },
})

function RouteComponent() {
  const { recentMetricsFrom, recentMetricsTo } = Route.useLoaderData()

  const recentRange = {
    from: new Date(recentMetricsFrom),
    to: new Date(recentMetricsTo),
  }

  const { data: recentMetrics } = useSuspenseQuery(getRecentClientMetricsQueryOptions(recentRange))
  const { data: healthScore } = useSuspenseQuery(getClientLatestHealthScoreQueryOptions())

  if (recentMetrics.length === 0) {
    return <HealthMetricsEmptyState />
  }

  return (
    <div className="space-y-8">
      <HealthMetricsHeader recordsCount={recentMetrics.length} />
      {healthScore ? <HealthScoreCard score={healthScore} /> : null}
      <HealthMetricSummaryCards metrics={recentMetrics} />
      <HealthMetricsTable metrics={recentMetrics} />
    </div>
  )
}
