import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'

import { Database } from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import type * as schema from '../../../src/db/schemas'

import { AppointmentsRepository } from '../../../src/db/repository/appoinments.repository'
import { appointments } from '../../../src/db/schemas'

describe('AppointmentsRepository', () => {
  let db: BunSQLiteDatabase<typeof schema>
  let repo: AppointmentsRepository

  beforeEach(() => {
    const sqlite = new Database(':memory:')
    db = drizzle({ client: sqlite })

    sqlite.run(`
      CREATE TABLE appointments (
        id TEXT PRIMARY KEY,
        duration_minutes INTEGER NOT NULL,
        notes TEXT,
        cancellation_reason TEXT,
        client_id TEXT NOT NULL,
        specialist_id TEXT NOT NULL,
        status TEXT NOT NULL,
        appointment_date INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        CONSTRAINT client_not_specialist CHECK (client_id != specialist_id)
      )
    `)

    repo = new AppointmentsRepository(db, appointments)
  })

  describe('findAllByClientId', () => {
    test('should find all appointments for a client', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-01T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client1',
          specialistId: 'spec2',
          status: 'completed',
          durationMinutes: 45,
          appointmentDate: new Date('2026-01-01T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-01T11:00:00.000Z'),
        },
      ])

      const results = await repo.findAllByClientId('client1')
      expect(results.length).toBe(2)
      expect(results[0].clientId).toBe('client1')
      expect(results[1].clientId).toBe('client1')
    })

    test('should return empty array when client has no appointments', async () => {
      const results = await repo.findAllByClientId('non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('findAllBySpecialistId', () => {
    test('should find all appointments for a specialist', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-01T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 45,
          appointmentDate: new Date('2026-01-01T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client1',
          specialistId: 'spec2',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-01T11:00:00.000Z'),
        },
      ])

      const results = await repo.findAllBySpecialistId('spec1')
      expect(results.length).toBe(2)
      expect(results[0].specialistId).toBe('spec1')
      expect(results[1].specialistId).toBe('spec1')
    })

    test('should return empty array when specialist has no appointments', async () => {
      const results = await repo.findAllBySpecialistId('non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('findUpcomingByClientId', () => {
    test('should find upcoming pending/confirmed appointments for a client', async () => {
      const now = new Date('2026-06-15T12:00:00.000Z')
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'pending',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 45,
          appointmentDate: new Date('2026-06-25T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-10T09:00:00.000Z'),
        },
        {
          id: '4',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
      ])

      const results = await repo.findUpcomingByClientId('client1', now)
      expect(results.length).toBe(2)
      expect(results[0].id).toBe('1')
      expect(results[1].id).toBe('2')
    })

    test('should return empty array when no upcoming appointments', async () => {
      const now = new Date('2026-06-15T12:00:00.000Z')
      const results = await repo.findUpcomingByClientId('non-existent', now)
      expect(results.length).toBe(0)
    })
  })

  describe('findHistoryByClientId', () => {
    test('should find past completed/cancelled/no-show appointments for a client', async () => {
      const now = new Date('2026-06-15T12:00:00.000Z')
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-10T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'cancelled',
          durationMinutes: 45,
          appointmentDate: new Date('2026-06-05T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'no-show',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-01T09:00:00.000Z'),
        },
        {
          id: '4',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'pending',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
        {
          id: '5',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-10T09:00:00.000Z'),
        },
      ])

      const results = await repo.findHistoryByClientId('client1', now)
      expect(results.length).toBe(3)
      expect(results[0].id).toBe('1')
      expect(results[1].id).toBe('2')
      expect(results[2].id).toBe('3')
    })

    test('should return empty array when no history appointments', async () => {
      const now = new Date('2026-06-15T12:00:00.000Z')
      const results = await repo.findHistoryByClientId('non-existent', now)
      expect(results.length).toBe(0)
    })
  })

  describe('findCompletedHistoryByClientId', () => {
    test('should find completed/cancelled/no-show appointments for a client', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-10T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'cancelled',
          durationMinutes: 45,
          appointmentDate: new Date('2026-01-05T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
        {
          id: '4',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-10T09:00:00.000Z'),
        },
      ])

      const results = await repo.findCompletedHistoryByClientId('client1')
      expect(results.length).toBe(2)
      expect(results[0].id).toBe('1')
      expect(results[1].id).toBe('2')
    })

    test('should return empty array when client has no completed history', async () => {
      const results = await repo.findCompletedHistoryByClientId('non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('findByIdAndSpecialistId', () => {
    test('should find appointment by id and specialist id', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-01T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client1',
          specialistId: 'spec2',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-01T10:00:00.000Z'),
        },
      ])

      const results = await repo.findByIdAndSpecialistId('1', 'spec1')
      expect(results.length).toBe(1)
      expect(results[0].id).toBe('1')
      expect(results[0].specialistId).toBe('spec1')
    })

    test('should return empty array when appointment not found for specialist', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-01T09:00:00.000Z'),
        },
      ])

      const results = await repo.findByIdAndSpecialistId('1', 'non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('findUpcomingBySpecialistId', () => {
    test('should find upcoming pending/confirmed appointments for a specialist', async () => {
      const now = new Date('2026-06-15T12:00:00.000Z')
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'pending',
          durationMinutes: 45,
          appointmentDate: new Date('2026-06-25T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client3',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-10T09:00:00.000Z'),
        },
        {
          id: '4',
          clientId: 'client1',
          specialistId: 'spec2',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
      ])

      const results = await repo.findUpcomingBySpecialistId('spec1', now)
      expect(results.length).toBe(2)
      expect(results[0].id).toBe('1')
      expect(results[1].id).toBe('2')
    })

    test('should return empty array when no upcoming appointments for specialist', async () => {
      const now = new Date('2026-06-15T12:00:00.000Z')
      const results = await repo.findUpcomingBySpecialistId('non-existent', now)
      expect(results.length).toBe(0)
    })
  })

  describe('findRecentCompletedBySpecialistId', () => {
    test('should find recent completed/cancelled/no-show appointments for a specialist', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-10T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'cancelled',
          durationMinutes: 45,
          appointmentDate: new Date('2026-01-05T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client3',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
        {
          id: '4',
          clientId: 'client1',
          specialistId: 'spec2',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-01-10T09:00:00.000Z'),
        },
      ])

      const results = await repo.findRecentCompletedBySpecialistId('spec1')
      expect(results.length).toBe(2)
      expect(results[0].id).toBe('1')
      expect(results[1].id).toBe('2')
    })

    test('should respect limit parameter', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-02-10T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 45,
          appointmentDate: new Date('2026-01-05T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client3',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-03-20T09:00:00.000Z'),
        },
      ])

      const results = await repo.findRecentCompletedBySpecialistId('spec1', 2)
      expect(results.length).toBe(2)
    })

    test('should return empty array when no completed appointments', async () => {
      const results = await repo.findRecentCompletedBySpecialistId('non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('findActiveByIdAndSpecialistId', () => {
    test('should find active pending/confirmed appointment by id and specialist id', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 45,
          appointmentDate: new Date('2026-06-10T09:00:00.000Z'),
        },
      ])

      const results = await repo.findActiveByIdAndSpecialistId('1', 'spec1')
      expect(results.length).toBe(1)
      expect(results[0].id).toBe('1')
    })

    test('should return empty array when appointment is not active', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-10T09:00:00.000Z'),
        },
      ])

      const results = await repo.findActiveByIdAndSpecialistId('1', 'spec1')
      expect(results.length).toBe(0)
    })

    test('should return empty array when not found for specialist', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
      ])

      const results = await repo.findActiveByIdAndSpecialistId('1', 'non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('findScheduledBySpecialistIdBetweenDates', () => {
    test('should find scheduled pending/confirmed appointments within date range', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client2',
          specialistId: 'spec1',
          status: 'pending',
          durationMinutes: 45,
          appointmentDate: new Date('2026-06-25T10:00:00.000Z'),
        },
        {
          id: '3',
          clientId: 'client3',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-22T09:00:00.000Z'),
        },
        {
          id: '4',
          clientId: 'client4',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-07-05T09:00:00.000Z'),
        },
      ])

      const results = await repo.findScheduledBySpecialistIdBetweenDates(
        'spec1',
        new Date('2026-06-18T00:00:00.000Z'),
        new Date('2026-06-30T23:59:59.000Z'),
      )
      expect(results.length).toBe(2)
      expect(results[0].id).toBe('1')
      expect(results[1].id).toBe('2')
    })

    test('should return empty array when no appointments in date range', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
      ])

      const results = await repo.findScheduledBySpecialistIdBetweenDates(
        'spec1',
        new Date('2026-07-01T00:00:00.000Z'),
        new Date('2026-07-31T23:59:59.000Z'),
      )
      expect(results.length).toBe(0)
    })

    test('should return empty array for non-existent specialist', async () => {
      const results = await repo.findScheduledBySpecialistIdBetweenDates(
        'non-existent',
        new Date('2026-01-01T00:00:00.000Z'),
        new Date('2026-12-31T23:59:59.000Z'),
      )
      expect(results.length).toBe(0)
    })
  })

  describe('findSchedulableByIdAndClientId', () => {
    test('should find schedulable pending/confirmed appointment by id and client id', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
        {
          id: '2',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 45,
          appointmentDate: new Date('2026-06-10T09:00:00.000Z'),
        },
      ])

      const results = await repo.findSchedulableByIdAndClientId('1', 'client1')
      expect(results.length).toBe(1)
      expect(results[0].id).toBe('1')
    })

    test('should return empty array when appointment is not schedulable', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'completed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-10T09:00:00.000Z'),
        },
      ])

      const results = await repo.findSchedulableByIdAndClientId('1', 'client1')
      expect(results.length).toBe(0)
    })

    test('should return empty array when not found for client', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
      ])

      const results = await repo.findSchedulableByIdAndClientId('1', 'non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('completeById', () => {
    test('should complete an appointment and set notes', async () => {
      await db.insert(appointments).values([
        {
          id: '1',
          clientId: 'client1',
          specialistId: 'spec1',
          status: 'confirmed',
          durationMinutes: 30,
          appointmentDate: new Date('2026-06-20T09:00:00.000Z'),
        },
      ])

      const result = await repo.completeById('1', 'Patient recovered well')
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.status).toBe('completed')
        expect(result.value.notes).toBe('Patient recovered well')
      }
    })

    test('should return error when appointment not found', async () => {
      const result = await repo.completeById('non-existent', 'Some notes')
      expect(result.status).toBe('error')
    })
  })

  describe('createFollowUp', () => {
    test('should create a follow-up appointment with pending status', async () => {
      const result = await repo.createFollowUp({
        clientId: 'client1',
        specialistId: 'spec1',
        appointmentDate: new Date('2026-07-01T10:00:00.000Z'),
        durationMinutes: 45,
        notes: 'Follow-up after surgery',
      })

      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.clientId).toBe('client1')
        expect(result.value.specialistId).toBe('spec1')
        expect(result.value.status).toBe('pending')
        expect(result.value.durationMinutes).toBe(45)
        expect(result.value.appointmentDate).toBeInstanceOf(Date)
        expect(result.value.notes).toBe('Follow-up after surgery')
      }
    })

    test('should create a follow-up appointment without notes', async () => {
      const result = await repo.createFollowUp({
        clientId: 'client1',
        specialistId: 'spec1',
        appointmentDate: new Date('2026-07-01T10:00:00.000Z'),
        durationMinutes: 30,
      })

      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.clientId).toBe('client1')
        expect(result.value.specialistId).toBe('spec1')
        expect(result.value.status).toBe('pending')
        expect(result.value.durationMinutes).toBe(30)
        expect(result.value.notes).toBeNull()
      }
    })
  })
})
