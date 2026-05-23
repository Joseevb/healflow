import type { LucideIcon } from 'lucide-react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { subDays } from 'date-fns'
import { Activity, Calendar, FileText, Pill } from 'lucide-react'
import { useMemo } from 'react'
import * as z from 'zod'

import { Card, CardContent } from '@/components/ui/card'
import { formatMetricTitle, formatRelativeTime } from '@/lib/utils'
import { getUpcomingAppointmentsQueryOptions } from '@/queries/appointment-queries'
import {
  getClientMetricsQueryOptions,
  getRecentClientMetricsQueryOptions,
} from '@/queries/health-metrics-queries'
import { getClientLatestHealthScoreQueryOptions } from '@/queries/health-score-queries'
import { getClientMedicinesQueryOptions } from '@/queries/medicine-queries'

import { ActivityItem } from './-components/activity-item'
import { ErrorComponent } from './-components/error-component'
import { Loader } from './-components/loader'
import { QuickActionCard } from './-components/quick-action-card'
import { SectionHeader } from './-components/section-header'
import { StatCard } from './-components/stat-card'
import { WelcomeHero } from './-components/welcome-hero'

const dashboardSearchSchema = z.object({
  debugError: z.enum(['generic', 'unauthorized', 'forbidden', 'connection']).optional(),
})

function throwDebugError(debugError: z.infer<typeof dashboardSearchSchema>['debugError']) {
  if (!import.meta.env.DEV || !debugError) return

  switch (debugError) {
    case 'generic':
      throw new Error('Debug dashboard loader failure')
    case 'unauthorized':
      throw Object.assign(new Error('Unauthorized'), { status: 401 })
    case 'forbidden':
      throw Object.assign(new Error('Forbidden'), { status: 403 })
    case 'connection':
      throw new DOMException('The connection was closed.', 'AbortError')
  }
}

export const Route = createFileRoute('/dashboard/')({
  validateSearch: dashboardSearchSchema,
  component: RouteComponent,
  pendingComponent: Loader,
  errorComponent: ErrorComponent,
  loader: ({ context: { queryClient }, location }) => {
    const recentMetricsTo = new Date()
    const recentMetricsFrom = subDays(recentMetricsTo, 30)
    const search = dashboardSearchSchema.parse(location.search)

    throwDebugError(search.debugError)

    const preload = Promise.all([
      queryClient.ensureQueryData(getClientLatestHealthScoreQueryOptions()),
      queryClient.ensureQueryData(getUpcomingAppointmentsQueryOptions()),
      queryClient.ensureQueryData(getClientMedicinesQueryOptions()),
      queryClient.ensureQueryData(getClientMetricsQueryOptions()),
      queryClient.ensureQueryData(
        getRecentClientMetricsQueryOptions({
          from: recentMetricsFrom,
          to: recentMetricsTo,
        }),
      ),
    ])

    return {
      preload,
      recentMetricsFrom: recentMetricsFrom.toISOString(),
      recentMetricsTo: recentMetricsTo.toISOString(),
    }
  },
})

function RouteComponent() {
  const { preload, recentMetricsFrom, recentMetricsTo } = Route.useLoaderData()
  const recentMetricsRange = {
    from: new Date(recentMetricsFrom),
    to: new Date(recentMetricsTo),
  }

  void preload

  return <Dashboard recentMetricsRange={recentMetricsRange} />
}

type DashboardActivity = {
  type: 'appointment' | 'metric'
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  description: string
  timestamp: string
  rawTimestamp: string
}

