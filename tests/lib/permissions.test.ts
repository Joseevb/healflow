import { describe, expect, test } from 'bun:test'

import { ac, admin, client, permissions, specialist } from '../../src/lib/permissions'

describe('permissions', () => {
  test('permissions array has the correct roles', () => {
    expect(permissions).toEqual(['admin', 'client', 'specialist'])
  })

  test('ac is defined and is an access control instance', () => {
    expect(ac).toBeDefined()
    expect(typeof ac).toBe('object')
  })

  test('admin role has expected statements', () => {
    const adminStatements = admin.statements

    expect(adminStatements).toBeDefined()
    expect(adminStatements.appointment).toEqual(['read', 'update', 'delete'])
    expect(adminStatements.user).toBeDefined()
  })

  test('client role has expected statements', () => {
    const clientStatements = client.statements

    expect(clientStatements).toBeDefined()
    expect(clientStatements.appointment).toEqual(['request', 'read', 'update'])
    expect(clientStatements.user).toBeDefined()
  })

  test('specialist role has expected statements', () => {
    const specialistStatements = specialist.statements

    expect(specialistStatements).toBeDefined()
    expect(specialistStatements.appointment).toEqual(['request', 'read', 'update', 'accept'])
    expect(specialistStatements.user).toBeDefined()
  })
})
