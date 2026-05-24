import { Database } from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import { DatabaseError, EntityNotFoundError } from '../../../src/db/repository/base-repository'
import { ClientsRepository } from '../../../src/db/repository/clients-repository'
import { clients } from '../../../src/db/schemas/clients'

describe('ClientsRepository', () => {
  let db: ReturnType<typeof drizzle>
  let repo: ClientsRepository

  beforeEach(() => {
    const sqlite = new Database(':memory:')
    db = drizzle({ client: sqlite })

    sqlite.run(`
      CREATE TABLE clients (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        birth_date INTEGER NOT NULL,
        phone_number TEXT NOT NULL,
        client_id TEXT,
        primary_care_specialist TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      )
    `)

    repo = new ClientsRepository(db, clients)
  })

  describe('findByClientId', () => {
    test('should find client by client id', async () => {
      await db.insert(clients).values({
        id: 'client-by-1',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('1990-01-15'),
        phoneNumber: '555-0100',
        clientId: 'user-ref-1',
      })

      const result = await repo.findByClientId('user-ref-1')
      expect(result).toBeDefined()
      expect(result!.firstName).toBe('John')
      expect(result!.lastName).toBe('Doe')
    })

    test('should return undefined when client id not found', async () => {
      const result = await repo.findByClientId('non-existent')
      expect(result).toBeUndefined()
    })
  })

  describe('hasPrimaryCareSpecialistReferences', () => {
    test('should return true when specialist has client references', async () => {
      await db.insert(clients).values({
        id: 'client-ref-1',
        firstName: 'Jane',
        lastName: 'Smith',
        birthDate: new Date('1985-06-20'),
        phoneNumber: '555-0200',
        primaryCareSpecialist: 'spec-1',
      })

      const result = await repo.hasPrimaryCareSpecialistReferences('spec-1')
      expect(result).toBe(true)
    })

    test('should return false when specialist has no client references', async () => {
      const result = await repo.hasPrimaryCareSpecialistReferences('spec-none')
      expect(result).toBe(false)
    })
  })

  describe('findAllByPrimaryCareSpecialist', () => {
    test('should find all clients by primary care specialist', async () => {
      await db.insert(clients).values([
        {
          id: 'client-pcs-1',
          firstName: 'Alice',
          lastName: 'Johnson',
          birthDate: new Date('1992-03-10'),
          phoneNumber: '555-0300',
          primaryCareSpecialist: 'spec-2',
        },
        {
          id: 'client-pcs-2',
          firstName: 'Bob',
          lastName: 'Williams',
          birthDate: new Date('1988-07-25'),
          phoneNumber: '555-0400',
          primaryCareSpecialist: 'spec-2',
        },
        {
          id: 'client-pcs-3',
          firstName: 'Carol',
          lastName: 'Brown',
          birthDate: new Date('1995-11-05'),
          phoneNumber: '555-0500',
          primaryCareSpecialist: 'spec-3',
        },
      ])

      const results = await repo.findAllByPrimaryCareSpecialist('spec-2')
      expect(results.length).toBe(2)
      expect(results.map((r) => r.firstName).sort()).toEqual(['Alice', 'Bob'])
    })

    test('should return empty array when specialist has no clients', async () => {
      const results = await repo.findAllByPrimaryCareSpecialist('spec-empty')
      expect(results.length).toBe(0)
    })
  })

  describe('save', () => {
    test('should save and return client', async () => {
      const result = await repo.save({
        id: 'client-save-1',
        firstName: 'Save',
        lastName: 'Test',
        birthDate: new Date('2000-01-01'),
        phoneNumber: '555-9999',
      })

      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.firstName).toBe('Save')
      }
    })
  })

  describe('findById', () => {
    test('should find client by id', async () => {
      await db.insert(clients).values({
        id: 'client-find-1',
        firstName: 'Find',
        lastName: 'Me',
        birthDate: new Date('1991-01-01'),
        phoneNumber: '555-1111',
      })

      const result = await repo.findById('client-find-1')
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.firstName).toBe('Find')
      }
    })

    test('should return error when client not found', async () => {
      const result = await repo.findById('non-existent')
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('findBy', () => {
    test('should find client by phone number', async () => {
      await db.insert(clients).values({
        id: 'client-findby-1',
        firstName: 'ByPhone',
        lastName: 'Test',
        birthDate: new Date('1993-03-03'),
        phoneNumber: '555-3333',
      })

      const phoneColumn = (cols: typeof repo.columns) => sql<string>`${cols.phoneNumber}`
      const result = await repo.findBy(phoneColumn, '555-3333')
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.id).toBe('client-findby-1')
      }
    })

    test('should return error when not found by column', async () => {
      const phoneColumn = (cols: typeof repo.columns) => sql<string>`${cols.phoneNumber}`
      const result = await repo.findBy(phoneColumn, '000-0000')
      expect(result.status).toBe('error')
    })
  })

  describe('findMany', () => {
    test('should find multiple clients by last name', async () => {
      await db.insert(clients).values([
        {
          id: 'client-many-1',
          firstName: 'A',
          lastName: 'Smith',
          birthDate: new Date('1990-01-01'),
          phoneNumber: '555-0101',
        },
        {
          id: 'client-many-2',
          firstName: 'B',
          lastName: 'Smith',
          birthDate: new Date('1991-02-02'),
          phoneNumber: '555-0102',
        },
        {
          id: 'client-many-3',
          firstName: 'C',
          lastName: 'Jones',
          birthDate: new Date('1992-03-03'),
          phoneNumber: '555-0103',
        },
      ])

      const lastNameColumn = (cols: typeof repo.columns) => sql<string>`${cols.lastName}`
      const results = await repo.findMany(lastNameColumn, 'Smith')
      expect(results.length).toBe(2)
    })

    test('should return empty array when no matches', async () => {
      const lastNameColumn = (cols: typeof repo.columns) => sql<string>`${cols.lastName}`
      const results = await repo.findMany(lastNameColumn, 'NonExistent')
      expect(results.length).toBe(0)
    })
  })

  describe('findAll', () => {
    test('should return all clients', async () => {
      await db.insert(clients).values([
        {
          id: 'client-all-1',
          firstName: 'X',
          lastName: 'Y',
          birthDate: new Date('1990-01-01'),
          phoneNumber: '555-1001',
        },
        {
          id: 'client-all-2',
          firstName: 'Z',
          lastName: 'W',
          birthDate: new Date('1991-02-02'),
          phoneNumber: '555-1002',
        },
      ])

      const results = await repo.findAll()
      expect(results.length).toBe(2)
    })
  })

  describe('update', () => {
    test('should update client', async () => {
      await db.insert(clients).values({
        id: 'client-upd-1',
        firstName: 'Old',
        lastName: 'Name',
        birthDate: new Date('1990-01-01'),
        phoneNumber: '555-2001',
      })

      const result = await repo.update('client-upd-1', {
        firstName: 'New',
        lastName: 'Identity',
      })
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.firstName).toBe('New')
        expect(result.value.lastName).toBe('Identity')
      }
    })

    test('should return error when updating non-existent client', async () => {
      const result = await repo.update('non-existent', { firstName: 'Nope' })
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('delete', () => {
    test('should delete client', async () => {
      await db.insert(clients).values({
        id: 'client-del-1',
        firstName: 'Delete',
        lastName: 'Me',
        birthDate: new Date('1990-01-01'),
        phoneNumber: '555-3001',
      })

      const result = await repo.delete('client-del-1')
      expect(result.status).toBe('ok')

      const findResult = await repo.findById('client-del-1')
      expect(findResult.status).toBe('error')
    })

    test('should return error when deleting non-existent client', async () => {
      const result = await repo.delete('missing')
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('exists', () => {
    test('should return true when client exists', async () => {
      await db.insert(clients).values({
        id: 'client-exist-1',
        firstName: 'Exists',
        lastName: 'True',
        birthDate: new Date('1990-01-01'),
        phoneNumber: '555-4001',
      })

      const exists = await repo.exists('client-exist-1')
      expect(exists).toBe(true)
    })

    test('should return false when client does not exist', async () => {
      const exists = await repo.exists('non-existent')
      expect(exists).toBe(false)
    })
  })
})
