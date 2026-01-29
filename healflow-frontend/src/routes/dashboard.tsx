import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Activity, Calendar, FileText, Home, LogOut, Pill, Settings, User } from "lucide-react";
import type { SidebarItems } from "@/components/app-sidebar";
import type { RoutePath } from "@/types/routes";
import { SidebarInset, SidebarProvider } from "@/components/animate-ui/components/radix/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { signOut } from "@/lib/auth-client";
import { getServerSession } from "@/server/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getServerSession();

    if (!session?.session) {
      console.warn("No active session found, redirecting to auth");
      throw redirect({
        to: "/auth",
      });
    }

    return {
      hideHeader: true,
      session,
    };
  },
  component: DashboardLayout,
});

const sidebarItems = (_baseUrl: RoutePath): SidebarItems => [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Appointments",
    icon: Calendar,
    url: "/dashboard/appointments",
  },
  {
    title: "Medications",
    icon: Pill,
    url: "/dashboard/medications",
  },
  {
    title: "Health Metrics",
    icon: Activity,
    url: "/dashboard" as RoutePath,
  },
  {
    title: "Medical Records",
    icon: FileText,
    url: "/dashboard" as RoutePath,
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard" as RoutePath,
  },
];

function UserMenu() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-6 hover:bg-sidebar-accent"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-medium">
            JD
          </div>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">john.doe@example.com</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="size-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="size-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            await navigate({ to: "/" });
          }}
          className="text-red-600 dark:text-red-400"
        >
          <LogOut className="size-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          renderTrigger={true}
          baseUrl="/dashboard"
          items={sidebarItems}
          footer={<UserMenu />}
        />
        <SidebarInset className="bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
