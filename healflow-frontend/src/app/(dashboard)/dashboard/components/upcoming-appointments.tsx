import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { AppointmentResponse } from "@/api/schemas";

interface UpcomingAppointmentsProps {
	upcomingAppointments: AppointmentResponse[];
	statusColors: Record<AppointmentResponse["status"], string>;
}

export default function UpcomingAppointments({
	upcomingAppointments,
	statusColors,
}: Readonly<UpcomingAppointmentsProps>) {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">
					Upcoming Appointments
				</h2>
				<p className="text-sm text-muted-foreground">
					You have {upcomingAppointments.length} upcoming appointment
					{upcomingAppointments.length !== 1 ? "s" : ""}
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{upcomingAppointments.map((appointment) => (
					<Card key={appointment.id} className="overflow-hidden">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<CardTitle className="text-xl">
										{appointment.specialist.name}
									</CardTitle>
									<CardDescription>
										{appointment.specialist.specialty}
									</CardDescription>
								</div>
								<Badge
									variant="secondary"
									className={statusColors[appointment.status]}
								>
									{appointment.status}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex items-center text-sm text-muted-foreground">
								<Calendar className="mr-2 size-4" />
								{new Date(appointment.appointment_date).toLocaleDateString()}
							</div>
							<div className="flex items-center text-sm text-muted-foreground">
								<Clock className="mr-2 size-4" />
								{new Date(appointment.appointment_date).toLocaleTimeString()}
							</div>
							<div className="pt-2">
								<Button variant="outline" className="w-full">
									View Details
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
