import { createAccessControl } from 'better-auth/plugins'
import { defaultStatements, adminAc, userAc } from 'better-auth/plugins/admin/access'

export const statement = {
  ...defaultStatements,
  appointment: ['request', 'read', 'accept', 'update', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  ...adminAc.statements,
  appointment: ['read', 'update', 'delete'],
})

export const client = ac.newRole({
  ...userAc.statements,
  appointment: ['request', 'read', 'update'],
})

export const specialist = ac.newRole({
  ...userAc.statements,
  appointment: ['request', 'read', 'update', 'accept'],
})

export const permissions = ['admin', 'client', 'specialist'] as const

export type Permission = (typeof permissions)[number]
