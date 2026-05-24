import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { useState } from 'react'

import type { AppointmentStatus, AppointmentWithSpecialist } from '@/types/appointments'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import AppointmentDetailsDialog from './appointment-detail'
import { SpecialistImage } from './specialist-image'

interface UpcomingAppointmentsProps {
  upcomingAppointments: Array<AppointmentWithSpecialist>
  statusColors: Record<AppointmentStatus, string>
}

const statusVariants: Record<
  AppointmentStatus,
  'success' | 'warning' | 'info' | 'error' | 'secondary'
> = {
  confirmed: 'success',
  pending: 'warning',
  completed: 'info',
  cancelled: 'error',
  'no-show': 'secondary',
}

export default function UpcomingAppointments({
  upcomingAppointments,
}: Readonly<Omit<UpcomingAppointmentsProps, 'statusColors'>>) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithSpecialist | null>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleViewDetails(appointment: AppointmentWithSpecialist) {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:to-blue-600">
              Upcoming Appointments
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You have{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {upcomingAppointments.length}
              </span>{' '}
              upcoming appointment
              {upcomingAppointments.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {upcomingAppointments.length === 0 ? (
          <Card className="border border-border/60 bg-card/95 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 p-4 dark:from-blue-900/20 dark:via-teal-900/20 dark:to-green-900/20">
                <Calendar className="size-8 text-teal-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No upcoming appointments</h3>
              <p className="max-w-sm text-center text-muted-foreground">
                You don't have any scheduled appointments. Book one to get started with your
                healthcare journey.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="group overflow-hidden border border-border/60 bg-card/95 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-teal-500/10"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 p-3 transition-transform duration-300 group-hover:scale-105 dark:from-blue-900/20 dark:via-teal-900/20 dark:to-green-900/20">
                        <SpecialistImage
                          profilePictureName={appointment.specialist?.image}
                          name={appointment.specialist.name}
                        />{' '}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold">
                          {appointment.specialist.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5">
                          <span className="inline-block h-2 w-2 rounded-full bg-teal-500" />
                          {appointment.specialist.specialistData.specialty}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={statusVariants[appointment.status]}>
                      {appointment.status.charAt(0) + appointment.status.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-muted-foreground">
                      <Calendar className="size-4 text-blue-600" />
                      <span>
                        {new Date(appointment.appointmentDate).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-muted-foreground">
                      <Clock className="size-4 text-teal-600" />
                      <span>
                        {new Date(appointment.appointmentDate).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full transition-all duration-200 group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700 dark:group-hover:border-teal-700 dark:group-hover:bg-teal-900/20 dark:group-hover:text-teal-300"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      View Details
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
