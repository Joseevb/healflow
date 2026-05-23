import { Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

import BookAppointmentDialog from './book-appointment-dialog'

export default function Header() {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/20">
            <Calendar className="size-5 text-blue-600" />
          </div>
          <h1 className="bg-linear-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:via-teal-400 dark:to-green-400">
            Appointments
          </h1>
          <Badge variant="blue" size="sm">
            Manage
          </Badge>
        </div>
        <p className="max-w-md text-muted-foreground">
          Schedule, view, and manage your upcoming and past appointments with healthcare providers.
        </p>
      </div>
      <BookAppointmentDialog />
    </header>
  )
}
