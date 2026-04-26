import { index, sqliteTable } from 'drizzle-orm/sqlite-core'

import { users } from '@/db/schemas/auth'

export const healthScore = sqliteTable(
  'health_score',
  (t) => ({
    id: t
      .text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    overallScore: t.integer('overall_score').notNull(),
    cardiovascularScore: t.integer('cardiovascular_score').notNull(),
    metabolicScore: t.integer('metabolic_score').notNull(),
    lifestyleScore: t.integer('lifestyle_score').notNull(),
    vitalScore: t.integer('vital_score').notNull(),
    calculatedAt: t.integer('calculated_at', { mode: 'timestamp_ms' }).notNull(),
    dataPointsCount: t.integer('data_points_count').notNull(),
    periodDays: t.integer('period_days').notNull().default(90),

    userId: t
      .text('user_id')
      .notNull()
      .references(() => users.id),

    createdAt: t
      .integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: t
      .integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('idx_health_score_user_id').on(t.userId),
    index('idx_health_score_calculated_at').on(t.calculatedAt),
    index('idx_health_score_user_calculated').on(t.userId, t.calculatedAt),
  ],
)
