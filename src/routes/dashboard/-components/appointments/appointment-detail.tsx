import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, FileText, Mail, User, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import type { AppointmentStatus, AppointmentWithSpecialist } from '@/types/appointments'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, formatTime } from '@/lib/utils'
import {
  cancelAppointmentMutationOptions,
  getAppointmentHistoryQueryOptions,
  getUpcomingAppointmentsQueryOptions,
} from '@/queries/appointment-queries'

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

interface AppointmentDetailsDialogProps {
  appointment: AppointmentWithSpecialist | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatStatusLabel(status: AppointmentStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' ')
}

export default function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
}: Readonly<AppointmentDetailsDialogProps>) {
  const queryClient = useQueryClient()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const cancelAppointmentMutation = useMutation({
    ...cancelAppointmentMutationOptions(),
    onMutate: async (input) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: getUpcomingAppointmentsQueryOptions().queryKey }),
        queryClient.cancelQueries({ queryKey: getAppointmentHistoryQueryOptions().queryKey }),
      ])

      const previousUpcomingAppointments = queryClient.getQueryData<
        Array<AppointmentWithSpecialist>
      >(getUpcomingAppointmentsQueryOptions().queryKey)
      const previousAppointmentHistory = queryClient.getQueryData<Array<AppointmentWithSpecialist>>(
        getAppointmentHistoryQueryOptions().queryKey,
      )

      queryClient.setQueryData<Array<AppointmentWithSpecialist>>(
        getUpcomingAppointmentsQueryOptions().queryKey,
        (current) => current?.filter((item) => item.id !== input.appointmentId) ?? [],
      )

      queryClient.setQueryData<Array<AppointmentWithSpecialist>>(
        getAppointmentHistoryQueryOptions().queryKey,
        (current) => {
          if (!appointment) {
            return current ?? []
          }

          const cancelledAppointment: AppointmentWithSpecialist = {
            ...appointment,
            status: 'cancelled',
            cancellationReason: input.reason ?? null,
          }

          const nextItems = (current ?? []).filter((item) => item.id !== input.appointmentId)

          return [cancelledAppointment, ...nextItems]
        },
      )

      return {
        previousUpcomingAppointments,
        previousAppointmentHistory,
      }
    },
    onSuccess: async () => {
      toast.success('Appointment cancelled successfully.')
      setShowCancelDialog(false)
      setCancelReason('')
      onOpenChange(false)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getUpcomingAppointmentsQueryOptions().queryKey }),
        queryClient.invalidateQueries({ queryKey: getAppointmentHistoryQueryOptions().queryKey }),
      ])
    },
    onError: (error, _input, context) => {
      if (context?.previousUpcomingAppointments) {
        queryClient.setQueryData(
          getUpcomingAppointmentsQueryOptions().queryKey,
          context.previousUpcomingAppointments,
        )
      }

      if (context?.previousAppointmentHistory) {
        queryClient.setQueryData(
          getAppointmentHistoryQueryOptions().queryKey,
          context.previousAppointmentHistory,
        )
      }

      toast.error(error.message || 'Failed to cancel appointment.')
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getUpcomingAppointmentsQueryOptions().queryKey }),
        queryClient.invalidateQueries({ queryKey: getAppointmentHistoryQueryOptions().queryKey }),
      ])
    },
  })

  const handleCancelConfirm = useCallback(async () => {
    if (!appointment) {
      return
    }

    await cancelAppointmentMutation.mutateAsync({
      appointmentId: appointment.id,
      reason: cancelReason || undefined,
    })
  }, [appointment, cancelAppointmentMutation, cancelReason])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setShowCancelDialog(false)
        setCancelReason('')
      }

      onOpenChange(nextOpen)
    },
    [onOpenChange],
  )

  if (!appointment) {
    return null
  }

  const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed'

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <User className="size-5 text-blue-600" />
              Appointment Details
            </DialogTitle>
            <DialogDescription>
              View details for your appointment with {appointment.specialist.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <User className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{appointment.specialist.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.specialist.specialistData.specialty}
                  </p>
                </div>
              </div>
              <Badge variant={statusVariants[appointment.status]}>
                {formatStatusLabel(appointment.status)}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/35 p-3">
                <Calendar className="size-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(appointment.appointmentDate.toISOString())}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/35 p-3">
                <Clock className="size-5 text-teal-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium">
                    {formatTime(appointment.appointmentDate.toISOString())}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/35 p-3">
              <Clock className="size-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{appointment.durationMinutes} minutes</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Specialist Information</p>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-4" />
                  <span>{appointment.specialist.name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{appointment.specialist.email}</span>
                </div>
              </div>
            </div>

            {appointment.notes ? (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="size-4 text-teal-600" />
                    Notes
                  </p>
                  <p className="rounded-lg border border-border/60 bg-muted/35 p-3 text-sm text-muted-foreground">
                    {appointment.notes}
                  </p>
                </div>
              </>
            ) : null}

            {appointment.cancellationReason ? (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <X className="size-4 text-destructive" />
                    Cancellation Reason
                  </p>
                  <p className="rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-muted-foreground">
                    {appointment.cancellationReason}
                  </p>
                </div>
              </>
            ) : null}
          </div>

          {canCancel ? (
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Appointment
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your appointment with{' '}
              <span className="font-semibold">{appointment.specialist.name}</span> on{' '}
              <span className="font-semibold">
                {formatDate(appointment.appointmentDate.toISOString())} at{' '}
                {formatTime(appointment.appointmentDate.toISOString())}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <label htmlFor="cancel-reason" className="text-sm font-medium">
              Reason for cancellation
            </label>
            <Textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              placeholder="Add any context for the cancellation."
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelAppointmentMutation.isPending}>
              Keep Appointment
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                void handleCancelConfirm()
              }}
              disabled={cancelAppointmentMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelAppointmentMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
