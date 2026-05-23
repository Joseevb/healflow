import * as z from 'zod'

export const bookMedicineRefillSchema = z.object({
  specialistId: z.string().trim().min(1, 'No primary care specialist is available right now.'),
  selectedDate: z.string().trim().min(1, 'Please select a day.'),
  appointmentDate: z.string().trim().min(1, 'Please select an appointment time.'),
})

export type BookMedicineRefillFormValues = z.infer<typeof bookMedicineRefillSchema>
