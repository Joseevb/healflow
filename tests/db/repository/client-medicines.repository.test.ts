import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'

import { Database } from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import type * as schema from '../../../src/db/schemas'

import { ClientMedicinesRepository } from '../../../src/db/repository/client-medicines.repository'
import { clientMedicines } from '../../../src/db/schemas'

describe('ClientMedicinesRepository', () => {
  let db: BunSQLiteDatabase<typeof schema>
  let repo: ClientMedicinesRepository

  beforeEach(() => {
    const sqlite = new Database(':memory:')
    db = drizzle({ client: sqlite })

    sqlite.run(`
      CREATE TABLE client_medicines (
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        start_date INTEGER NOT NULL,
        end_date INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        medicine_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, medicine_id)
      )
    `)

    repo = new ClientMedicinesRepository(db, clientMedicines)
  })

  describe('findAllByClientId', () => {
    test('should find all medicines for a client', async () => {
      await db.insert(clientMedicines).values([
        {
          name: 'Metformin',
          userId: 'client1',
          medicineId: 1,
          dosage: '10mg',
          frequency: 'daily',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-02-01T00:00:00.000Z'),
        },
        {
          name: 'Lisinopril',
          userId: 'client1',
          medicineId: 2,
          dosage: '20mg',
          frequency: 'daily',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-02-01T00:00:00.000Z'),
        },
        {
          name: 'Metformin',
          userId: 'client2',
          medicineId: 1,
          dosage: '15mg',
          frequency: 'daily',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-02-01T00:00:00.000Z'),
        },
      ])

      const results = await repo.findAllByClientId('client1')
      expect(results.length).toBe(2)
      expect(results[0].userId).toBe('client1')
      expect(results[1].userId).toBe('client1')
    })

    test('should return empty array when client has no medicines', async () => {
      const results = await repo.findAllByClientId('non-existent')
      expect(results.length).toBe(0)
    })
  })

  describe('findAllByMedicineId', () => {
    test('should find all clients using a medicine', async () => {
      await db.insert(clientMedicines).values([
        {
          name: 'Metformin',
          userId: 'client1',
          medicineId: 1,
          dosage: '10mg',
          frequency: 'daily',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-02-01T00:00:00.000Z'),
        },
        {
          name: 'Metformin',
          userId: 'client2',
          medicineId: 1,
          dosage: '20mg',
          frequency: 'daily',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-02-01T00:00:00.000Z'),
        },
        {
          name: 'Lisinopril',
          userId: 'client1',
          medicineId: 2,
          dosage: '30mg',
          frequency: 'daily',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-02-01T00:00:00.000Z'),
        },
      ])

      const results = await repo.findAllByMedicineId(1)
      expect(results.length).toBe(2)
      expect(results[0].medicineId).toBe(1)
      expect(results[1].medicineId).toBe(1)
    })

    test('should return empty array when medicine not found', async () => {
      const results = await repo.findAllByMedicineId(999)
      expect(results.length).toBe(0)
    })
  })

  describe('findByClientIdAndMedicineId', () => {
    test('should find a record by client id and medicine id when it exists', async () => {
      await db.insert(clientMedicines).values({
        name: 'Metformin',
        userId: 'client1',
        medicineId: 1,
        dosage: '10mg',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      })

      const result = await repo.findByClientIdAndMedicineId('client1', 1)

      expect(result).toBeDefined()
      expect(result!.userId).toBe('client1')
      expect(result!.medicineId).toBe(1)
      expect(result!.name).toBe('Metformin')
      expect(result!.dosage).toBe('10mg')
      expect(result!.frequency).toBe('daily')
    })

    test('should return undefined when no matching record exists', async () => {
      const result = await repo.findByClientIdAndMedicineId('non-existent', 999)
      expect(result).toBeUndefined()
    })

    test('should return undefined when client id does not match', async () => {
      await db.insert(clientMedicines).values({
        name: 'Metformin',
        userId: 'client1',
        medicineId: 1,
        dosage: '10mg',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      })

      const result = await repo.findByClientIdAndMedicineId('client2', 1)
      expect(result).toBeUndefined()
    })

    test('should return undefined when medicine id does not match', async () => {
      await db.insert(clientMedicines).values({
        name: 'Metformin',
        userId: 'client1',
        medicineId: 1,
        dosage: '10mg',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      })

      const result = await repo.findByClientIdAndMedicineId('client1', 999)
      expect(result).toBeUndefined()
    })
  })

  describe('saveOrUpdateByClientAndMedicineId', () => {
    test('should create a new record when one does not exist', async () => {
      const result = await repo.saveOrUpdateByClientAndMedicineId({
        clientId: 'client1',
        medicineId: 1,
        name: 'Metformin',
        dosage: '10mg',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      })

      expect(result.userId).toBe('client1')
      expect(result.medicineId).toBe(1)
      expect(result.name).toBe('Metformin')
      expect(result.dosage).toBe('10mg')
      expect(result.frequency).toBe('daily')
    })

    test('should update an existing record when one already exists', async () => {
      await db.insert(clientMedicines).values({
        name: 'Metformin',
        userId: 'client1',
        medicineId: 1,
        dosage: '10mg',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      })

      const result = await repo.saveOrUpdateByClientAndMedicineId({
        clientId: 'client1',
        medicineId: 1,
        name: 'Metformin',
        dosage: '20mg',
        frequency: 'twice daily',
        startDate: new Date('2026-03-01T00:00:00.000Z'),
        endDate: new Date('2026-04-01T00:00:00.000Z'),
      })

      expect(result.userId).toBe('client1')
      expect(result.medicineId).toBe(1)
      expect(result.dosage).toBe('20mg')
      expect(result.frequency).toBe('twice daily')
      expect(result.startDate).toBeDefined()
      expect(result.endDate).toBeDefined()
    })

    test('should not create a duplicate record when updating', async () => {
      await db.insert(clientMedicines).values({
        name: 'Metformin',
        userId: 'client1',
        medicineId: 1,
        dosage: '10mg',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      })

      await repo.saveOrUpdateByClientAndMedicineId({
        clientId: 'client1',
        medicineId: 1,
        name: 'Metformin',
        dosage: '20mg',
        frequency: 'twice daily',
        startDate: new Date('2026-03-01T00:00:00.000Z'),
        endDate: new Date('2026-04-01T00:00:00.000Z'),
      })

      const all = await db.select().from(clientMedicines)
      expect(all.length).toBe(1)
    })

    test('should only update the targeted record', async () => {
      await db.insert(clientMedicines).values([
        {
          name: 'Metformin',
          userId: 'client1',
          medicineId: 1,
          dosage: '10mg',
          frequency: 'daily',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-02-01T00:00:00.000Z'),
        },
        {
          name: 'Lisinopril',
          userId: 'client1',
          medicineId: 2,
          dosage: '20mg',
          frequency: 'daily',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-02-01T00:00:00.000Z'),
        },
      ])

      await repo.saveOrUpdateByClientAndMedicineId({
        clientId: 'client1',
        medicineId: 1,
        name: 'Metformin',
        dosage: '50mg',
        frequency: 'once daily',
        startDate: new Date('2026-03-01T00:00:00.000Z'),
        endDate: new Date('2026-04-01T00:00:00.000Z'),
      })

      const all = await db.select().from(clientMedicines)
      expect(all.length).toBe(2)

      const lisinopril = all.find((r) => r.medicineId === 2)
      expect(lisinopril!.dosage).toBe('20mg')

      const metformin = all.find((r) => r.medicineId === 1)
      expect(metformin!.dosage).toBe('50mg')
    })

    test('should handle multiple create operations for different clients', async () => {
      await repo.saveOrUpdateByClientAndMedicineId({
        clientId: 'client1',
        medicineId: 1,
        name: 'Metformin',
        dosage: '10mg',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      })

      await repo.saveOrUpdateByClientAndMedicineId({
        clientId: 'client2',
        medicineId: 1,
        name: 'Metformin',
        dosage: '20mg',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      })

      const all = await db.select().from(clientMedicines)
      expect(all.length).toBe(2)
      expect(all[0].userId).toBe('client1')
      expect(all[1].userId).toBe('client2')
    })
  })
})
