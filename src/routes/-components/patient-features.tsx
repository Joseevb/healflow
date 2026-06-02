import { Activity, Calendar, FileText, Pill, Shield, TrendingUp } from 'lucide-react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const patientFeatures = [
  {
    title: 'Book care without phone tag',
    description:
      'Find specialist availability, schedule appointments, and keep every upcoming visit visible from the client dashboard.',
    icon: Calendar,
    accent: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200',
  },
  {
    title: 'Track health signals over time',
    description:
      'Record vitals and wellness metrics so isolated readings become a readable health timeline.',
    icon: Activity,
    accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200',
  },
  {
    title: 'Turn scores into next actions',
    description:
      'Latest health score and recent activity summarize what changed and what needs attention next.',
    icon: TrendingUp,
    accent: 'bg-lime-100 text-lime-700 dark:bg-lime-400/10 dark:text-lime-200',
  },
  {
    title: 'Keep medicines in motion',
    description:
      'Manage active medicines and request refills before treatment continuity becomes urgent.',
    icon: Pill,
    accent: 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200',
  },
  {
    title: 'Centralize care records',
    description:
      'Bring appointments, metrics, medicine context, and account details into one organized profile.',
    icon: FileText,
    accent: 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200',
  },
  {
    title: 'Protected by default',
    description:
      'Authentication, role-aware access, and account controls keep personal health workflows guarded.',
    icon: Shield,
    accent: 'bg-teal-100 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200',
  },
]

export function PatientFeatures() {
  return (
    <section id="features" className="mx-auto max-w-7xl py-10 sm:py-16 lg:py-20">
      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-10">
        <div>
          <p className="text-sm font-black tracking-[0.22em] text-cyan-700 uppercase dark:text-cyan-300">
            Client workspace
          </p>
          <h2 className="mt-4 max-w-xl border-none pb-0 font-heading text-3xl leading-tight font-black tracking-[-0.04em] sm:text-5xl sm:tracking-[-0.05em]">
            Every personal care task, arranged by what needs attention.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8 dark:text-slate-300">
            The homepage now mirrors the product itself: appointments, medicines, metrics, and
            profile settings are treated as connected care operations instead of disconnected tools.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {patientFeatures.map((feature, index) => {
            const Icon = feature.icon

            return (
              <Card
                key={feature.title}
                className={`overflow-hidden border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 ${
                  index === 0 ? 'md:rounded-tl-[2.5rem]' : ''
                } ${index === 5 ? 'md:rounded-br-[2.5rem]' : ''}`}
              >
                <CardHeader className="p-5 sm:p-6">
                  <div className={`mb-4 w-fit rounded-2xl p-3 sm:mb-5 ${feature.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-black tracking-tight sm:text-xl">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6 sm:text-base sm:leading-7">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
