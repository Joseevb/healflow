import type { appointmentStatus } from '@/db/schemas'

export type AppointmentStatus = (typeof appointmentStatus)[number]
