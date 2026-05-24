import type { ColumnDef } from '@tanstack/react-table'
import type { LucideIcon } from 'lucide-react'

import { Pill } from 'lucide-react'

import type { ClientMedicines } from '@/db/types/client-medicines.zod'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type MedicationIconCellProps = {
  name: string
  iconBg: string
  iconRing: string
  iconColor: string
  textColor: string
}

export function MedicationIconCell({
  name,
  iconBg,
  iconRing,
  iconColor,
  textColor,
}: MedicationIconCellProps) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className={`rounded-xl p-2.5 ring-1 ${iconBg} ${iconRing}`}>
        <Pill className={`size-4 ${iconColor}`} />
      </div>
      <span className={`font-semibold ${textColor}`}>{name}</span>
    </div>
  )
}

type ColumnHeaderWithIconProps = {
  icon: LucideIcon
  iconColor: string
  label: string
}

export function ColumnHeaderWithIcon({ icon: Icon, iconColor, label }: ColumnHeaderWithIconProps) {
  return (
    <span className="flex items-center gap-2">
      <Icon className={`size-4 ${iconColor}`} />
      {label}
    </span>
  )
}

export function createMedicationNameColumn(
  iconBg: string,
  iconRing: string,
  iconColor: string,
  textColor: string,
  headerIconColor: string,
): ColumnDef<ClientMedicines> {
  return {
    accessorKey: 'name',
    header: () => (
      <ColumnHeaderWithIcon icon={Pill} iconColor={headerIconColor} label="Medication" />
    ),
    cell: ({ row }) => (
      <MedicationIconCell
        name={row.getValue('name')}
        iconBg={iconBg}
        iconRing={iconRing}
        iconColor={iconColor}
        textColor={textColor}
      />
    ),
  }
}

export function createDosageColumn(variant: 'blue' | 'secondary'): ColumnDef<ClientMedicines> {
  return {
    accessorKey: 'dosage',
    header: 'Dosage',
    cell: ({ row }) => (
      <Badge variant={variant} size="sm" className="font-medium">
        {row.getValue('dosage')}
      </Badge>
    ),
  }
}

export function createTextColumn(
  key: keyof ClientMedicines,
  header: string | (() => React.ReactElement),
  textColor: string,
): ColumnDef<ClientMedicines> {
  return {
    accessorKey: key,
    header,
    cell: ({ row }) => {
      const value = row.getValue(key)

      return (
        <span className={textColor}>
          {value instanceof Date ? value.toLocaleDateString() : String(value ?? '')}
        </span>
      )
    },
  }
}

type MedicationTableCardProps = {
  title: string
  description: string
  icon: LucideIcon
  iconBg: string
  headerBg: string
  borderColor: string
  columns: Array<ColumnDef<ClientMedicines>>
  data: Array<ClientMedicines>
}

export function MedicationTableCard({
  title,
  description,
  icon: Icon,
  iconBg,
  headerBg,
  borderColor,
  columns,
  data,
}: MedicationTableCardProps) {
  return (
    <Card className="overflow-hidden border border-border/60 bg-card/95 p-0 shadow-lg dark:shadow-slate-900/50">
      <CardHeader className={`rounded-t-xl border-b px-6 py-6 ${headerBg} ${borderColor}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${iconBg}`}>
            <Icon className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  )
}
