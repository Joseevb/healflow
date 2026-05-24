import type { EntityNotFoundError } from '@/db/repository/base-repository'
import type { appointmentStatus } from '@/db/schemas'
import type { Appointment } from '@/db/types/appointments.zod'
import type { Specialist } from '@/db/types/specialists-data.zod'
import type { SafeSerializedResult } from '@/lib/result'

export type AppointmentStatus = (typeof appointmentStatus)[number]

export type AppointmentSpecialistLookupError = Extract<
  SafeSerializedResult<Specialist, EntityNotFoundError>,
  { status: 'error' }
>['error']

export type AppointmentWithSpecialist = Appointment & {
  specialist: Specialist
}
