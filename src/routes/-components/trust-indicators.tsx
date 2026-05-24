import { Award, Heart, TrendingUp } from 'lucide-react'

export function TrustIndicators() {
  return (
    <section className="-mx-10 bg-linear-to-r from-slate-500 via-slate-600 to-slate-700 py-20 text-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 border-none pb-0 text-4xl font-bold text-white">
            Trusted by Healthcare Leaders
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-blue-100">
            Join thousands of healthcare providers and patients who trust our platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 w-fit rounded-full bg-white/10 p-4">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-white">HIPAA Compliant</h3>
            <p className="text-blue-100">
              Fully compliant with healthcare privacy regulations and security standards
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 w-fit rounded-full bg-white/10 p-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-white">99.9% Uptime</h3>
            <p className="text-blue-100">
              Reliable platform with enterprise-grade infrastructure and 24/7 monitoring
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 w-fit rounded-full bg-white/10 p-4">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-white">Patient-Centered</h3>
            <p className="text-blue-100">
              Designed with patient experience and outcomes as our top priority
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
