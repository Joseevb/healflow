import { queryOptions } from '@tanstack/react-query'

import { getClientMedicines } from '@/lib/medicines.functions'

export const getClientMedicinesQueryOptions = () =>
  queryOptions({
    queryKey: ['client-medicines'],
    queryFn: getClientMedicines,
  })
