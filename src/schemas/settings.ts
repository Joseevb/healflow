import * as z from 'zod'

function requiredString(message: string) {
  return z.string().trim().min(1, message)
}

export const settingsAddressSchema = z.object({
  street: requiredString('Street cannot be empty'),
  city: requiredString('City cannot be empty'),
  state: requiredString('State cannot be empty'),
  country: requiredString('Country cannot be empty'),
  zipCode: requiredString('Zip code cannot be empty'),
})

export const settingsFormSchema = z.object({
  firstName: requiredString('First name cannot be empty'),
  lastName: requiredString('Last name cannot be empty'),
  email: z.email('It must be a valid email'),
  phoneNumber: requiredString('Phone number cannot be empty'),
  birthDate: requiredString('Date of birth cannot be empty')
    .pipe(z.coerce.date())
    .refine((date) => date <= new Date(), 'Date of birth cannot be in the future'),
  primaryCareSpecialist: requiredString('Primary care specialist is required'),
  address: settingsAddressSchema,
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>
export type SettingsFormInput = z.input<typeof settingsFormSchema>
