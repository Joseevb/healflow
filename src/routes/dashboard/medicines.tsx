import type { ColumnDef } from '@tanstack/react-table'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Calendar, Clock, Pill, Plus, RefreshCw } from 'lucide-react'
import { useMemo } from 'react'

import type { ClientMedicines } from '@/db/types/client-medicines.zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getClientMedicinesQueryOptions } from '@/queries/medicine-queries'

import BookMedicationRefillDialog from './-components/medicines/book-medicine-refill-dialog'
import {
  ColumnHeaderWithIcon,
  createDosageColumn,
  createMedicationNameColumn,
  createTextColumn,
  MedicationTableCard,
} from './-components/medicines/medicine-table-card'
import { StatCard } from './-components/stat-card'

export const Route = createFileRoute('/dashboard/medicines')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const qc = context.queryClient

    await Promise.allSettled([qc.ensureQueryData(getClientMedicinesQueryOptions())])
  },
})

function RouteComponent() {
  const { data: medications } = useSuspenseQuery(getClientMedicinesQueryOptions())

  const currentColumns: Array<ColumnDef<ClientMedicines>> = useMemo(
    (): Array<ColumnDef<ClientMedicines>> => [
      createMedicationNameColumn(
        'bg-blue-100 dark:bg-blue-900/30',
        'ring-blue-200/50 dark:ring-blue-800/50',
        'text-blue-600 dark:text-blue-400',
        'text-slate-900 dark:text-slate-100',
        'text-blue-600',
      ),
      createDosageColumn('blue'),
      createTextColumn(
        'frequency',
        () => <ColumnHeaderWithIcon icon={Clock} iconColor="text-blue-600" label="Frequency" />,
        'text-slate-600 dark:text-slate-300 font-medium',
      ),
      createTextColumn(
        'startDate',
        () => (
          <ColumnHeaderWithIcon icon={Calendar} iconColor="text-green-600" label="Start Date" />
        ),
        'text-slate-600 dark:text-slate-300',
      ),
      {
        accessorKey: 'endDate',
        header: 'End Date',
        cell: ({ row }) => {
          const endDate = row.original.endDate
          return endDate ? (
            <span className="text-slate-600 dark:text-slate-300">
              {endDate.toLocaleDateString()}
            </span>
          ) : (
            <Badge variant="success" size="sm" className="font-medium">
              Ongoing
            </Badge>
          )
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <BookMedicationRefillDialog
            medicationName={row.original.name}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:bg-blue-50/80 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <RefreshCw className="mr-1.5 size-4" />
                Refill
              </Button>
            }
          />
        ),
      },
    ],
    [],
  )

  const pastColumns: Array<ColumnDef<ClientMedicines>> = useMemo(
    (): Array<ColumnDef<ClientMedicines>> => [
      createMedicationNameColumn(
        'bg-teal-50 dark:bg-teal-950/20',
        'ring-teal-200/60 dark:ring-teal-900/40',
        'text-teal-600 dark:text-teal-400',
        'text-slate-600 dark:text-slate-400',
        'text-teal-600',
      ),
      createDosageColumn('secondary'),
      createTextColumn('endDate', 'Ended', 'text-slate-600 dark:text-slate-400'),
    ],
    [],
  )

  const currentMedications = medications.filter((med) => {
    if (!med.endDate) return true // No end date means currently active
    const endDate = new Date(med.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    return endDate >= today
  })

  const pastMedications = medications.filter((med) => {
    if (!med.endDate) return false // No end date means currently active, not past
    const endDate = new Date(med.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    return endDate < today
  })

  if (medications.length === 0) {
    return (
      <div className="space-y-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/20">
                <Pill className="size-5 text-blue-600" />
              </div>
              <h1 className="bg-linear-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:via-teal-400 dark:to-green-400">
                Medications
              </h1>
              <Badge variant="blue" size="sm">
                0 Active
              </Badge>
            </div>
            <p className="max-w-md text-muted-foreground">
              Track your current medications, dosages, and manage prescription refills all in one
              place.
            </p>
          </div>
          <div className="flex gap-2">
            <BookMedicationRefillDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-border/60 bg-background/80 hover:bg-background"
                >
                  <Plus className="size-4" />
                  New Prescription
                </Button>
              }
            />
          </div>
        </header>

        <Card className="border border-border/60 bg-card/95 shadow-lg">
          <CardContent className="flex flex-col items-center gap-6 px-8 py-14 text-center">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-green-100 dark:bg-green-900/20">
              <Pill className="size-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">No medications yet</h2>
              <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground">
                When you receive prescriptions or start a treatment plan, your medications and
                refill history will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-900/20">
              <Pill className="size-5 text-blue-600" />
            </div>
            <h1 className="bg-linear-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:via-teal-400 dark:to-green-400">
              Medications
            </h1>
            <Badge variant="blue" size="sm">
              {currentMedications.length} Active
            </Badge>
          </div>
          <p className="max-w-md text-muted-foreground">
            Track your current medications, dosages, and manage prescription refills all in one
            place.
          </p>
        </div>
        <div className="flex gap-2">
          <BookMedicationRefillDialog
            trigger={
              <Button
                variant="outline"
                className="border-border/60 bg-background/80 hover:bg-background"
              >
                <Plus className="size-4" />
                New Prescription
              </Button>
            }
          />
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Pill}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600"
          label="Active Medications"
          value={currentMedications.length}
        />
        <StatCard
          icon={AlertCircle}
          iconBg="bg-teal-100 dark:bg-teal-900/20"
          iconColor="text-teal-600"
          label="Needs Refill"
          value={2}
          valueColor="text-teal-600"
        />
        <StatCard
          icon={Calendar}
          iconBg="bg-teal-100 dark:bg-teal-900/20"
          iconColor="text-teal-600"
          label="Next Refill"
          value="Dec 15"
        />
      </div>

      <MedicationTableCard
        title="Current Medications"
        description="Your active prescriptions and daily medications"
        icon={Pill}
        iconBg="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        headerBg="bg-[linear-gradient(to_right,hsl(var(--card))_0%,hsl(var(--primary)/0.08)_45%,hsl(var(--card))_100%)]"
        borderColor="border-border/60"
        columns={currentColumns}
        data={currentMedications}
      />

      <MedicationTableCard
        title="Past Medications"
        description="Previously prescribed medications and treatments"
        icon={Clock}
        iconBg="bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
        headerBg="bg-[linear-gradient(to_right,hsl(var(--card))_0%,hsl(var(--primary)/0.06)_45%,hsl(var(--card))_100%)]"
        borderColor="border-border/60"
        columns={pastColumns}
        data={pastMedications}
      />
    </div>
  )
}
