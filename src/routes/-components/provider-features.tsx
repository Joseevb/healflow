import { CalendarCheck, FileText, PieChart, Pill, Stethoscope, UserCheck } from 'lucide-react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ProviderFeatures() {
  return (
    <section className="-mx-10 bg-linear-to-br from-blue-50 via-white to-green-50 py-20 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 ">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 border-none pb-0 text-4xl font-bold">For Healthcare Providers</h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-slate-300">
            Streamline your practice with powerful tools designed for modern healthcare delivery
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/20">
                <CalendarCheck className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Appointment Management</CardTitle>
              <CardDescription>
                Efficiently manage your schedule, view patient appointments, and optimize your time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-green-100 p-3 transition-transform group-hover:scale-110 dark:bg-green-900/20">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>
                Access comprehensive patient information, medical history, and treatment plans
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-purple-100 p-3 transition-transform group-hover:scale-110 dark:bg-purple-900/20">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Clinical Notes</CardTitle>
              <CardDescription>
                Document patient visits, treatment notes, and clinical observations seamlessly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-orange-100 p-3 transition-transform group-hover:scale-110 dark:bg-orange-900/20">
                <Pill className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Prescription Writing</CardTitle>
              <CardDescription>
                Create and manage prescriptions with built-in drug interaction checks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-red-100 p-3 transition-transform group-hover:scale-110 dark:bg-red-900/20">
                <PieChart className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Gain insights into your practice with comprehensive analytics and reporting tools
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-teal-100 p-3 transition-transform group-hover:scale-110 dark:bg-teal-900/20">
                <UserCheck className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle>Specialist Referrals</CardTitle>
              <CardDescription>
                Easily refer patients to specialists and track referral status and outcomes
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
