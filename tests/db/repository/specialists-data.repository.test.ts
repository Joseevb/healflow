import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'

import { Database } from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import type * as schema from '../../../src/db/schemas'

import { SpecialistsDataRepository } from '../../../src/db/repository/specialists-data.repository'
import { specialistsData } from '../../../src/db/schemas'

describe('SpecialistsDataRepository', () => {
  let db: BunSQLiteDatabase<typeof schema>
  let repo: SpecialistsDataRepository

  beforeEach(() => {
    const sqlite = new Database(':memory:')
    db = drizzle({ client: sqlite })

    sqlite.run(`
      CREATE TABLE specialists_data (
        id TEXT PRIMARY KEY,
        license_number TEXT NOT NULL,
        consultation_duration_minutes INTEGER NOT NULL,
        specialist_id TEXT NOT NULL,
        specialty TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)

    repo = new SpecialistsDataRepository(db, specialistsData)
  })

  describe('findBySpecialistId', () => {
    test('should find specialist data by specialist id', async () => {
      await db.insert(specialistsData).values([
        {
          id: '1',
          licenseNumber: 'LIC-1',
          consultationDurationMinutes: 30,
          specialistId: 'spec1',
          specialty: 'Cardiology',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
        {
          id: '2',
          licenseNumber: 'LIC-2',
          consultationDurationMinutes: 45,
          specialistId: 'spec2',
          specialty: 'Dermatology',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      ])

      const result = await repo.findBySpecialistId('spec1')
      expect(result).toBeDefined()
      expect(result?.specialistId).toBe('spec1')
      expect(result?.specialty).toBe('Cardiology')
    })

    test('should return undefined when specialist not found', async () => {
      const result = await repo.findBySpecialistId('non-existent')
      expect(result).toBeUndefined()
    })
  })
})
