import { mutationOptions, queryOptions } from '@tanstack/react-query'

import { getUserSettings, updateUserSettings } from '@/lib/settings.functions'

export const getUserSettingsQueryOptions = () =>
  queryOptions({
    queryKey: ['user-settings'],
    queryFn: getUserSettings,
  })

export const updateUserSettingsMutationOptions = () =>
  mutationOptions({
    mutationKey: ['user-settings', 'update'],
    mutationFn: async (input: Parameters<typeof updateUserSettings>[0]['data']) =>
      await updateUserSettings({ data: input }),
  })
