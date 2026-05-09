import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import * as z from 'zod'

import { addresses } from '@/db/schemas/addresses'

export const selectAddressSchema = createSelectSchema(addresses)
export const insertAddressSchema = createInsertSchema(addresses, {
  street: z.string().nonempty().nonoptional(),
  city: z.string().nonempty().nonoptional(),
  state: z.string().nonempty().nonoptional(),
  country: z.string().nonempty().nonoptional(),
  zipCode: z.string().nonempty().nonoptional(),

  userId: z.uuid().nonempty().nonoptional(),
}).omit({ id: true, createdAt: true, updatedAt: true })
export const updateAddressSchema = createUpdateSchema(addresses, {
  street: z.string().nonempty().optional(),
  city: z.string().nonempty().optional(),
  state: z.string().nonempty().optional(),
  country: z.string().nonempty().optional(),
  zipCode: z.string().nonempty().optional(),

  userId: z.uuid().nonempty().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
