import { desc, eq } from 'drizzle-orm'

import type { healthScore } from '@/db/schemas'

import { BaseRepository } from '@/db/repository/base-repository'

export class HealthScoreRepository extends BaseRepository<typeof healthScore> {
  async findLatestByClientId(clientId: string) {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(this.columns.userId, clientId))
      .orderBy(desc(this.columns.createdAt))
      .limit(1)

    return rows.at(0)
  }

  async findHistoryByClientId(clientId: string) {
    return await this.db
      .select()
      .from(this.table)
      .where(eq(this.columns.userId, clientId))
      .orderBy(desc(this.columns.createdAt))
  }
}
