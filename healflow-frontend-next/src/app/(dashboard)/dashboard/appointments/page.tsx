"use client";

import { Separator } from "@/components/ui/separator";
import Header from "./components/header";
import UpcomingAppointments from "./components/upcoming-appointments";
import AppointmentHistory from "./components/appointment-history";
import { Spinner } from "@/components/ui/spinner";
import { AppointmentResponse } from "@/client";
import { useQuery } from "@tanstack/react-query";
import {
	getPastAppointmentsOptions,
	getUpcomingAppointmentsOptions,
} from "@/client/@tanstack/react-query.gen";

const statusColors = {
	CONFIRMED: "bg-green-500/10 text-green-700 dark:text-green-400",
	PENDING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
	COMPLETED: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
	CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400",
	NO_SHOW: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
} as const satisfies Record<AppointmentResponse["status"], string>;

export default function AppointmentsPage() {
	const {
		data: upcomingAppointments,
		isLoading: isLoadingUpcomingAppointments,
	} = useQuery(getUpcomingAppointmentsOptions());

	const { data: appointmentHistory, isLoading: isLoadingAppointmentHistory } =
		useQuery(getPastAppointmentsOptions());

	return (
		<div className="space-y-6">
			<Header />

			<Separator className="my-8" />

			{isLoadingUpcomingAppointments ? (
				<span className="text-sm text-muted-foreground flex gap-2 items-center justify-center">
					<Spinner />
					Loading upcoming appointments...
				</span>
			) : (
				<UpcomingAppointments
					upcomingAppointments={upcomingAppointments || []}
					statusColors={statusColors}
				/>
			)}

			{isLoadingAppointmentHistory ? (
				<span className="text-sm text-muted-foreground flex gap-2 items-center justify-center">
					<Spinner />
					Loading Appointment History...
				</span>
			) : (
				<AppointmentHistory
					appointmentHistory={appointmentHistory || []}
					statusColors={statusColors}
				/>
			)}
		</div>
	);
}
