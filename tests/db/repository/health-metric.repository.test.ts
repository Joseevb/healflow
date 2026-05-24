import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'

import { Database } from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import type * as schema from '../../../src/db/schemas'

import { HealthMetricRepository } from '../../../src/db/repository/health-metric.repository'
import { healthMetrics } from '../../../src/db/schemas'

describe('HealthMetricRepository', () => {
  let db: BunSQLiteDatabase<typeof schema>
  let repo: HealthMetricRepository

  beforeEach(() => {
    const sqlite = new Database(':memory:')
    db = drizzle({ client: sqlite })

    sqlite.run(`
      CREATE TABLE "health-metrics" (
        id TEXT PRIMARY KEY,
        metric_type TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        notes TEXT,
        source TEXT,
        user_id TEXT NOT NULL,
        recorded_by_specialist_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)

    repo = new HealthMetricRepository(db, healthMetrics)
  })

  describe('findAllByClientId', () => {
    test('should find all metrics for a client ordered by createdAt desc', async () => {
      const now = Date.now()
      await db.insert(healthMetrics).values([
        {
          id: '1',
          clientId: 'client1',
          metricType: 'BLOOD_PRESSURE_SYSTOLIC',
          value: 120,
          unit: 'mmHg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now),
        },
        {
          id: '2',
          clientId: 'client1',
          metricType: 'HEART_RATE',
          value: 72,
          unit: 'bpm',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now + 1000),
        },
        {
          id: '3',
          clientId: 'client2',
          metricType: 'BLOOD_PRESSURE_SYSTOLIC',
          value: 130,
          unit: 'mmHg',
          recordedBySpecialistId: 'spec2',
          createdAt: new Date(now),
        },
      ])

      const results = await repo.findAllByClientId('client1')
      expect(results.length).toBe(2)
      expect(results[0].id).toBe('2')
      expect(results[1].id).toBe('1')
      expect(results[0].clientId).toBe('client1')
      expect(results[1].clientId).toBe('client1')
    })

    test('should return empty array when client has no metrics', async () => {
      const results = await repo.findAllByClientId('non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('findAllByClientIdBetweenDates', () => {
    test('should return metrics within date range', async () => {
      const now = Date.now()
      const hour = 60 * 60 * 1000

      await db.insert(healthMetrics).values([
        {
          id: '1',
          clientId: 'client1',
          metricType: 'WEIGHT',
          value: 70,
          unit: 'kg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now - 2 * hour),
        },
        {
          id: '2',
          clientId: 'client1',
          metricType: 'HEART_RATE',
          value: 72,
          unit: 'bpm',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now - hour),
        },
        {
          id: '3',
          clientId: 'client1',
          metricType: 'BLOOD_PRESSURE_SYSTOLIC',
          value: 120,
          unit: 'mmHg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now),
        },
        {
          id: '4',
          clientId: 'client1',
          metricType: 'BLOOD_GLUCOSE',
          value: 100,
          unit: 'mg/dL',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now + hour),
        },
      ])

      const from = new Date(now - 1.5 * hour)
      const to = new Date(now + 0.5 * hour)

      const results = await repo.findAllByClientIdBetweenDates('client1', from, to)

      expect(results.length).toBe(2)
      expect(results[0].id).toBe('3')
      expect(results[1].id).toBe('2')
    })

    test('should include metrics exactly at boundary timestamps', async () => {
      const now = Date.now()

      await db.insert(healthMetrics).values([
        {
          id: '1',
          clientId: 'client1',
          metricType: 'WEIGHT',
          value: 70,
          unit: 'kg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now - 1000),
        },
        {
          id: '2',
          clientId: 'client1',
          metricType: 'HEART_RATE',
          value: 72,
          unit: 'bpm',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now),
        },
        {
          id: '3',
          clientId: 'client1',
          metricType: 'BLOOD_PRESSURE_SYSTOLIC',
          value: 120,
          unit: 'mmHg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now + 1000),
        },
      ])

      const results = await repo.findAllByClientIdBetweenDates(
        'client1',
        new Date(now),
        new Date(now + 1000),
      )

      expect(results.length).toBe(2)
      expect(results[0].id).toBe('3')
      expect(results[1].id).toBe('2')
    })

    test('should return empty array when no metrics in range', async () => {
      const now = Date.now()

      await db.insert(healthMetrics).values([
        {
          id: '1',
          clientId: 'client1',
          metricType: 'WEIGHT',
          value: 70,
          unit: 'kg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now - 10000),
        },
      ])

      const results = await repo.findAllByClientIdBetweenDates(
        'client1',
        new Date(now),
        new Date(now + 1000),
      )

      expect(results.length).toBe(0)
    })

    test('should only return metrics for specified client', async () => {
      const now = Date.now()

      await db.insert(healthMetrics).values([
        {
          id: '1',
          clientId: 'client1',
          metricType: 'WEIGHT',
          value: 70,
          unit: 'kg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now),
        },
        {
          id: '2',
          clientId: 'client2',
          metricType: 'HEART_RATE',
          value: 72,
          unit: 'bpm',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now),
        },
      ])

      const results = await repo.findAllByClientIdBetweenDates(
        'client1',
        new Date(now - 1000),
        new Date(now + 1000),
      )

      expect(results.length).toBe(1)
      expect(results[0].clientId).toBe('client1')
      expect(results[0].id).toBe('1')
    })

    test('should return ordered by createdAt descending', async () => {
      const now = Date.now()

      await db.insert(healthMetrics).values([
        {
          id: '1',
          clientId: 'client1',
          metricType: 'WEIGHT',
          value: 70,
          unit: 'kg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now - 3000),
        },
        {
          id: '2',
          clientId: 'client1',
          metricType: 'HEART_RATE',
          value: 72,
          unit: 'bpm',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now - 1000),
        },
        {
          id: '3',
          clientId: 'client1',
          metricType: 'BLOOD_PRESSURE_SYSTOLIC',
          value: 120,
          unit: 'mmHg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now - 2000),
        },
      ])

      const results = await repo.findAllByClientIdBetweenDates(
        'client1',
        new Date(now - 5000),
        new Date(now),
      )

      expect(results.length).toBe(3)
      expect(results[0].id).toBe('2')
      expect(results[1].id).toBe('3')
      expect(results[2].id).toBe('1')
    })

    test('should handle from and to being the same', async () => {
      const now = Date.now()

      await db.insert(healthMetrics).values([
        {
          id: 'exact',
          clientId: 'client1',
          metricType: 'WEIGHT',
          value: 70,
          unit: 'kg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now),
        },
        {
          id: 'before',
          clientId: 'client1',
          metricType: 'HEART_RATE',
          value: 72,
          unit: 'bpm',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now - 1),
        },
        {
          id: 'after',
          clientId: 'client1',
          metricType: 'BLOOD_PRESSURE_SYSTOLIC',
          value: 120,
          unit: 'mmHg',
          recordedBySpecialistId: 'spec1',
          createdAt: new Date(now + 1),
        },
      ])

      const results = await repo.findAllByClientIdBetweenDates(
        'client1',
        new Date(now),
        new Date(now),
      )

      expect(results.length).toBe(1)
      expect(results[0].id).toBe('exact')
    })
  })

  describe('inherited methods', () => {
    test('should use inherited findById method', async () => {
      await db.insert(healthMetrics).values({
        id: 'metric1',
        clientId: 'client1',
        metricType: 'BLOOD_PRESSURE_SYSTOLIC',
        value: 120,
        unit: 'mmHg',
        recordedBySpecialistId: 'spec1',
      })

      const result = await repo.findById('metric1')
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.clientId).toBe('client1')
        expect(result.value.metricType).toBe('BLOOD_PRESSURE_SYSTOLIC')
      }
    })

    test('should return error when findById does not find entity', async () => {
      const result = await repo.findById('non-existent')
      expect(result.status).toBe('error')
    })

    test('should use inherited save method', async () => {
      const result = await repo.save({
        id: 'metric2',
        clientId: 'client1',
        metricType: 'HEART_RATE',
        recordedBySpecialistId: 'spec1',
        value: 75,
        unit: 'bpm',
      })

      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.id).toBe('metric2')
      }

      const found = await repo.findById('metric2')
      expect(found.status).toBe('ok')
    })

    test('should save with optional fields', async () => {
      const result = await repo.save({
        id: 'metric3',
        clientId: 'client1',
        metricType: 'WEIGHT',
        recordedBySpecialistId: 'spec1',
        value: 70.5,
        unit: 'kg',
        notes: 'Morning measurement',
        source: 'manual',
      })

      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.notes).toBe('Morning measurement')
        expect(result.value.source).toBe('manual')
      }
    })
  })
})
