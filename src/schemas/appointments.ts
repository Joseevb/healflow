import * as z from 'zod'

export const bookAppointmentSchema = z.object({
  specialistId: z.string().trim().min(1, 'Please select a specialist.'),
  selectedDate: z.string().trim().min(1, 'Please select a day.'),
  appointmentDate: z.string().trim().min(1, 'Please select an appointment time.'),
  notes: z.string().trim().max(1000, 'Notes must be 1000 characters or less.'),
})

export type BookAppointmentFormValues = z.infer<typeof bookAppointmentSchema>
