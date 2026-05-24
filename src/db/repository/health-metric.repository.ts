import { and, desc, eq, gte, lte } from 'drizzle-orm'

import type { healthMetrics } from '@/db/schemas'

import { BaseRepository } from '@/db/repository/base-repository'

export class HealthMetricRepository extends BaseRepository<typeof healthMetrics> {
  async findAllByClientId(clientId: string) {
    return await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.clientId, clientId))
      .orderBy(desc(this.table.createdAt))
  }

  async findAllByClientIdBetweenDates(clientId: string, from: Date, to: Date) {
    return await this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.clientId, clientId),
          gte(this.table.createdAt, from),
          lte(this.table.createdAt, to),
        ),
      )
      .orderBy(desc(this.table.createdAt))
  }
}
