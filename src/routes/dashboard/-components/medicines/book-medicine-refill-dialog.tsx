import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import type { BookMedicineRefillFormValues } from '@/schemas/medicines'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAppForm } from '@/hooks/form'
import {
  createAppointmentMutationOptions,
  getSpecialistBookingAvailabilityQueryOptions,
  getUpcomingAppointmentsQueryOptions,
} from '@/queries/appointment-queries'
import { getClientMedicinesQueryOptions } from '@/queries/medicine-queries'
import { getUserSettingsQueryOptions } from '@/queries/settings-queries'
import { primaryCareSpecialistQueryOptions } from '@/queries/specialist-queries'

import { BookMedicineRefillForm, formOpts } from './book-medicine-refill-form'

interface BookMedicationRefillDialogProps {
  medicationName?: string
  trigger?: React.ReactElement
}

function useBookingDateRange() {
  return useMemo(() => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30)

    return { startDate, endDate }
  }, [])
}

export default function BookMedicationRefillDialog({
  medicationName,
  trigger,
}: Readonly<BookMedicationRefillDialogProps>) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { startDate, endDate } = useBookingDateRange()

  const createAppointmentMutation = useMutation({
    ...createAppointmentMutationOptions(),
    onSuccess: async (_, variables) => {
      toast.success('Prescription renewal appointment created successfully.')

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getUpcomingAppointmentsQueryOptions().queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: getClientMedicinesQueryOptions().queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: getSpecialistBookingAvailabilityQueryOptions({
            specialistId: variables.specialistId,
            startDate,
            endDate,
          }).queryKey,
        }),
      ])

      form.reset()
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create renewal appointment.')
    },
  })

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }: { value: BookMedicineRefillFormValues }) => {
      await createAppointmentMutation.mutateAsync({
        specialistId: value.specialistId,
        appointmentDate: new Date(value.appointmentDate),
        notes: medicationName
          ? `Prescription renewal for ${medicationName}`
          : 'Prescription renewal',
      })
    },
  })

  const selectedSpecialistId = useStore(form.store, (state) => state.values.specialistId)
  const selectedDate = useStore(form.store, (state) => state.values.selectedDate)
  const selectedAppointmentDate = useStore(form.store, (state) => state.values.appointmentDate)

  const specialistsQuery = useQuery(primaryCareSpecialistQueryOptions)
  const userSettingsQuery = useQuery(getUserSettingsQueryOptions())
  const selectedSpecialist = specialistsQuery.data?.find(
    (specialist) => specialist.id === userSettingsQuery.data?.profile.primaryCareSpecialist,
  )

  const availabilityQuery = useQuery({
    ...getSpecialistBookingAvailabilityQueryOptions({
      specialistId: selectedSpecialistId || '',
      startDate,
      endDate,
    }),
    enabled: Boolean(selectedSpecialistId),
  })

  const bookingDays = availabilityQuery.data ?? []

  useEffect(() => {
    if (!selectedSpecialist) {
      if (selectedSpecialistId) {
        form.setFieldValue('specialistId', '')
        form.setFieldValue('selectedDate', '')
        form.setFieldValue('appointmentDate', '')
      }

      return
    }

    if (selectedSpecialistId !== selectedSpecialist.id) {
      form.setFieldValue('specialistId', selectedSpecialist.id)
      form.setFieldValue('selectedDate', '')
      form.setFieldValue('appointmentDate', '')
    }
  }, [form, selectedSpecialist, selectedSpecialistId])

  useEffect(() => {
    if (!selectedSpecialistId) {
      form.setFieldValue('selectedDate', '')
      form.setFieldValue('appointmentDate', '')
      return
    }

    if (bookingDays.length === 0) {
      if (selectedDate) {
        form.setFieldValue('selectedDate', '')
      }

      if (selectedAppointmentDate) {
        form.setFieldValue('appointmentDate', '')
      }

      return
    }

    const activeDay = bookingDays.find((day) => day.date === selectedDate)
    const hasAvailableSelectedDay =
      activeDay?.slots.some((slot) => slot.status === 'available') ?? false
    const nextSelectedDate = hasAvailableSelectedDay
      ? selectedDate
      : bookingDays.find((day) => day.slots.some((slot) => slot.status === 'available'))?.date || ''

    if (selectedDate !== nextSelectedDate) {
      form.setFieldValue('selectedDate', nextSelectedDate)
    }

    const activeSlot = bookingDays
      .flatMap((day) => day.slots)
      .find((slot) => slot.startsAt === selectedAppointmentDate && slot.status === 'available')

    if (!activeSlot) {
      form.setFieldValue('appointmentDate', '')
    }
  }, [bookingDays, form, selectedAppointmentDate, selectedDate, selectedSpecialistId])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)

      if (!open) {
        form.reset()
        createAppointmentMutation.reset()
      }
    },
    [createAppointmentMutation, form],
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ? (
            trigger
          ) : (
            <Button variant="ghost" size="sm">
              <RefreshCw className="mr-1.5 size-4" />
              Refill
            </Button>
          )
        }
      />

      <DialogContent
        className={selectedSpecialistId ? 'w-full sm:max-w-4xl xl:max-w-5xl' : 'w-full sm:max-w-xl'}
      >
        <DialogHeader>
          <DialogTitle>Schedule Prescription Renewal</DialogTitle>
          <DialogDescription>
            Book an appointment with a primary care specialist to renew your prescription or review
            your current medication.
          </DialogDescription>
        </DialogHeader>

        <BookMedicineRefillForm
          form={form}
          selectedSpecialist={selectedSpecialist}
          medicationName={medicationName}
          isSpecialistPending={specialistsQuery.isPending}
          isSpecialistError={specialistsQuery.isError}
          specialistErrorMessage={specialistsQuery.error?.message}
          onRetrySpecialist={() => void specialistsQuery.refetch()}
          bookingDays={bookingDays}
          isAvailabilityPending={availabilityQuery.isPending}
          isAvailabilityError={availabilityQuery.isError}
          availabilityErrorMessage={availabilityQuery.error?.message}
          onRetryAvailability={() => void availabilityQuery.refetch()}
          submitErrorMessage={
            createAppointmentMutation.isError ? createAppointmentMutation.error.message : undefined
          }
        />
      </DialogContent>
    </Dialog>
  )
}
