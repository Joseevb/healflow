import { primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'

import { users } from '@/db/schemas'

export const userMedicines = sqliteTable(
  'user_medicines',
  (t) => ({
    dosage: t.text('dosage').notNull(),
    frequency: t.text('frequency').notNull(),
    startDate: t.integer('start_date', { mode: 'timestamp_ms' }).notNull(),
    endDate: t.integer('end_date', { mode: 'timestamp_ms' }).notNull(),

    medicineId: t.integer('medicine_id').notNull(),
    userId: t
      .text('user_id')
      .notNull(),
      .references(() => users.id),
  }),
  (t) => [primaryKey({ columns: [t.userId, t.medicineId] })],
)
