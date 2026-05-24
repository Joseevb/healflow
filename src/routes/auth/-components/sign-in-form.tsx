import { formOptions } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'

import type { SignIn } from '@/schemas/auth'

import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { withForm } from '@/hooks/form'
import { signInSchema } from '@/schemas/auth'

export const formOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
    rememberMe: false,
  } as SignIn,
  validators: {
    onSubmit: signInSchema,
  },
})

export const SignInForm = withForm({
  ...formOpts,
  render: ({ form }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              type="email"
              label="Email"
              description="Enter your email address"
              placeholder="john-doe@example.com"
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.TextField
              type="password"
              label="Password"
              description="Enter your secure password"
              placeholder="*********"
            />
          )}
        </form.AppField>
      </FieldGroup>

      <form.AppForm>
        <div className="mt-3 flex flex-row items-end justify-end gap-5 ">
          <div className="flex flex-col justify-between gap-1">
            <span className="text-xs text-muted-foreground">No account?</span>
            <Button
              nativeButton={false}
              variant="secondary"
              render={<Link to="/auth/sign-up">Sign Up</Link>}
            />
          </div>
          <form.SubscribeButton label="Sign In" />
        </div>
      </form.AppForm>
    </form>
  ),
})
