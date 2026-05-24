import { formOptions } from '@tanstack/react-form'

import type { SettingsFormInput } from '@/schemas/settings'

import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { withForm } from '@/hooks/form'
import { settingsFormSchema } from '@/schemas/settings'

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    primaryCareSpecialist: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  } satisfies SettingsFormInput,
  validators: {
    onSubmit: settingsFormSchema,
  },
})

export const SettingsForm = withForm({
  ...formOpts,
  props: {
    specialists: [] as Array<{ id: string; name: string }>,
    isSpecialistsPending: false,
  },
  render: ({ form, specialists, isSpecialistsPending }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <FieldGroup className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_auto_1fr]">
        <FieldSet className="rounded-2xl border border-border/60 bg-card/80 p-5">
          <FieldLegend>General Information</FieldLegend>
          <FieldDescription>
            Keep your personal details and primary care specialist up to date.
          </FieldDescription>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="firstName">
                {(field) => (
                  <field.TextField
                    label="First Name"
                    description="Your given name"
                    placeholder="John"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="lastName">
                {(field) => (
                  <field.TextField
                    label="Last Name"
                    description="Your family name"
                    placeholder="Doe"
                    required
                  />
                )}
              </form.AppField>
            </div>

            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  type="email"
                  label="Email"
                  description="Used for account notifications and sign in"
                  placeholder="john@doe.com"
                  required
                />
              )}
            </form.AppField>

            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="birthDate">
                {(field) => (
                  <field.TextField
                    type="date"
                    label="Birth Date"
                    description="Your date of birth"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="phoneNumber">
                {(field) => (
                  <field.TextField
                    label="Phone Number"
                    description="A number we can use if needed"
                    placeholder="000000000"
                    required
                  />
                )}
              </form.AppField>
            </div>

            <form.AppField name="primaryCareSpecialist">
              {(field) =>
                isSpecialistsPending ? (
                  <Skeleton className="h-16 rounded-xl" />
                ) : (
                  <field.Select
                    label="Primary Care Specialist"
                    description="Choose your current primary care specialist"
                    options={specialists.map((specialist) => ({
                      value: specialist.id,
                      label: specialist.name,
                    }))}
                    required
                    disabled={specialists.length === 0}
                  />
                )
              }
            </form.AppField>
          </FieldGroup>
        </FieldSet>

        <Separator orientation="vertical" className="hidden h-full xl:block" />
        <Separator className="xl:hidden" />

        <FieldSet className="rounded-2xl border border-border/60 bg-card/80 p-5">
          <FieldLegend>Address</FieldLegend>
          <FieldDescription>Update the address linked to your health records.</FieldDescription>
          <FieldGroup>
            <form.AppField name="address.street">
              {(field) => (
                <field.TextField
                  label="Street"
                  description="Street name and number"
                  placeholder="123 Main St"
                  required
                />
              )}
            </form.AppField>

            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="address.city">
                {(field) => (
                  <field.TextField
                    label="City"
                    description="Your city"
                    placeholder="New York"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="address.state">
                {(field) => (
                  <field.TextField
                    label="State / Province"
                    description="Your state or province"
                    placeholder="New York"
                    required
                  />
                )}
              </form.AppField>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="address.country">
                {(field) => (
                  <field.TextField
                    label="Country"
                    description="Your country"
                    placeholder="United States"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="address.zipCode">
                {(field) => (
                  <field.TextField
                    label="Postal Code"
                    description="ZIP or postal code"
                    placeholder="10001"
                    required
                  />
                )}
              </form.AppField>
            </div>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      <form.AppForm>
        <div className="flex justify-end">
          <form.SubscribeButton label="Save Settings" />
        </div>
      </form.AppForm>
    </form>
  ),
})
