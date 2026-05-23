import { and, asc, eq, gte, lte } from 'drizzle-orm'

import type { specialistAvailability } from '@/db/schemas'

import { BaseRepository } from '@/db/repository/base-repository'

export class SpecialistAvailabilityRepository extends BaseRepository<
  typeof specialistAvailability
> {
  async findAllBySpecialistId(specialistId: string) {
    return await this.db
      .select()
      .from(this.table)
      .where(eq(this.columns.specialistId, specialistId))
  }

  async findAvailableBySpecialistIdBetweenDates(
    specialistId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return await this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.columns.specialistId, specialistId),
          eq(this.columns.isAvailable, true),
          gte(this.columns.startTime, startDate),
          lte(this.columns.startTime, endDate),
        ),
      )
      .orderBy(asc(this.columns.startTime))
  }
}
