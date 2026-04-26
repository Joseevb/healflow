import { sqliteTable } from 'drizzle-orm/sqlite-core'

import { users } from '@/db/schemas/auth'

export const specialties = sqliteTable('specialties', (t) => ({
  id: t
    .text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text('name').notNull().unique(),
}))

export const specialistsData = sqliteTable('specialists_data', (t) => ({
  id: t
    .text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  licenseNumber: t.text('license_number').notNull().unique(),
  consultationDurationMinutes: t.integer('consultation_duration_minutes').notNull(),

  specialistId: t
    .text('specialist_id')
    .notNull()
    .references(() => users.id)
    .unique(),
  specialtyId: t
    .text('specialty_id')
    .notNull()
    .references(() => specialties.id),

  createdAt: t
    .integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: t
    .integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$onUpdate(() => new Date()),
}))
