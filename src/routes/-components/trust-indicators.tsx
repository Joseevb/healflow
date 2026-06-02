import { Fingerprint, LockKeyhole, UserRoundCog } from 'lucide-react'

const trustItems = [
  {
    title: 'Role-aware access',
    description:
      'Clients, specialists, and admins land in the right workspace with the right controls.',
    icon: UserRoundCog,
  },
  {
    title: 'Secure account layer',
    description:
      'Better Auth sessions, verified identity flows, and account settings anchor the product.',
    icon: Fingerprint,
  },
  {
    title: 'Sensitive by design',
    description:
      'Health workflows are presented with careful data boundaries and protected routes.',
    icon: LockKeyhole,
  },
]

export function TrustIndicators() {
  return (
    <section className="mx-auto max-w-7xl py-10 sm:py-14">
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-sm font-black tracking-[0.22em] text-cyan-700 uppercase dark:text-cyan-300">
            Trust architecture
          </p>
          <h2 className="mt-4 border-none pb-0 font-heading text-4xl leading-tight font-black tracking-[-0.05em] sm:text-5xl">
            Built for healthcare work that cannot feel casual.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Healflow’s interface is intentionally calm, but the foundation is operational: protected
            sessions, strict roles, and safe flows for personal health data.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-slate-800 bg-slate-950 p-6 text-white shadow-md dark:border-slate-700"
              >
                <div className="mb-8 w-fit rounded-2xl bg-primary/20 p-3 text-cyan-200">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
