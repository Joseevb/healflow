import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import * as z from 'zod'

import { clients } from '@/db/schemas/clients'

export const selectClientSchema = createSelectSchema(clients)
export const insertClientSchema = createInsertSchema(clients, {
  firstName: z.string().nonempty().nonoptional(),
  lastName: z.string().nonempty().nonoptional(),
  phoneNumber: z.string().nonempty().nonoptional(),

  clientId: z.uuid().nonempty().nonoptional(),
  primaryCareSpecialist: z.uuid().nonempty().nonoptional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export const updateClientSchema = createUpdateSchema(clients, {
  firstName: z.string().nonempty().optional(),
  lastName: z.string().nonempty().optional(),
  phoneNumber: z.string().nonempty().optional(),

  clientId: z.uuid().nonempty().optional(),
  primaryCareSpecialist: z.uuid().nonempty().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type Client = z.infer<typeof selectClientSchema>
export type CreateClient = z.infer<typeof insertClientSchema>
export type UpdateClient = z.infer<typeof updateClientSchema>
