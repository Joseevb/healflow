import type { ColumnDef } from '@tanstack/react-table'

import { Activity, Calendar } from 'lucide-react'

import type { HealthMetrics } from '@/db/types/health-metric.zod'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import { getMetricConfig } from '@/routes/dashboard/-components/health-metrics/metric-config'

function MetricTypeCell({ metricType }: { metricType: string }) {
  const config = getMetricConfig(metricType)
  const Icon = config.icon

  return (
    <div className="flex items-center gap-3 py-1">
      <div
        className={`rounded-lg p-2.5 ring-1 ring-slate-200/50 dark:ring-slate-700/60 ${config.iconBg}`}
      >
        <Icon className={`size-4 ${config.iconColor}`} />
      </div>
      <span className="font-semibold text-slate-900 dark:text-slate-100">{config.label}</span>
    </div>
  )
}

const columns: Array<ColumnDef<HealthMetrics>> = [
  {
    accessorKey: 'metricType',
    header: () => (
      <span className="flex items-center gap-2">
        <Activity className="size-4 text-teal-600" />
        Metric
      </span>
    ),
    cell: ({ row }) => <MetricTypeCell metricType={row.original.metricType} />,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <Badge variant="secondary" size="sm" className="font-medium">
        {row.original.value} {row.original.unit}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => (
      <span className="flex items-center gap-2">
        <Calendar className="size-4 text-blue-600" />
        Recorded
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-slate-600 dark:text-slate-300">
        {row.original.createdAt.toLocaleDateString()}{' '}
        {row.original.createdAt.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    ),
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => (
      <span className="text-slate-500 dark:text-slate-400">{row.original.source || 'Manual'}</span>
    ),
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => (
      <span className="block max-w-56 truncate text-slate-500 dark:text-slate-400">
        {row.original.notes || 'No notes'}
      </span>
    ),
  },
]

export function HealthMetricsTable({ metrics }: { metrics: Array<HealthMetrics> }) {
  return (
    <Card className="overflow-hidden border border-border/60 bg-card/95 p-0 shadow-lg dark:shadow-slate-900/50">
      <CardHeader className="rounded-t-xl border-b border-border/60 bg-[linear-gradient(to_right,hsl(var(--card))_0%,hsl(var(--primary)/0.08)_45%,hsl(var(--card))_100%)] pt-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Activity className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Recent Measurements</CardTitle>
            <CardDescription>
              {metrics.length} records from the last{' '}
              {formatRelativeTime(
                metrics.at(-1)?.createdAt.toISOString() || new Date().toISOString(),
              ).replace(' ago', '')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable columns={columns} data={metrics} />
      </CardContent>
    </Card>
  )
}
