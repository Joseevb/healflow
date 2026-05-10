import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { seed } from 'drizzle-seed'

import { db } from '@/db'
import { specialistAvailability, specialistsData, users } from '@/db/schemas'
import * as schemas from '@/db/schemas'
import { auth } from '@/lib/auth'
import { DAYS } from '@/types/date'
import { SPECIALTIES } from '@/types/specialties'

const tableArgs = Bun.argv.slice(2)

if (tableArgs.length === 0) {
  console.error('Usage: bun run src/db/seed.ts <table1> <table2> ...')
  process.exit(1)
}

if (Bun.env.NODE_ENV === 'production') {
  console.error('Refusing to seed in production')
  process.exit(1)
}

// Custom seeders

async function seedSpecialists() {
  console.log('  Clearing existing specialist data...')
  await db.delete(specialistAvailability)
  await db.delete(specialistsData)

  faker.seed(42)

  const now = new Date()
  const count = 10
  const primaryCareCount = 3
  const otherSpecialties = SPECIALTIES.filter((s) => s !== 'Primary Care')

  const specialties = Array.from({ length: count }, (_, i) =>
    i < primaryCareCount ? 'Primary Care' : faker.helpers.arrayElement(otherSpecialties),
  ).sort(() => Math.random() - 0.5)

  let created = 0
  for (const specialty of specialties) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const email = faker.internet.email({ firstName, lastName }).toLowerCase()

    const alreadyExists = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (alreadyExists.length > 0) continue

    const { user } = await auth.api.createUser({
      body: {
        email,
        password: 'password123',
        name: `${firstName} ${lastName}`,
        role: 'specialist',
        data: { onboardingComplete: true },
      },
    })

    const consultationDurationMinutes = faker.helpers.arrayElement([30, 45, 60])

    await db.insert(specialistsData).values({
      id: crypto.randomUUID(),
      licenseNumber: `LIC-${faker.string.alphanumeric(8).toUpperCase()}`,
      consultationDurationMinutes,
      specialistId: user.id,
      specialty,
      createdAt: now,
      updatedAt: now,
    })

    let slotCount = 0
    for (let d = 0; d < 15; d++) {
      const date = new Date(now)
      date.setDate(date.getDate() + d)
      const dayName = DAYS[date.getDay()]

      const addBlock = async (baseHour: number, range: number) => {
        const start = new Date(date)
        start.setHours(
          baseHour + faker.number.int({ min: 0, max: range - 1 }),
          faker.number.int({ min: 0, max: 59 }),
          0,
          0,
        )
        const end = new Date(start)
        end.setHours(start.getHours() + faker.number.int({ min: 2, max: 4 }))
        try {
          await db.insert(specialistAvailability).values({
            id: crypto.randomUUID(),
            dayOfWeek: dayName,
            startTime: start,
            endTime: end,
            isAvailable: true,
            specialistId: user.id,
            createdAt: now,
            updatedAt: now,
          })
          slotCount++
        } catch {
          // skip duplicate (dayOfWeek + startTime + endTime collision)
        }
      }

      await addBlock(8, 2)
      await addBlock(13, 2)
    }
    created++
    console.log(
      `  [${created}/${count}] ${specialty}: ${firstName} ${lastName} (${consultationDurationMinutes}min)`,
    )
  }

  console.log(`  Created ${created} specialist(s)`)
}

const customSeeders: Record<string, () => Promise<void>> = {
  specialists: seedSpecialists,
}

// ── Run ─────────────────────────────────────────────────────

const customKeys = tableArgs.filter((t) => t in customSeeders)
const schemaKeys = tableArgs.filter((t) => t in schemas && !(t in customSeeders))
const unknown = tableArgs.filter((t) => !(t in schemas) && !(t in customSeeders))

if (unknown.length > 0) {
  console.error('Unknown:', unknown.join(', '))
  process.exit(1)
}

for (const key of customKeys) {
  console.log(`Custom seeding: ${key}`)
  await customSeeders[key]()
}

if (schemaKeys.length > 0) {
  const toSeed: Record<string, unknown> = {}
  for (const name of schemaKeys) {
    toSeed[name] = (schemas as Record<string, unknown>)[name]
  }
  console.log(`Default seeding: ${schemaKeys.join(', ')}`)
  await seed(db, toSeed)
}

console.log('Done.')
