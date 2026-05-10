import { formOptions } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'

import type { UserData } from '@/schemas/auth'

import { Button } from '@/components/ui/button'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { withForm } from '@/hooks/form'

export const formOpts = formOptions({
  defaultValues: {
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    birthDate: new Date(),
    phoneNumber: '',
    primaryCareSpecialist: '',
  } satisfies UserData,
})

export const UserDataForm = withForm({
  ...formOpts,
  props: {
    specialists: [] as Array<{ name: string; id: string }>,
    isSpecialistLoading: false,
  },
  render: ({ form, specialists, isSpecialistLoading }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Personal Information</FieldLegend>
          <FieldDescription>
            Complete your personal information as well as your primary care specialist
          </FieldDescription>
          <FieldGroup>
            <form.AppField name="birthDate">
              {(field) => (
                <field.TextField
                  type="date"
                  label="Birth date"
                  description="Enter your birth date"
                  placeholder="1970/01/01"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name="phoneNumber">
              {(field) => (
                <field.TextField
                  type="number"
                  label="Phone Number"
                  description="Enter your phone number"
                  placeholder="00000000000"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name="primaryCareSpecialist">
              {(field) =>
                isSpecialistLoading ? (
                  <Skeleton />
                ) : (
                  <field.Select
                    label="Primary Care specialist"
                    description="Select your primary care specialist"
                    options={specialists.map((s) => ({ value: s.id, label: s.name }))}
                    required
                    disabled={specialists.length > 0}
                  />
                )
              }
            </form.AppField>
          </FieldGroup>
        </FieldSet>

        <Separator />

        <FieldSet>
          <FieldLegend>Address</FieldLegend>
          <FieldDescription>Complete your address information</FieldDescription>
          <FieldGroup>
            <div className="grid grid-cols-2 md:gap-2 lg:grid-cols-2">
              <form.AppField name="address.street">
                {(field) => (
                  <field.TextField
                    type="text"
                    label="Street"
                    placeholder="123th Str"
                    description="Your street name/number"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="address.city">
                {(field) => (
                  <field.TextField
                    type="text"
                    label="City"
                    placeholder="Manhattan"
                    description="Your city name"
                    required
                  />
                )}
              </form.AppField>
            </div>

            <div className="grid grid-cols-2 md:gap-2 lg:grid-cols-2">
              <form.AppField name="address.state">
                {(field) => (
                  <field.TextField
                    type="text"
                    label="State/Province"
                    placeholder="New York"
                    description="Your state/province name"
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="address.zipCode">
                {(field) => (
                  <field.TextField
                    type="text"
                    label="Postal Code"
                    placeholder="123456"
                    description="Your postal code"
                    required
                  />
                )}
              </form.AppField>
            </div>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      <form.AppForm>
        <div className="mt-3 flex flex-row items-end justify-end gap-5 ">
          <form.SubscribeButton label="Continue" />
        </div>
      </form.AppForm>
    </form>
  ),
})
