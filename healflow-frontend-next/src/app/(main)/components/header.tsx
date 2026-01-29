"use client";

import {
	NavItem,
	NavItemCustomComponent,
	DynamicNavigationHeader,
} from "@/components/ui/dynamic-navigation-header";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { UserIcon, HomeIcon, Settings, LogOutIcon } from "lucide-react";
import {
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";

type UserMenuItemBase = {
	label: string;
	icon?: React.ReactNode;
	variant?: "default" | "destructive";
};

type UserMenuItemLink = UserMenuItemBase & {
	type: "link";
	url: string;
};

type UserMenuButton = UserMenuItemBase & {
	type: "button";
	asChild?: boolean;
	onClick: () => void;
};

type UserMenuItem = UserMenuItemLink | UserMenuButton;

const userMenuItems: UserMenuItem[] = [
	{
		type: "link",
		url: "/dashboard",
		label: "Dashboard",
		icon: <HomeIcon className="h-4 w-4" />,
	},
	{
		type: "link",
		url: "/settings",
		label: "Settings",
		icon: <Settings className="h-4 w-4" />,
	},
	{
		type: "button",
		label: "Sign out",
		variant: "destructive",
		onClick: () => signOut(),
		icon: <LogOutIcon className="h-4 w-4" />,
	},
];

function getNavItems(isAuthenticated: boolean): NavItem[] {
	const baseNavItems: NavItem[] = [
		{
			type: "dropdown",
			name: "Appointments",
			children: [
				{
					type: "highlight",
					name: "Book appointment",
					href: "/",
					description: "Book an appointment with a doctor",
					subtitle: "Featured",
				},
				{
					type: "link",
					name: "History",
					href: "/docs",
					description: "View appointment history",
				},
			],
		},
		{
			type: "custom",
			name: "Mode toggle",
			component: <ModeToggle />,
		},
	];

	const authNavItem: NavItemCustomComponent = {
		type: "custom",
		name: "Auth",
		component: isAuthenticated ? (
			<div className="ml-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="default" size={"icon"}>
							<UserIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{userMenuItems.map((item) => (
							<DropdownMenuItem
								key={item.label}
								variant={item.variant ?? "default"}
								asChild
							>
								{item.type === "link" ? (
									<Link href={item.url} className="size-full">
										{item.icon && <span className="mr-2">{item.icon}</span>}
										{item.label}
									</Link>
								) : (
									<Button
										variant="ghost"
										className="size-full justify-start"
										onClick={item.onClick}
									>
										{item.icon && <span className="mr-2">{item.icon}</span>}
										{item.label}
									</Button>
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		) : (
			<NavigationMenuLink
				asChild
				className={cn(navigationMenuTriggerStyle(), "ml-2")}
			>
				<Button asChild variant={"outline"}>
					<Link href="/auth" className="flex items-center flex-row gap-1">
						<UserIcon className="h-4 w-4" />
						Sign in
					</Link>
				</Button>
			</NavigationMenuLink>
		),
	};

	return [...baseNavItems, authNavItem];
}

export default function HeaderWrapper() {
	const { data: session } = useSession();
	const isAuthenticated = session !== null && session.user !== undefined;
	const token = authClient.token().then((token) => token.data);

	useEffect(() => {
		console.log(session, isAuthenticated);
	}, [isAuthenticated, session, token]);

	const applicationNavItems = getNavItems(isAuthenticated);

	return (
		<DynamicNavigationHeader
			navItems={applicationNavItems}
			className="bg-gradient-to-br from-slate-100/90 via-blue-50/90 to-green-50/90 dark:from-slate-900/90 dark:via-blue-950/90 dark:to-green-950/75 fixed w-full z-50"
		/>
	);
}
