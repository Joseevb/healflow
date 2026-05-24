import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'

import { Database } from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import type * as schema from '../../../src/db/schemas'

import { HealthScoreRepository } from '../../../src/db/repository/health-score.repository'
import { healthScore } from '../../../src/db/schemas'

describe('HealthScoreRepository', () => {
  let db: BunSQLiteDatabase<typeof schema>
  let repo: HealthScoreRepository

  beforeEach(() => {
    const sqlite = new Database(':memory:')
    db = drizzle({ client: sqlite })

    sqlite.run(`
      CREATE TABLE health_score (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        overall_score INTEGER NOT NULL,
        cardiovascular_score INTEGER NOT NULL,
        metabolic_score INTEGER NOT NULL,
        lifestyle_score INTEGER NOT NULL,
        vital_score INTEGER NOT NULL,
        data_points_count INTEGER NOT NULL,
        period_days INTEGER NOT NULL DEFAULT 90,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)

    repo = new HealthScoreRepository(db, healthScore)
  })

  describe('findLatestByClientId', () => {
    test('should find health score for a client', async () => {
      await db.insert(healthScore).values([
        {
          id: '1',
          userId: 'client1',
          overallScore: 85,
          cardiovascularScore: 80,
          metabolicScore: 81,
          lifestyleScore: 82,
          vitalScore: 83,
          dataPointsCount: 10,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
        {
          id: '2',
          userId: 'client2',
          overallScore: 92,
          cardiovascularScore: 90,
          metabolicScore: 91,
          lifestyleScore: 93,
          vitalScore: 94,
          dataPointsCount: 12,
          createdAt: new Date('2026-01-02T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        },
      ])

      const result = await repo.findLatestByClientId('client1')
      expect(result).toBeDefined()
      if (result) {
        expect(result.userId).toBe('client1')
        expect(result.overallScore).toBe(85)
      }
    })

    test('should return undefined when client not found', async () => {
      const result = await repo.findLatestByClientId('non-existent')
      expect(result).toBeUndefined()
    })

    test('should return the most recent matching record', async () => {
      await db.insert(healthScore).values([
        {
          id: '1',
          userId: 'client1',
          overallScore: 85,
          cardiovascularScore: 80,
          metabolicScore: 81,
          lifestyleScore: 82,
          vitalScore: 83,
          dataPointsCount: 10,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
        {
          id: '2',
          userId: 'client1',
          overallScore: 90,
          cardiovascularScore: 84,
          metabolicScore: 85,
          lifestyleScore: 86,
          vitalScore: 87,
          dataPointsCount: 11,
          createdAt: new Date('2026-02-01T00:00:00.000Z'),
          updatedAt: new Date('2026-02-01T00:00:00.000Z'),
        },
      ])

      const result = await repo.findLatestByClientId('client1')
      expect(result).toBeDefined()
      if (result) {
        expect(result.id).toBe('2')
        expect(result.userId).toBe('client1')
      }
    })
  })

  describe('findHistoryByClientId', () => {
    test('should return all records for a client ordered by createdAt desc', async () => {
      await db.insert(healthScore).values([
        {
          id: '1',
          userId: 'client1',
          overallScore: 70,
          cardiovascularScore: 71,
          metabolicScore: 72,
          lifestyleScore: 73,
          vitalScore: 74,
          dataPointsCount: 5,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
        {
          id: '2',
          userId: 'client1',
          overallScore: 80,
          cardiovascularScore: 81,
          metabolicScore: 82,
          lifestyleScore: 83,
          vitalScore: 84,
          dataPointsCount: 8,
          createdAt: new Date('2026-02-01T00:00:00.000Z'),
          updatedAt: new Date('2026-02-01T00:00:00.000Z'),
        },
        {
          id: '3',
          userId: 'client1',
          overallScore: 90,
          cardiovascularScore: 91,
          metabolicScore: 92,
          lifestyleScore: 93,
          vitalScore: 94,
          dataPointsCount: 12,
          createdAt: new Date('2026-03-01T00:00:00.000Z'),
          updatedAt: new Date('2026-03-01T00:00:00.000Z'),
        },
      ])

      const results = await repo.findHistoryByClientId('client1')
      expect(results).toHaveLength(3)
      expect(results[0].id).toBe('3')
      expect(results[1].id).toBe('2')
      expect(results[2].id).toBe('1')
    })

    test('should return empty array when client has no records', async () => {
      await db.insert(healthScore).values([
        {
          id: '1',
          userId: 'client2',
          overallScore: 85,
          cardiovascularScore: 80,
          metabolicScore: 81,
          lifestyleScore: 82,
          vitalScore: 83,
          dataPointsCount: 10,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      ])

      const results = await repo.findHistoryByClientId('client1')
      expect(results).toEqual([])
    })

    test('should not return records belonging to other clients', async () => {
      await db.insert(healthScore).values([
        {
          id: '1',
          userId: 'client1',
          overallScore: 70,
          cardiovascularScore: 71,
          metabolicScore: 72,
          lifestyleScore: 73,
          vitalScore: 74,
          dataPointsCount: 5,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
        {
          id: '2',
          userId: 'client2',
          overallScore: 85,
          cardiovascularScore: 80,
          metabolicScore: 81,
          lifestyleScore: 82,
          vitalScore: 83,
          dataPointsCount: 10,
          createdAt: new Date('2026-02-01T00:00:00.000Z'),
          updatedAt: new Date('2026-02-01T00:00:00.000Z'),
        },
        {
          id: '3',
          userId: 'client3',
          overallScore: 90,
          cardiovascularScore: 91,
          metabolicScore: 92,
          lifestyleScore: 93,
          vitalScore: 94,
          dataPointsCount: 12,
          createdAt: new Date('2026-03-01T00:00:00.000Z'),
          updatedAt: new Date('2026-03-01T00:00:00.000Z'),
        },
      ])

      const results = await repo.findHistoryByClientId('client1')
      expect(results).toHaveLength(1)
      expect(results[0].userId).toBe('client1')
    })

    test('should return single record when only one exists', async () => {
      await db.insert(healthScore).values([
        {
          id: '1',
          userId: 'client1',
          overallScore: 85,
          cardiovascularScore: 80,
          metabolicScore: 81,
          lifestyleScore: 82,
          vitalScore: 83,
          dataPointsCount: 10,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      ])

      const results = await repo.findHistoryByClientId('client1')
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('1')
    })
  })
})
