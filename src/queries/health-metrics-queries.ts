import { queryOptions } from '@tanstack/react-query'

import type { FromToDates } from '@/lib/health-metrics.functions'

import { getClientMetrics, getRecentClientMetrics } from '@/lib/health-metrics.functions'

export const getClientMetricsQueryOptions = () =>
  queryOptions({
    queryKey: ['client-health-metrics'],
    queryFn: getClientMetrics,
  })

export const getRecentClientMetricsQueryOptions = (dates: FromToDates) =>
  queryOptions({
    queryKey: ['recent-client-health-metrics', dates.from.toISOString(), dates.to.toISOString()],
    queryFn: async () => await getRecentClientMetrics({ data: dates }),
  })
