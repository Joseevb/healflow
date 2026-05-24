import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { toast } from 'sonner'

import type { SettingsFormInput } from '@/schemas/settings'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppForm } from '@/hooks/form'
import {
  getUserSettingsQueryOptions,
  updateUserSettingsMutationOptions,
} from '@/queries/settings-queries'
import { primaryCareSpecialistQueryOptions } from '@/queries/specialist-queries'

import { ProfileSummary } from './-components/settings/profile-summary'
import { SettingsForm, formOpts } from './-components/settings/settings-form'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getUserSettingsQueryOptions()),
      context.queryClient.ensureQueryData(primaryCareSpecialistQueryOptions),
    ])
  },
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { data: settings } = useSuspenseQuery(getUserSettingsQueryOptions())
  const { data: specialists } = useSuspenseQuery(primaryCareSpecialistQueryOptions)
  const defaultValues = {
    firstName: settings.profile.firstName,
    lastName: settings.profile.lastName,
    email: settings.account.email,
    phoneNumber: settings.profile.phoneNumber,
    birthDate: settings.profile.birthDate.toISOString().slice(0, 10),
    primaryCareSpecialist: settings.profile.primaryCareSpecialist ?? '',
    address: settings.address,
  } satisfies SettingsFormInput

  const updateSettingsMutation = useMutation({
    ...updateUserSettingsMutationOptions(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getUserSettingsQueryOptions().queryKey }),
        queryClient.invalidateQueries({ queryKey: primaryCareSpecialistQueryOptions.queryKey }),
      ])

      toast.success('Settings updated successfully.')
    },
    onError: (error) => {
      toast.error(error.message || 'Unable to update settings.')
    },
  })

  const form = useAppForm({
    ...formOpts,
    defaultValues,
    onSubmit: async ({ value }: { value: SettingsFormInput }) => {
      await updateSettingsMutation.mutateAsync(value)
    },
  })

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/20">
              <Settings className="size-5 text-blue-600" />
            </div>
            <h1 className="bg-linear-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:via-teal-400 dark:to-green-400">
              Settings
            </h1>
            <Badge variant="blue" size="sm">
              Account
            </Badge>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            Manage your personal details, primary care specialist, and account information.
          </p>
        </div>
      </header>

      <ProfileSummary
        name={settings.account.name}
        email={settings.account.email}
        role={settings.account.role}
        createdAt={settings.account.createdAt}
      />

      <Card className="border border-border/60 bg-card/95 shadow-lg">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Update your account details and the profile information used across your healthcare
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <SettingsForm
            form={form}
            specialists={specialists.map((specialist) => ({
              id: specialist.id,
              name: specialist.name,
            }))}
            isSpecialistsPending={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}
