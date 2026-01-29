"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Medication {
	id: string;
	name: string;
	dosage: string;
	frequency: string;
	startDate: Date;
	endDate?: Date;
	status: "active" | "past";
	doctor: string;
}

// Mock data
const mockMedications: Medication[] = [
	{
		id: "1",
		name: "Lisinopril",
		dosage: "10mg",
		frequency: "Once daily",
		startDate: new Date("2024-01-01"),
		status: "active",
		doctor: "Dr. Smith",
	},
	{
		id: "2",
		name: "Metformin",
		dosage: "500mg",
		frequency: "Twice daily",
		startDate: new Date("2023-06-01"),
		endDate: new Date("2024-06-01"),
		status: "past",
		doctor: "Dr. Johnson",
	},
	{
		id: "3",
		name: "Amlodipine",
		dosage: "5mg",
		frequency: "Once daily",
		startDate: new Date("2024-03-01"),
		status: "active",
		doctor: "Dr. Lee",
	},
	{
		id: "4",
		name: "Simvastatin",
		dosage: "20mg",
		frequency: "Once daily",
		startDate: new Date("2023-01-01"),
		endDate: new Date("2024-01-01"),
		status: "past",
		doctor: "Dr. Patel",
	},
];

export default function MedicationsPage() {
	const [medications] = useState<Medication[]>(mockMedications);

	// Columns for current medications table
	const currentColumns: ColumnDef<Medication>[] = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Medication Name",
			},
			{
				accessorKey: "dosage",
				header: "Dosage",
			},
			{
				accessorKey: "frequency",
				header: "Frequency",
			},
			{
				accessorKey: "startDate",
				header: "Start Date",
				cell: ({ getValue }) => new Date(getValue<Date>()).toLocaleDateString(),
			},
			{
				accessorKey: "doctor",
				header: "Prescribing Doctor",
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleRenewAppointment(row.original)}
					>
						Renew Appointment
					</Button>
				),
			},
		],
		[],
	);

	// Columns for past medications table
	const pastColumns: ColumnDef<Medication>[] = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Medication Name",
			},
			{
				accessorKey: "dosage",
				header: "Dosage",
			},
			{
				accessorKey: "startDate",
				header: "Start Date",
				cell: ({ getValue }) => new Date(getValue<Date>()).toLocaleDateString(),
			},
			{
				accessorKey: "endDate",
				header: "End Date",
				cell: ({ getValue }) =>
					getValue<Date>()
						? new Date(getValue<Date>()).toLocaleDateString()
						: "Ongoing",
			},
			{
				accessorKey: "doctor",
				header: "Prescribing Doctor",
			},
		],
		[],
	);

	const currentMedications = medications.filter(
		(med) => med.status === "active",
	);
	const pastMedications = medications.filter((med) => med.status === "past");

	const handleRenewAppointment = (medication: Medication) => {
		// Mock: Navigate to appointment booking or open dialog
		console.log("Renew appointment for:", medication.name);
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Medications</h1>
				<Button>Add New Medication</Button> {/* Optional: Link to add form */}
			</div>

			{/* Current Medications Table */}
			<Card>
				<CardHeader>
					<CardTitle>Current Medications</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTable columns={currentColumns} data={currentMedications} />
				</CardContent>
			</Card>

			{/* Past Medications Section */}
			<Card>
				<CardHeader>
					<CardTitle>Past Medications</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTable columns={pastColumns} data={pastMedications} />
				</CardContent>
			</Card>
		</div>
	);
}
