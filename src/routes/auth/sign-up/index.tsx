import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Activity } from 'react'

import type { SignUp } from '@/schemas/auth'

import SocialSignOn from '@/components/social-sign-on'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAppForm } from '@/hooks/form'
import { signUpMutationOptions } from '@/queries/auth-queries'
import { formOpts, SignUpForm } from '@/routes/auth/-components/sign-up-form'

export const Route = createFileRoute('/auth/sign-up/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  const { mutateAsync, isError, error } = useMutation<void, Error, { value: SignUp }>({
    ...signUpMutationOptions,
    onSuccess: async () => await router.navigate({ to: '/auth/sign-up/user-data' }),
  })

  const form = useAppForm({
    ...formOpts,
    onSubmit: mutateAsync,
  })

  return (
    <div className="container grid min-h-screen min-w-screen place-items-center">
      <Card className="relative w-full max-w-md [view-transition-name:auth-card]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a New Account</CardDescription>
          <div className="my-2">
            <SocialSignOn />
          </div>
          <Separator className="mt-2" />
        </CardHeader>
        <CardContent>
          <Activity mode={isError ? 'visible' : 'hidden'}>
            <Alert variant="destructive" className="my-5">
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>An error occurred: {error?.message}</AlertDescription>
            </Alert>
          </Activity>
          <SignUpForm form={form} />
        </CardContent>
      </Card>
    </div>
  )
}
