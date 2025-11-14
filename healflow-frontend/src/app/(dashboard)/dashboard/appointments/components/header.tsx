
import BookAppointmentDialog from "./book-appointment-dialog";

export default function Header() {
	return (
		<header className="flex items-center justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
				<p className="text-muted-foreground">
					Manage your upcoming and past appointments
				</p>
			</div>
			<BookAppointmentDialog />
		</header>
	);
}
