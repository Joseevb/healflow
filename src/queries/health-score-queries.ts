import { queryOptions } from '@tanstack/react-query'

import { getClientLatestHealthScore } from '@/lib/health-score.functions'

export const getClientLatestHealthScoreQueryOptions = () =>
  queryOptions({
    queryKey: ['latest-query-options'],
    queryFn: getClientLatestHealthScore,
  })
