import { CalendarCheck, FileText, PieChart, Pill, Stethoscope, UserCheck } from 'lucide-react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const providerFeatures = [
  {
    title: 'Appointment command view',
    description:
      'Specialists see upcoming visits, client context, and schedule pressure in one place.',
    icon: CalendarCheck,
  },
  {
    title: 'Availability control',
    description: 'Set bookable windows so clients can schedule without manual back-and-forth.',
    icon: UserCheck,
  },
  {
    title: 'Client health context',
    description: 'Recent health metrics and score data give each visit better clinical context.',
    icon: Stethoscope,
  },
  {
    title: 'Medicine continuity',
    description:
      'Medicine and refill workflows keep care plans from stalling between appointments.',
    icon: Pill,
  },
  {
    title: 'Operational oversight',
    description: 'Admin tools support specialist creation, role management, and user maintenance.',
    icon: PieChart,
  },
  {
    title: 'Structured account data',
    description: 'Profiles, settings, and role permissions reduce ambiguity across care teams.',
    icon: FileText,
  },
]

export function ProviderFeatures() {
  return (
    <section id="providers" className="mx-auto max-w-7xl py-10 sm:py-16 lg:py-20">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-linear-to-br from-slate-950 via-blue-950 to-green-950 text-white shadow-md shadow-slate-900/10 sm:rounded-[2.25rem] dark:border-slate-700">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative border-b border-white/10 p-5 sm:p-8 lg:min-h-96 lg:border-r lg:border-b-0 lg:p-10">
            <div className="relative flex h-full flex-col justify-between gap-12">
              <div>
                <p className="text-sm font-black tracking-[0.22em] text-lime-200 uppercase">
                  Specialist operations
                </p>
                <h2 className="mt-4 max-w-xl border-none pb-0 font-heading text-3xl leading-tight font-black tracking-[-0.04em] sm:text-5xl sm:tracking-[-0.05em]">
                  Less admin fog. More visible care capacity.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">
                  Healflow gives specialists and admins a focused workspace for appointments,
                  availability, care context, and user operations.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-cyan-100/25 bg-white/10 p-5 shadow-sm shadow-slate-950/10 dark:border-cyan-200/15 dark:bg-slate-900/55">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-300">Next specialist slot</p>
                    <p className="mt-1 text-3xl font-black tracking-tight">10:45</p>
                  </div>
                  <div className="rounded-full bg-primary px-4 py-2 text-sm font-black text-primary-foreground">
                    Open
                  </div>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded-full bg-linear-to-r from-primary to-green-400" />
                </div>
                <p className="mt-3 text-sm text-slate-300">75% weekly capacity planned</p>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-cyan-200/10 md:grid-cols-2">
            {providerFeatures.map((feature) => {
              const Icon = feature.icon

              return (
                <Card
                  key={feature.title}
                  className="group rounded-none border-0 bg-white/88 p-0 text-slate-950 shadow-none hover:bg-cyan-50/90 dark:bg-slate-950/90 dark:text-white dark:hover:bg-blue-950"
                >
                  <CardHeader className="min-h-48 justify-between p-5 sm:min-h-56 sm:p-8">
                    <div className="w-fit rounded-2xl bg-cyan-100 p-3 text-cyan-700 transition-colors group-hover:bg-cyan-200 group-hover:text-slate-950 dark:bg-white/10 dark:text-cyan-200 dark:group-hover:bg-cyan-200 dark:group-hover:text-slate-950">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
