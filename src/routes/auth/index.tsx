import type { AnyUseMutationOptions } from '@tanstack/react-query'

import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Activity } from 'react'

import type { SignIn } from '@/schemas/auth'

import SocialSignOn from '@/components/social-sign-on'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAppForm } from '@/hooks/form'
import { signIn } from '@/lib/auth-client'
import { formOpts, SignInForm } from '@/routes/auth/-components/sign-in-form'
import { validateSignUpSession } from '@/session/onboarding-session'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
  beforeLoad: async () => validateSignUpSession({ data: 'account' }),
})

const mutationOptions = {
  mutationFn: async ({ value }: { value: SignIn }) => {
    const result = await signIn.email({
      callbackURL: '/dashboard',
      ...value,
    })

    if (result.error) {
      throw new Error(result.error.message || 'Sign in failed')
    }
  },
  mutationKey: ['signIn'],
} satisfies AnyUseMutationOptions

function RouteComponent() {
  const { mutateAsync, error, isError } = useMutation<void, Error, { value: SignIn }>(
    mutationOptions,
  )

  const form = useAppForm({
    ...formOpts,
    onSubmit: mutateAsync,
  })

  return (
    <div className="container grid min-h-screen min-w-screen place-items-center">
      <Card className="relative w-full max-w-md [view-transition-name:auth-card]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign into your account</CardDescription>
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
          <SignInForm form={form} />
        </CardContent>
      </Card>
    </div>
  )
}
