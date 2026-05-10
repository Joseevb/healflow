import type { AnyUseMutationOptions, AnyUseQueryOptions } from '@tanstack/react-query'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Activity } from 'react'

import type { UserData } from '@/schemas/auth'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAppForm } from '@/hooks/form'
import { getSpecialistByQuery } from '@/lib/specialists.functions'
import { UserDataForm, formOpts } from '@/routes/auth/-components/user-data-form'
import { getSignUpSession, updateSignUpSession } from '@/session/onboarding-session'

export const Route = createFileRoute('/auth/sign-up/user-data')({
  component: RouteComponent,
})

const getPrimaryCareSpecialistQuery = {
  queryKey: ['specialists', 'primary care'],
  queryFn: async () => {
    return await getSpecialistByQuery({
      data: {
        field: 'specialty',
        value: 'primary care',
      },
    })
  },
} satisfies AnyUseQueryOptions

const mutationOptions = {
  mutationKey: ['sign-up-user-data'],
  mutationFn: async ({ value }: { value: UserData }) => {
    const session = await getSignUpSession()

    await updateSignUpSession({
      data: {
        ...session,
        userData: value,
        state: 'user-data',
      },
    })
  },
} satisfies AnyUseMutationOptions

function RouteComponent() {
  const router = useRouter()

  const {
    data: specialists,
    isPending: specialistsIsPending,
    isError: specialistsIsError,
    error: specialistsFetchError,
  } = useSuspenseQuery(getPrimaryCareSpecialistQuery)

  const {
    mutateAsync,
    isError: isMutationError,
    error: mutationError,
  } = useMutation({
    ...mutationOptions,
    onSuccess: async () => await router.navigate({ to: '/auth/sign-up/payment' }),
  })

  const form = useAppForm({
    ...formOpts,

    onSubmit: mutateAsync,
  })

  return (
    <div className="container grid min-h-screen min-w-screen place-items-center">
      <Card className="relative w-full max-w-md [view-transition-name:auth-card] md:max-w-lg">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a New Account</CardDescription>
          <Separator className="mt-2" />
        </CardHeader>
        <CardContent>
          <Activity mode={specialistsIsError ? 'visible' : 'hidden'}>
            <Alert variant="destructive" className="my-5">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                An error occurred: {specialistsFetchError?.message}
              </AlertDescription>
            </Alert>
          </Activity>
          <Activity mode={isMutationError ? 'visible' : 'hidden'}>
            <Alert variant="destructive" className="my-5">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>An error occurred: {mutationError?.message}</AlertDescription>
            </Alert>
          </Activity>
          <UserDataForm
            form={form}
            specialists={specialists}
            isSpecialistLoading={specialistsIsPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
