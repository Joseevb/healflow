import { Activity, Calendar, FileText, MessageSquare, Pill, Shield } from 'lucide-react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function PatientFeatures() {
  return (
    <section id="features" className="-mx-10 bg-gray-50 py-20 dark:bg-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 border-none pb-0 text-4xl font-bold">For Patients</h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-slate-300">
            Take control of your healthcare journey with our comprehensive patient platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/20">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Book Appointments</CardTitle>
              <CardDescription>
                Schedule appointments with your preferred doctors and specialists with just a few
                clicks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-green-100 p-3 transition-transform group-hover:scale-110 dark:bg-green-900/20">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                Access your complete medical records, test results, and treatment history anytime
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-purple-100 p-3 transition-transform group-hover:scale-110 dark:bg-purple-900/20">
                <Pill className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Prescription Management</CardTitle>
              <CardDescription>
                Track your medications, set reminders, and manage prescription refills
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-orange-100 p-3 transition-transform group-hover:scale-110 dark:bg-orange-900/20">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Health Monitoring</CardTitle>
              <CardDescription>
                Track vital signs, symptoms, and health metrics with integrated monitoring tools
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-red-100 p-3 transition-transform group-hover:scale-110 dark:bg-red-900/20">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Secure Messaging</CardTitle>
              <CardDescription>
                Communicate directly with your healthcare providers through secure messaging
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-blue-500/10">
            <CardHeader>
              <div className="mb-4 w-fit rounded-lg bg-teal-100 p-3 transition-transform group-hover:scale-110 dark:bg-teal-900/20">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Your health data is protected with enterprise-grade security and HIPAA compliance
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
