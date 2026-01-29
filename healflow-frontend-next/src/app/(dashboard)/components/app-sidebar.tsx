import { Calendar, Home, Pill, Settings } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";

const BASE_URL = "/dashboard";

const items = [
	{
		title: "Home",
		url: `${BASE_URL}`,
		icon: Home,
	},
	{
		title: "Appointments",
		url: `${BASE_URL}/appointments`,
		icon: Calendar,
	},
	{
		title: "Medications",
		url: `${BASE_URL}/medications`,
		icon: Pill,
	},
	{
		title: "Settings",
		url: `${BASE_URL}/settings`,
		icon: Settings,
	},
] as const;

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" className="**:overflow-y-hidden">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<ModeToggle />
			</SidebarFooter>
		</Sidebar>
	);
}