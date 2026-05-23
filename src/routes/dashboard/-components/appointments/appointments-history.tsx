import { Calendar, ChevronRight, Clock } from 'lucide-react'
import { useState } from 'react'

import type { AppointmentStatus, AppointmentWithSpecialist } from '@/types/appointments'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import AppointmentDetailsDialog from './appointment-detail'
import { SpecialistImage } from './specialist-image'

interface AppointmentHistoryProps {
  appointmentHistory: Array<AppointmentWithSpecialist>
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

export default function AppointmentHistory({
  appointmentHistory,
}: Readonly<Omit<AppointmentHistoryProps, 'statusColors'>>) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithSpecialist | null>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleViewDetails = (appointment: AppointmentWithSpecialist) => {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="bg-linear-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:via-teal-400 dark:to-green-400">
            Appointment History
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your past appointments and medical visit records
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          Export Records
        </Button>
      </div>

      {appointmentHistory.length === 0 ? (
        <Card className="border border-border/60 bg-card/95 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-linear-to-br from-blue-100 via-teal-100 to-green-100 p-4 dark:from-blue-900/20 dark:via-teal-900/20 dark:to-green-900/20">
              <Calendar className="size-8 text-teal-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No appointment history</h3>
            <p className="max-w-sm text-center text-muted-foreground">
              Your completed and past appointments will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-border/60 bg-card/95 shadow-md">
          <CardHeader className="border-b border-border/60 bg-[linear-gradient(to_right,hsl(var(--card))_0%,hsl(var(--primary)/0.08)_45%,hsl(var(--card))_100%)] px-6 py-5">
            <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-300">
              {appointmentHistory.length} Past Appointment
              {appointmentHistory.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 p-0 dark:divide-slate-700/50">
            {appointmentHistory.map((appointment) =>
              (() => {
                const specialistName = appointment.specialist.name
                const specialistSpecialty = appointment.specialist.specialistData.specialty
                const specialistImage = appointment.specialist.image

                return (
                  <div
                    key={appointment.id}
                    className="group flex cursor-pointer items-center justify-between gap-4 p-4 transition-colors duration-200 hover:bg-accent/30"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-accent/50 p-2.5 transition-all duration-300 group-hover:scale-105">
                        <SpecialistImage
                          profilePictureName={specialistImage}
                          name={specialistName}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 transition-colors group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-400">
                          {specialistName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {specialistSpecialty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="hidden items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground sm:flex">
                        <Calendar className="size-4 text-slate-400" />
                        <span>
                          {new Date(appointment.appointmentDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="hidden items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground md:flex">
                        <Clock className="size-4 text-slate-400" />
                        <span>
                          {new Date(appointment.appointmentDate).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <Badge variant={statusVariants[appointment.status]}>
                        {appointment.status.charAt(0) +
                          appointment.status.slice(1).toLowerCase().replace('_', ' ')}
                      </Badge>

                      <ChevronRight className="size-5 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-teal-600" />
                    </div>
                  </div>
                )
              })(),
            )}
          </CardContent>
        </Card>
      )}

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </section>
  )
}