function Dashboard({ recentMetricsRange }: { recentMetricsRange: { from: Date; to: Date } }) {
  const { data: appointments } = useSuspenseQuery(getUpcomingAppointmentsQueryOptions())
  const { data: medicines } = useSuspenseQuery(getClientMedicinesQueryOptions())
  const { data: score } = useSuspenseQuery(getClientLatestHealthScoreQueryOptions())
  const { data: recentMetrics } = useSuspenseQuery(
    getRecentClientMetricsQueryOptions(recentMetricsRange),
  )

  const stats = useMemo(
    () => ({
      appointmentsCount: appointments.length,
      healthScore: score ? score.overallScore : 0,
      hasHealthScore: !!score,
      medicinesCount: medicines.length,
      metricsCount: recentMetrics.length,
      documentsCount: 12,
    }),
    [appointments, score, medicines, recentMetrics],
  )

  const recentActivity = useMemo(() => {
    const activities: Array<DashboardActivity> = []

    appointments.slice(0, 2).forEach((apt) => {
      activities.push({
        type: 'appointment',
        icon: Calendar,
        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        iconColor: 'text-blue-600',
        title: `Appointment with ${apt.specialist?.name ?? 'specialist pending'}`,
        description:
          apt.specialist?.specialistData.specialty ?? 'Specialist information unavailable',
        timestamp: formatRelativeTime(apt.appointmentDate.toISOString()),
        rawTimestamp: apt.appointmentDate.toISOString(),
      })
    })

    recentMetrics.slice(0, 5).forEach((metric) => {
      activities.push({
        type: 'metric',
        icon: Activity,
        iconBg: 'bg-green-100 dark:bg-green-900/20',
        iconColor: 'text-green-600',
        title: `${formatMetricTitle(metric.metricType)} recorded`,
        description: `${metric.value} ${metric.unit}`,
        timestamp: formatRelativeTime(metric.createdAt.toISOString()),
        rawTimestamp: metric.createdAt.toISOString(),
      })
    })

    return activities
      .sort((a, b) => new Date(b.rawTimestamp).getTime() - new Date(a.rawTimestamp).getTime())
      .slice(0, 5)
  }, [appointments, recentMetrics])

  return (
    <div className="space-y-8">
      <WelcomeHero />

      {/* Stats Grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600"
          label="Upcoming"
          value={stats.appointmentsCount}
          sublabel="appointments"
        />
        <StatCard
          icon={Activity}
          iconBg="bg-teal-100 dark:bg-teal-900/20"
          iconColor="text-teal-600"
          label="Health Score"
          value={stats.hasHealthScore ? stats.healthScore : '--'}
          sublabel={stats.hasHealthScore ? undefined : 'No data yet'}
        />
        <StatCard
          icon={Pill}
          iconBg="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600"
          label="Active"
          value={stats.medicinesCount}
          sublabel="medications"
        />
        <StatCard
          icon={FileText}
          iconBg="bg-cyan-100 dark:bg-cyan-900/20"
          iconColor="text-cyan-600"
          label="Records"
          value={stats.documentsCount}
          sublabel="documents"
        />
      </section>

      {/* Quick Actions */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          icon={Calendar}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600"
          title="Appointments"
          description="Schedule and manage your upcoming appointments with healthcare providers."
          linkTo="/dashboard/appointments"
          colorScheme="blue"
          buttonLabel="View Appointments"
        />
        <QuickActionCard
          icon={Pill}
          iconBg="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600"
          title="Medications"
          description="Track your medications, dosages, and set reminders for refills."
          linkTo="/dashboard/medicines"
          colorScheme="green"
          buttonLabel="Manage Medications"
        />
        <QuickActionCard
          icon={Activity}
          iconBg="bg-teal-100 dark:bg-teal-900/20"
          iconColor="text-teal-600"
          title="Health Metrics"
          description="Monitor your vital signs and track your health progress over time."
          linkTo="/dashboard/health-metrics"
          colorScheme="teal"
          buttonLabel="View Metrics"
        />
      </section>

      {/* Recent Activity */}
      <section>
        <SectionHeader title="Recent Activity" />
        <Card className="border border-border/60 bg-card/95 p-0 shadow-md">
          <CardContent className="m-0 divide-y divide-slate-100 p-0 dark:divide-slate-700">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <ActivityItem
                  key={`${activity.type}-${activity.rawTimestamp}-${activity.title}`}
                  {...activity}
                />
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Activity className="mx-auto mb-3 size-12 opacity-50" />
                <p className="font-medium">No recent activity</p>
                <p className="text-sm">Your recent health activities will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
