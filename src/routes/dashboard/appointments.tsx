import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  getAppointmentHistoryQueryOptions,
  getUpcomingAppointmentsQueryOptions,
} from '@/queries/appointment-queries'

import AppointmentHistory from './-components/appointments/appointments-history'
import Header from './-components/appointments/header'
import UpcomingAppointments from './-components/appointments/upcoming-appointments'

export const Route = createFileRoute('/dashboard/appointments')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const qc = context.queryClient

    await Promise.allSettled([
      qc.ensureQueryData(getUpcomingAppointmentsQueryOptions()),
      qc.ensureQueryData(getAppointmentHistoryQueryOptions()),
    ])
  },
})

const UpcomingLoadingFallback = (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <div className="animate-pulse rounded-full bg-blue-100 p-4 dark:bg-blue-900/20">
      <Calendar className="size-8 text-blue-600" />
    </div>
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner />
      Loading upcoming appointments...
    </span>
  </div>
)

const HistoryLoadingFallback = (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <div className="animate-pulse rounded-full bg-linear-to-br from-blue-100 via-teal-100 to-green-100 p-4 dark:from-blue-900/20 dark:via-teal-900/20 dark:to-green-900/20">
      <Calendar className="size-8 text-teal-600" />
    </div>
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner />
      Loading appointment history...
    </span>
  </div>
)

function RouteComponent() {
  const { data: history } = useSuspenseQuery(getAppointmentHistoryQueryOptions())
  const { data: upcoming } = useSuspenseQuery(getUpcomingAppointmentsQueryOptions())

  return (
    <div className="space-y-8">
      <Header />

      <Separator variant="gradientBlue" className="my-8" />

      <Suspense fallback={UpcomingLoadingFallback}>
        <UpcomingAppointments upcomingAppointments={upcoming} />
      </Suspense>

      <Separator variant="gradient" className="my-6" />

      <Suspense fallback={HistoryLoadingFallback}>
        <AppointmentHistory appointmentHistory={history} />
      </Suspense>
    </div>
  )
}
