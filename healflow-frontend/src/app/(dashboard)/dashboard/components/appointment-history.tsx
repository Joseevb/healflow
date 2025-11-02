import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { AppointmentResponse } from "@/api/schemas";

interface AppointmentHistoryProps {
	appointmentHistory: AppointmentResponse[];
	statusColors: Record<AppointmentResponse["status"], string>;
}

export default function AppointmentHistory({
	appointmentHistory,
	statusColors,
}: Readonly<AppointmentHistoryProps>) {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-2xl font-semibold tracking-tight">
					Appointment History
				</h2>
				<p className="text-sm text-muted-foreground">
					Your past appointments and records
				</p>
			</div>

			<div className="space-y-3">
				{appointmentHistory.map((appointment) => (
					<Card key={appointment.id}>
						<CardContent className="flex items-center justify-between p-4">
							<div className="flex items-center gap-4">
								<div className="flex size-10 items-center justify-center rounded-full bg-muted">
									<User className="size-5 text-muted-foreground" />
								</div>
								<div className="space-y-1">
									<p className="font-medium leading-none">
										{appointment.specialist.name}
									</p>
									<p className="text-sm text-muted-foreground">
										{appointment.specialist.specialty}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-6 text-sm text-muted-foreground">
								<div className="hidden items-center gap-2 sm:flex">
									<Calendar className="size-4" />
									<span>
										{new Date(
											appointment.appointment_date,
										).toLocaleDateString()}
									</span>
								</div>
								<div className="hidden items-center gap-2 md:flex">
									<Clock className="size-4" />
									<span>
										{new Date(
											appointment.appointment_date,
										).toLocaleTimeString()}
									</span>
								</div>
								<Badge
									variant="secondary"
									className={statusColors[appointment.status]}
								>
									{appointment.status}
								</Badge>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
