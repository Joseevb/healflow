import { Database } from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import { AddressesRepository } from '../../../src/db/repository/addresses.repository'
import { EntityNotFoundError } from '../../../src/db/repository/base-repository'
import { addresses } from '../../../src/db/schemas/addresses'

describe('AddressesRepository', () => {
  let db: ReturnType<typeof drizzle>
  let repo: AddressesRepository

  beforeEach(() => {
    const sqlite = new Database(':memory:')
    db = drizzle({ client: sqlite })

    sqlite.run(`
      CREATE TABLE addresses (
        id TEXT PRIMARY KEY,
        street TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        country TEXT NOT NULL,
        zipCode TEXT NOT NULL,
        user_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    repo = new AddressesRepository(db, addresses)
  })

  describe('findByUserId', () => {
    test('should find address by user id', async () => {
      await db.insert(addresses).values({
        id: 'addr-1',
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        country: 'USA',
        zipCode: '97201',
        userId: 'user-1',
      })

      const result = await repo.findByUserId('user-1')
      expect(result).toBeDefined()
      expect(result!.id).toBe('addr-1')
      expect(result!.city).toBe('Portland')
    })

    test('should return undefined when user id not found', async () => {
      const result = await repo.findByUserId('non-existent')
      expect(result).toBeUndefined()
    })
  })

  describe('save', () => {
    test('should save and return address', async () => {
      const result = await repo.save({
        id: 'addr-save-1',
        street: '456 Oak Ave',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        zipCode: '98101',
      })

      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.id).toBe('addr-save-1')
        expect(result.value.street).toBe('456 Oak Ave')
      }
    })
  })

  describe('findById', () => {
    test('should find address by id', async () => {
      await db.insert(addresses).values({
        id: 'addr-find-1',
        street: '789 Pine St',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        zipCode: '80201',
      })

      const result = await repo.findById('addr-find-1')
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.street).toBe('789 Pine St')
      }
    })

    test('should return error when address not found', async () => {
      const result = await repo.findById('non-existent')
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('findBy', () => {
    test('should find address by city', async () => {
      await db.insert(addresses).values({
        id: 'addr-findby-1',
        street: '321 Elm St',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        zipCode: '60601',
      })

      const cityColumn = (cols: typeof repo.columns) => sql<string>`${cols.city}`
      const result = await repo.findBy(cityColumn, 'Chicago')
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.id).toBe('addr-findby-1')
      }
    })

    test('should return error when not found by column', async () => {
      const cityColumn = (cols: typeof repo.columns) => sql<string>`${cols.city}`
      const result = await repo.findBy(cityColumn, 'NonExistent')
      expect(result.status).toBe('error')
    })
  })

  describe('findMany', () => {
    test('should find multiple addresses by state', async () => {
      await db.insert(addresses).values([
        {
          id: 'addr-many-1',
          street: 'A St',
          city: 'NYC',
          state: 'NY',
          country: 'USA',
          zipCode: '10001',
        },
        {
          id: 'addr-many-2',
          street: 'B St',
          city: 'Buffalo',
          state: 'NY',
          country: 'USA',
          zipCode: '14201',
        },
        {
          id: 'addr-many-3',
          street: 'C St',
          city: 'LA',
          state: 'CA',
          country: 'USA',
          zipCode: '90001',
        },
      ])

      const stateColumn = (cols: typeof repo.columns) => sql<string>`${cols.state}`
      const results = await repo.findMany(stateColumn, 'NY')
      expect(results.length).toBe(2)
    })

    test('should return empty array when no matches', async () => {
      const stateColumn = (cols: typeof repo.columns) => sql<string>`${cols.state}`
      const results = await repo.findMany(stateColumn, 'NonExistent')
      expect(results.length).toBe(0)
    })
  })

  describe('findAll', () => {
    test('should return all addresses', async () => {
      await db.insert(addresses).values([
        {
          id: 'addr-all-1',
          street: 'D St',
          city: 'Miami',
          state: 'FL',
          country: 'USA',
          zipCode: '33101',
        },
        {
          id: 'addr-all-2',
          street: 'E St',
          city: 'Tampa',
          state: 'FL',
          country: 'USA',
          zipCode: '33601',
        },
      ])

      const results = await repo.findAll()
      expect(results.length).toBe(2)
    })
  })

  describe('update', () => {
    test('should update address', async () => {
      await db.insert(addresses).values({
        id: 'addr-upd-1',
        street: 'Old St',
        city: 'Dallas',
        state: 'TX',
        country: 'USA',
        zipCode: '75201',
      })

      const result = await repo.update('addr-upd-1', { street: 'New St', city: 'Austin' })
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.street).toBe('New St')
        expect(result.value.city).toBe('Austin')
      }
    })

    test('should return error when updating non-existent address', async () => {
      const result = await repo.update('non-existent', { street: 'Nope' })
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('delete', () => {
    test('should delete address', async () => {
      await db.insert(addresses).values({
        id: 'addr-del-1',
        street: 'Delete St',
        city: 'Houston',
        state: 'TX',
        country: 'USA',
        zipCode: '77001',
      })

      const result = await repo.delete('addr-del-1')
      expect(result.status).toBe('ok')

      const findResult = await repo.findById('addr-del-1')
      expect(findResult.status).toBe('error')
    })

    test('should return error when deleting non-existent address', async () => {
      const result = await repo.delete('missing')
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('exists', () => {
    test('should return true when address exists', async () => {
      await db.insert(addresses).values({
        id: 'addr-exist-1',
        street: 'Exist St',
        city: 'Phoenix',
        state: 'AZ',
        country: 'USA',
        zipCode: '85001',
      })

      const exists = await repo.exists('addr-exist-1')
      expect(exists).toBe(true)
    })

    test('should return false when address does not exist', async () => {
      const exists = await repo.exists('non-existent')
      expect(exists).toBe(false)
    })
  })
})
