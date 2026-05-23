import { eq } from 'drizzle-orm'

import type { addresses } from '@/db/schemas/addresses'

import { BaseRepository } from '@/db/repository/base-repository'

export class AddressesRepository extends BaseRepository<typeof addresses> {
  async findByUserId(userId: string) {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(this.columns.userId, userId))
      .limit(1)

    return rows.at(0)
  }
}
