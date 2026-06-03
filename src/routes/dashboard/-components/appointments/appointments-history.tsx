import { Calendar, ChevronRight, Clock, FileText, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import type { AppointmentStatus, AppointmentWithSpecialist } from '@/types/appointments'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatTime } from '@/lib/utils'

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
            Completed visits, cancellations, and no-shows are grouped here regardless of whether
            they happened earlier today or in the past.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 hover:dark:bg-blue-900/20"
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
              Completed visits and other closed appointments will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-border/60 bg-card/95 shadow-md">
          <CardHeader className="border-b border-border/60 bg-[linear-gradient(to_right,hsl(var(--card))_0%,hsl(var(--primary)/0.08)_45%,hsl(var(--card))_100%)] px-6 py-5">
            <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-300">
              {appointmentHistory.length} Closed Appointment
              {appointmentHistory.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 sm:p-6">
            {appointmentHistory.map((appointment) =>
              (() => {
                const specialistName = appointment.specialist.name
                const specialistSpecialty = appointment.specialist.specialistData.specialty
                const specialistImage = appointment.specialist.image
                const statusLabel =
                  appointment.status.charAt(0) +
                  appointment.status.slice(1).toLowerCase().replace('_', ' ')

                return (
                  <div
                    key={appointment.id}
                    className="group cursor-pointer rounded-2xl border border-border/60 bg-muted/20 p-4 transition-colors duration-200 hover:bg-accent/30"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-accent/50 p-2.5 transition-all duration-300 group-hover:scale-105">
                          <SpecialistImage
                            profilePictureName={specialistImage}
                            name={specialistName}
                          />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="font-semibold text-slate-900 transition-colors group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-400">
                              {specialistName}
                            </p>
                            <p className="text-sm text-muted-foreground">{specialistSpecialty}</p>
                          </div>

                          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-3">
                            <span className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                              <Calendar className="size-4 text-slate-400" />
                              {formatDate(new Date(appointment.appointmentDate).toISOString())}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                              <Clock className="size-4 text-slate-400" />
                              {formatTime(new Date(appointment.appointmentDate).toISOString())}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                              <ShieldCheck className="size-4 text-slate-400" />
                              {statusLabel}
                            </span>
                          </div>

                          {appointment.notes ? (
                            <div className="inline-flex max-w-2xl items-start gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                              <FileText className="mt-0.5 size-4 shrink-0 text-slate-400" />
                              <span className="line-clamp-2">{appointment.notes}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                        <Badge variant={statusVariants[appointment.status]}>{statusLabel}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>View details</span>
                          <ChevronRight className="size-5 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-teal-600" />
                        </div>
                      </div>
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
