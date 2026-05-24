import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import type { users } from '@/db/schemas'

import { specialistsData } from '@/db/schemas'
import { SPECIALTIES } from '@/types/specialties'

export const selectSpecialistDataSchema = createSelectSchema(specialistsData)
export const insertSpecialistDataSchema = createInsertSchema(specialistsData, {
  licenseNumber: z.string().nonempty().nonoptional(),
  consultationDurationMinutes: z.number().min(15).nonoptional(),

  specialty: z.enum(SPECIALTIES),
  specialistId: z.string().nonempty().nonoptional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export const updateSpecialistDataSchema = createInsertSchema(specialistsData, {
  licenseNumber: z.string().nonempty().optional(),
  consultationDurationMinutes: z.number().min(15).optional(),

  specialty: z.enum(SPECIALTIES).optional(),
  specialistId: z.string().nonempty().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type SpecialistData = z.infer<typeof selectSpecialistDataSchema>
export type CreateSpecialistData = z.infer<typeof insertSpecialistDataSchema>
export type UpdateSpecialistData = z.infer<typeof updateSpecialistDataSchema>

export type Specialist = Pick<
  typeof users.$inferSelect,
  'id' | 'name' | 'image' | 'email' | 'createdAt' | 'updatedAt'
> & {
  specialistData: Omit<SpecialistData, 'specialistId'>
}
