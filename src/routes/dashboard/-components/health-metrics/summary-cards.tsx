import type { HealthMetrics } from '@/db/types/health-metric.zod'

import { formatRelativeTime } from '@/lib/utils'
import { StatCard } from '@/routes/dashboard/-components/stat-card'

import { getMetricConfig } from './metric-config'

function getLatestMetricSummaries(metrics: Array<HealthMetrics>) {
  const latestByType = new Map<string, HealthMetrics>()

  for (const metric of metrics) {
    const existing = latestByType.get(metric.metricType)

    if (!existing || metric.createdAt.getTime() > existing.createdAt.getTime()) {
      latestByType.set(metric.metricType, metric)
    }
  }

  return Array.from(latestByType.values())
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
    .slice(0, 4)
}

export function HealthMetricSummaryCards({ metrics }: { metrics: Array<HealthMetrics> }) {
  const summaries = getLatestMetricSummaries(metrics)

  if (summaries.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summaries.map((metric) => {
        const config = getMetricConfig(metric.metricType)

        return (
          <StatCard
            key={metric.metricType}
            icon={config.icon}
            iconBg={config.iconBg}
            iconColor={config.iconColor}
            label={config.label}
            value={`${metric.value}`}
            sublabel={`${metric.unit} · ${formatRelativeTime(metric.createdAt.toISOString())}`}
          />
        )
      })}
    </div>
  )
}
