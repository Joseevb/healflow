import { Database } from 'bun:sqlite'
import { beforeEach, describe, expect, test } from 'bun:test'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import { DatabaseError, EntityNotFoundError } from '../../../src/db/repository/base-repository'
import { UsersRepository } from '../../../src/db/repository/users.repository'
import { users } from '../../../src/db/schemas/auth'

describe('UsersRepository', () => {
  let db: ReturnType<typeof drizzle>
  let repo: UsersRepository

  beforeEach(() => {
    const sqlite = new Database(':memory:')
    db = drizzle({ client: sqlite })

    sqlite.run(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        role TEXT DEFAULT 'client',
        banned INTEGER DEFAULT 0,
        ban_reason TEXT,
        ban_expires INTEGER,
        stripe_customer_id TEXT,
        deleted_at INTEGER,
        onboarding_complete INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)

    repo = new UsersRepository(db, users)
  })

  describe('findByIdOrUndefined', () => {
    test('should find user by id', async () => {
      await db.insert(users).values({
        id: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const result = await repo.findByIdOrUndefined('user-1')
      expect(result).toBeDefined()
      expect(result!.id).toBe('user-1')
      expect(result!.email).toBe('alice@example.com')
    })

    test('should return undefined when user not found', async () => {
      const result = await repo.findByIdOrUndefined('non-existent')
      expect(result).toBeUndefined()
    })
  })

  describe('findAllSpecialistsByField', () => {
    test('should find specialist IDs matching field value', async () => {
      await db.insert(users).values([
        {
          id: 'spec-1',
          name: 'Dr. Smith',
          email: 'smith@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'spec-2',
          name: 'Dr. Jones',
          email: 'jones@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'client-1',
          name: 'Bob',
          email: 'bob@example.com',
          role: 'client',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ])

      const results = await repo.findAllSpecialistsByField('email' as any, 'jones@clinic.com')
      expect(results.length).toBe(1)
      expect(results[0].id).toBe('spec-2')
    })

    test('should return empty array when no specialists match', async () => {
      const results = await repo.findAllSpecialistsByField('email' as any, 'nobody@example.com')
      expect(results.length).toBe(0)
    })
  })

  describe('findSpecialistById', () => {
    test('should find specialist by id', async () => {
      await db.insert(users).values([
        {
          id: 'spec-find-1',
          name: 'Dr. Adams',
          email: 'adams@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'client-find-2',
          name: 'Charlie',
          email: 'charlie@example.com',
          role: 'client',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ])

      const result = await repo.findSpecialistById('spec-find-1')
      expect(result).toBeDefined()
      expect(result!.name).toBe('Dr. Adams')
    })

    test('should return undefined when id belongs to non-specialist', async () => {
      await db.insert(users).values({
        id: 'client-only',
        name: 'Diana',
        email: 'diana@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const result = await repo.findSpecialistById('client-only')
      expect(result).toBeUndefined()
    })

    test('should return undefined when specialist not found', async () => {
      const result = await repo.findSpecialistById('non-existent')
      expect(result).toBeUndefined()
    })
  })

  describe('findAllSpecialists', () => {
    test('should return all specialists', async () => {
      await db.insert(users).values([
        {
          id: 'spec-all-1',
          name: 'Dr. White',
          email: 'white@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'spec-all-2',
          name: 'Dr. Black',
          email: 'black@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'client-all-3',
          name: 'Eve',
          email: 'eve@example.com',
          role: 'client',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ])

      const results = await repo.findAllSpecialists()
      expect(results.length).toBe(2)
      expect(results.map((r) => r.name).sort()).toEqual(['Dr. Black', 'Dr. White'])
    })

    test('should return empty array when no specialists exist', async () => {
      const results = await repo.findAllSpecialists()
      expect(results.length).toBe(0)
    })
  })

  describe('findAllSpecialistsByIds', () => {
    test('should find specialists by multiple ids', async () => {
      await db.insert(users).values([
        {
          id: 'spec-ids-1',
          name: 'Dr. Green',
          email: 'green@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'spec-ids-2',
          name: 'Dr. Blue',
          email: 'blue@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'spec-ids-3',
          name: 'Dr. Red',
          email: 'red@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'client-ids-4',
          name: 'Frank',
          email: 'frank@example.com',
          role: 'client',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ])

      const results = await repo.findAllSpecialistsByIds([
        'spec-ids-1',
        'spec-ids-3',
        'spec-ids-99',
      ])
      expect(results.length).toBe(2)
      expect(results.map((r) => r.id).sort()).toEqual(['spec-ids-1', 'spec-ids-3'])
    })

    test('should return empty array when ids list is empty', async () => {
      const results = await repo.findAllSpecialistsByIds([])
      expect(results.length).toBe(0)
    })

    test('should return empty when no matching specialists found', async () => {
      await db.insert(users).values({
        id: 'client-only-2',
        name: 'Grace',
        email: 'grace@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const results = await repo.findAllSpecialistsByIds(['client-only-2'])
      expect(results.length).toBe(0)
    })
  })

  describe('findAllActiveSpecialists', () => {
    test('should return only non-banned specialists', async () => {
      await db.insert(users).values([
        {
          id: 'spec-active-1',
          name: 'Dr. Active',
          email: 'active@clinic.com',
          role: 'specialist',
          banned: false,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'spec-active-2',
          name: 'Dr. Banned',
          email: 'banned@clinic.com',
          role: 'specialist',
          banned: true,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'client-active-3',
          name: 'Henry',
          email: 'henry@example.com',
          role: 'client',
          banned: false,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ])

      const results = await repo.findAllActiveSpecialists()
      expect(results.length).toBe(1)
      expect(results[0].id).toBe('spec-active-1')
    })

    test('should return empty array when no active specialists exist', async () => {
      const results = await repo.findAllActiveSpecialists()
      expect(results.length).toBe(0)
    })
  })

  describe('findActiveSpecialistById', () => {
    test('should find active specialist by id', async () => {
      await db.insert(users).values([
        {
          id: 'spec-act-1',
          name: 'Dr. Good',
          email: 'good@clinic.com',
          role: 'specialist',
          banned: false,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'spec-act-2',
          name: 'Dr. Bad',
          email: 'bad@clinic.com',
          role: 'specialist',
          banned: true,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ])

      const result = await repo.findActiveSpecialistById('spec-act-1')
      expect(result).toBeDefined()
      expect(result!.name).toBe('Dr. Good')
    })

    test('should return undefined when specialist is banned', async () => {
      await db.insert(users).values({
        id: 'spec-banned',
        name: 'Dr. Banned',
        email: 'banned@clinic.com',
        role: 'specialist',
        banned: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const result = await repo.findActiveSpecialistById('spec-banned')
      expect(result).toBeUndefined()
    })

    test('should return undefined when id belongs to non-specialist', async () => {
      await db.insert(users).values({
        id: 'just-client',
        name: 'Ivy',
        email: 'ivy@example.com',
        role: 'client',
        banned: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const result = await repo.findActiveSpecialistById('just-client')
      expect(result).toBeUndefined()
    })

    test('should return undefined when specialist not found', async () => {
      const result = await repo.findActiveSpecialistById('non-existent')
      expect(result).toBeUndefined()
    })
  })

  describe('save', () => {
    test('should save and return user', async () => {
      const result = await repo.save({
        id: 'user-save-1',
        name: 'Save User',
        email: 'save@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.name).toBe('Save User')
      }
    })
  })

  describe('findById', () => {
    test('should find user by id', async () => {
      await db.insert(users).values({
        id: 'user-find-1',
        name: 'Find User',
        email: 'find@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const result = await repo.findById('user-find-1')
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.email).toBe('find@example.com')
      }
    })

    test('should return error when user not found', async () => {
      const result = await repo.findById('non-existent')
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('findBy', () => {
    test('should find user by email', async () => {
      await db.insert(users).values({
        id: 'user-findby-1',
        name: 'ByEmail',
        email: 'byemail@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const emailColumn = (cols: typeof repo.columns) => sql<string>`${cols.email}`
      const result = await repo.findBy(emailColumn, 'byemail@example.com')
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.id).toBe('user-findby-1')
      }
    })

    test('should return error when not found by column', async () => {
      const emailColumn = (cols: typeof repo.columns) => sql<string>`${cols.email}`
      const result = await repo.findBy(emailColumn, 'unknown@example.com')
      expect(result.status).toBe('error')
    })
  })

  describe('findMany', () => {
    test('should find multiple users by role', async () => {
      await db.insert(users).values([
        {
          id: 'user-many-1',
          name: 'Spec A',
          email: 'speca@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'user-many-2',
          name: 'Spec B',
          email: 'specb@clinic.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'user-many-3',
          name: 'Client A',
          email: 'clienta@example.com',
          role: 'client',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ])

      const roleColumn = (cols: typeof repo.columns) => sql<string>`${cols.role}`
      const results = await repo.findMany(roleColumn, 'specialist')
      expect(results.length).toBe(2)
    })

    test('should return empty array when no matches', async () => {
      const roleColumn = (cols: typeof repo.columns) => sql<string>`${cols.role}`
      const results = await repo.findMany(roleColumn, 'admin')
      expect(results.length).toBe(0)
    })
  })

  describe('findAll', () => {
    test('should return all users', async () => {
      await db.insert(users).values([
        {
          id: 'user-all-1',
          name: 'User One',
          email: 'one@example.com',
          role: 'client',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
        {
          id: 'user-all-2',
          name: 'User Two',
          email: 'two@example.com',
          role: 'specialist',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ])

      const results = await repo.findAll()
      expect(results.length).toBe(2)
    })
  })

  describe('update', () => {
    test('should update user', async () => {
      await db.insert(users).values({
        id: 'user-upd-1',
        name: 'Old Name',
        email: 'old@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const result = await repo.update('user-upd-1', { name: 'New Name' })
      expect(result.status).toBe('ok')
      if (result.status === 'ok') {
        expect(result.value.name).toBe('New Name')
      }
    })

    test('should return error when updating non-existent user', async () => {
      const result = await repo.update('non-existent', { name: 'Nope' })
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('delete', () => {
    test('should delete user', async () => {
      await db.insert(users).values({
        id: 'user-del-1',
        name: 'Delete Me',
        email: 'delete@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const result = await repo.delete('user-del-1')
      expect(result.status).toBe('ok')

      const findResult = await repo.findById('user-del-1')
      expect(findResult.status).toBe('error')
    })

    test('should return error when deleting non-existent user', async () => {
      const result = await repo.delete('missing')
      expect(result.status).toBe('error')
      if (result.status === 'error') {
        expect(result.error).toBeInstanceOf(EntityNotFoundError)
      }
    })
  })

  describe('exists', () => {
    test('should return true when user exists', async () => {
      await db.insert(users).values({
        id: 'user-exist-1',
        name: 'Exists True',
        email: 'exists@example.com',
        role: 'client',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      })

      const exists = await repo.exists('user-exist-1')
      expect(exists).toBe(true)
    })

    test('should return false when user does not exist', async () => {
      const exists = await repo.exists('non-existent')
      expect(exists).toBe(false)
    })
  })
})
