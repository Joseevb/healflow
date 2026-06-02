import { Activity, CalendarClock, Pill, Stethoscope } from 'lucide-react'

const stats = [
  {
    value: '4',
    label: 'connected care areas',
    detail: 'appointments, medicines, metrics, records',
    icon: Activity,
  },
  {
    value: '3',
    label: 'role-aware workspaces',
    detail: 'client, specialist, and admin dashboards',
    icon: Stethoscope,
  },
  {
    value: '30d',
    label: 'metric trend window',
    detail: 'recent vitals become visible patterns',
    icon: CalendarClock,
  },
  {
    value: '1',
    label: 'medicine refill flow',
    detail: 'active prescriptions stay actionable',
    icon: Pill,
  },
]

export function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl py-8 sm:py-10">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="font-heading text-4xl font-black tracking-[-0.08em] text-slate-950 dark:text-white">
                  {stat.value}
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary dark:bg-primary/20 dark:text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-base font-black tracking-tight">{stat.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {stat.detail}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
