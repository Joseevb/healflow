import { sql } from 'drizzle-orm'
import { check, sqliteTable, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { users } from '@/db/schemas/auth'

export const clients = sqliteTable(
  'clients',
  (t) => ({
    id: t
      .text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    firstName: t.text('first_name').notNull(),
    lastName: t.text('last_name').notNull(),
    phoneNumber: t.text('phone_number').notNull(),

    clientId: t.text('client_id').references(() => users.id),
    primaryCareSpecialist: t.text('primary_care_specialist').references(() => users.id),

    createdAt: t.integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    updatedAt: t.integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
  }),

  (t) => [
    check('client_not_specialist', sql`${t.clientId} != ${t.primaryCareSpecialist}`),
    uniqueIndex('clients_first_name_idx').on(t.firstName),
    uniqueIndex('clients_phone_number_idx').on(t.phoneNumber),
    uniqueIndex('clients_primary_care_specialist_idx').on(t.primaryCareSpecialist),
  ],
)
