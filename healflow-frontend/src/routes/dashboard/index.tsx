import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Heart,
  Pill,
  TrendingUp,
} from "lucide-react";
import { getSessionData } from "@/lib/auth-server-fn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/")({
  loader: async () => {
    const sessionData = await getSessionData();

    if (sessionData.createdUserId && sessionData.state && sessionData.state !== "success") {
      throw redirect({
        to: "/auth/sign-up/user-data",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-green-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <Badge
            variant="blue"
            className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <Heart className="size-3 mr-1" />
            Welcome back
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Good morning! 👋</h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Your health dashboard is ready. Track your appointments, medications, and health metrics
            all in one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              asChild
              variant="secondary"
              className="bg-white text-blue-700 hover:bg-blue-50 border-0"
            >
              <Link to="/dashboard/appointments" className="flex items-center gap-2">
                <Calendar className="size-4" />
                Book Appointment
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50"
            >
              View Health Records
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group border-0 shadow-md hover:shadow-lg dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Calendar className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-md hover:shadow-lg dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Activity className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold text-green-600">92</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="size-3" /> +5 this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-md hover:shadow-lg dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Pill className="size-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">medications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-md hover:shadow-lg dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl transition-transform duration-300 group-hover:scale-110">
                <FileText className="size-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Records</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group border-0 shadow-md hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl w-fit mb-2 transition-transform duration-300 group-hover:scale-110">
              <Calendar className="size-6 text-blue-600" />
            </div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>
              Schedule and manage your upcoming appointments with healthcare providers.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              asChild
              variant="outline"
              className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 dark:group-hover:bg-blue-900/20 dark:group-hover:border-blue-700"
            >
              <Link to="/dashboard/appointments" className="flex items-center justify-center gap-2">
                View Appointments
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-md hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl w-fit mb-2 transition-transform duration-300 group-hover:scale-110">
              <Pill className="size-6 text-purple-600" />
            </div>
            <CardTitle>Medications</CardTitle>
            <CardDescription>
              Track your medications, dosages, and set reminders for refills.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              asChild
              variant="outline"
              className="w-full group-hover:bg-purple-50 group-hover:border-purple-200 dark:group-hover:bg-purple-900/20 dark:group-hover:border-purple-700"
            >
              <Link to="/dashboard/medications" className="flex items-center justify-center gap-2">
                Manage Medications
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-md hover:shadow-lg dark:hover:shadow-green-500/10 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl w-fit mb-2 transition-transform duration-300 group-hover:scale-110">
              <Activity className="size-6 text-green-600" />
            </div>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>
              Monitor your vital signs and track your health progress over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              variant="outline"
              className="w-full group-hover:bg-green-50 group-hover:border-green-200 dark:group-hover:bg-green-900/20 dark:group-hover:border-green-700"
            >
              <span className="flex items-center justify-center gap-2">
                View Metrics
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            View all
          </Button>
        </div>
        <Card className="border-0 shadow-md dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="divide-y divide-slate-100 dark:divide-slate-700 p-0">
            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="size-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Appointment with Dr. Smith</p>
                <p className="text-xs text-muted-foreground">General checkup scheduled</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />2 hours ago
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Activity className="size-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Health score updated</p>
                <p className="text-xs text-muted-foreground">Your score improved by 5 points</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                Yesterday
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Pill className="size-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Medication reminder</p>
                <p className="text-xs text-muted-foreground">Lisinopril 10mg taken</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />2 days ago
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
