import { Star } from 'lucide-react'

export function StatsSection() {
  return (
    <section className="-mx-10 mb-16 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600 lg:text-4xl">50K+</div>
            <div className="text-gray-600 dark:text-slate-300">Happy Patients</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-green-600 lg:text-4xl">200+</div>
            <div className="text-gray-600 dark:text-slate-300">Healthcare Providers</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600 lg:text-4xl">1M+</div>
            <div className="text-gray-600 dark:text-slate-300">Appointments Scheduled</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-600 lg:text-4xl">4.9</div>
            <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-slate-300">
              <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
              User Rating
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
