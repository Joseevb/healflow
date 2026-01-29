import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="relative flex min-h-svh w-full flex-1 flex-col overflow-hidden bg-sidebar pt-2 transition-all duration-200 ease-linear md:pr-2 overflow-x-hidden">
				<div className="flex h-full flex-1 flex-col overflow-auto rounded-t-2xl border-x border-t bg-background shadow-sm">
					<div className="p-4 overflow-y-auto">
						<SidebarTrigger className="mb-4" />
						{children}
					</div>
				</div>
			</main>
		</SidebarProvider>
	);
}
