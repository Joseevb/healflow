import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AlertCircle, Calendar, Clock, Pill, RefreshCw } from "lucide-react";
import BookAppointmentDialog from "./-components/book-appointment-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import type { UserMedicinesResponse } from "@/client";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/medications")({
  component: RouteComponent,
});

const mockMedications: Array<UserMedicinesResponse> = [
  {
    medicine_name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    start_date: new Date("2024-01-01").toLocaleDateString(),
  },
  {
    medicine_name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    start_date: new Date("2023-06-01").toLocaleDateString(),
    end_date: new Date("2023-07-01").toLocaleDateString(),
  },
  {
    medicine_name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once daily",
    start_date: new Date("2024-03-01").toLocaleDateString(),
  },
  {
    medicine_name: "Simvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    start_date: new Date("2023-01-01").toLocaleDateString(),
    end_date: new Date("2024-01-01").toLocaleDateString(),
  },
  {
    medicine_name: "Paracetamol",
    dosage: "1000mg",
    frequency: "Once daily",
    start_date: new Date("2023-01-01").toLocaleDateString(),
    end_date: new Date("2025-11-29").toLocaleDateString(),
  },
];

function RouteComponent() {
  const medications = mockMedications;
  // const { data } = useQuery(getUserMedicinesOptions())

  const currentColumns: Array<ColumnDef<UserMedicinesResponse>> = useMemo(
    (): Array<ColumnDef<UserMedicinesResponse>> => [
      {
        accessorKey: "medicine_name",
        header: () => (
          <span className="flex items-center gap-2">
            <Pill className="size-4 text-purple-600" />
            Medication
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Pill className="size-4 text-purple-600" />
            </div>
            <span className="font-medium">{row.getValue("medicine_name")}</span>
          </div>
        ),
      },
      {
        accessorKey: "dosage",
        header: "Dosage",
        cell: ({ row }) => (
          <Badge variant="purple" size="sm">
            {row.getValue("dosage")}
          </Badge>
        ),
      },
      {
        accessorKey: "frequency",
        header: () => (
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-blue-600" />
            Frequency
          </span>
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.getValue("frequency")}</span>
        ),
      },
      {
        accessorKey: "start_date",
        header: () => (
          <span className="flex items-center gap-2">
            <Calendar className="size-4 text-green-600" />
            Start Date
          </span>
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.getValue("start_date")}</span>
        ),
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => {
          const endDate = row.original.end_date;
          return endDate ? (
            <span className="text-muted-foreground">{endDate}</span>
          ) : (
            <Badge variant="success" size="sm">
              Ongoing
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <RefreshCw className="size-4 mr-1.5" />
            Refill
          </Button>
        ),
      },
    ],
    [],
  );

  const pastColumns: Array<ColumnDef<UserMedicinesResponse>> = useMemo(
    (): Array<ColumnDef<UserMedicinesResponse>> => [
      {
        accessorKey: "medicine_name",
        header: () => (
          <span className="flex items-center gap-2">
            <Pill className="size-4 text-slate-500" />
            Medication
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
              <Pill className="size-4 text-slate-500" />
            </div>
            <span className="font-medium text-muted-foreground">
              {row.getValue("medicine_name")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "dosage",
        header: "Dosage",
        cell: ({ row }) => (
          <Badge variant="secondary" size="sm">
            {row.getValue("dosage")}
          </Badge>
        ),
      },
      {
        accessorKey: "end_date",
        header: "Ended",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.getValue("end_date")}</span>
        ),
      },
    ],
    [],
  );

  const currentMedications = medications.filter((med) => new Date(med.end_date!) <= new Date());

  const pastMedications = medications.filter((med) => new Date(med.end_date!) > new Date());

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Pill className="size-5 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-purple-600 via-purple-800 to-purple-600 dark:from-purple-400 dark:via-purple-500 dark:to-purple-400 bg-clip-text text-transparent">
              Medications
            </h1>
            <Badge variant="purple" size="sm">
              {currentMedications.length} Active
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-md">
            Track your current medications, dosages, and manage prescription refills all in one
            place.
          </p>
        </div>
        <BookAppointmentDialog />
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group border-0 shadow-md hover:shadow-lg dark:bg-slate-800 dark:border-slate-700 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Pill className="size-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Medications</p>
                <p className="text-2xl font-bold">{currentMedications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-md hover:shadow-lg dark:bg-slate-800 dark:border-slate-700 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl transition-transform duration-300 group-hover:scale-110">
                <AlertCircle className="size-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Needs Refill</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-md hover:shadow-lg dark:bg-slate-800 dark:border-slate-700 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Calendar className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Refill</p>
                <p className="text-2xl font-bold">Dec 15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Medications Table */}
      <Card className="border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700 overflow-hidden">
        <CardHeader className="bg-linear-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border-b border-purple-100 dark:border-purple-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Pill className="size-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Current Medications</CardTitle>
              <CardDescription>Your active prescriptions and daily medications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={currentColumns} data={currentMedications} />
        </CardContent>
      </Card>

      {/* Past Medications Table */}
      <Card className="border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700 overflow-hidden">
        <CardHeader className="bg-linear-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
              <Clock className="size-5 text-slate-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Past Medications</CardTitle>
              <CardDescription>Previously prescribed medications and treatments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={pastColumns} data={pastMedications} />
        </CardContent>
      </Card>
    </div>
  );
}
