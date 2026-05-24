import { Link } from '@tanstack/react-router'
import { Activity, ArrowRight, Calendar, FileText, Hospital, Pill } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSession } from '@/lib/auth-client'

export function HeroSection() {
  const { data: session } = useSession.get()
  const isAuthenticated = session !== null

  return (
    <section className="relative -mx-10  -mt-10 mb-16 overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                <Hospital className="h-4 w-4" />
                Modern Healthcare Management
              </div>
              <h1 className="text-left text-5xl leading-tight font-bold text-gray-900 lg:text-6xl dark:text-white">
                Your Health,{' '}
                <span className="bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Simplified
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-gray-600 dark:text-slate-300">
                Streamline your healthcare experience with Healflow&lsquo;s comprehensive platform.
                Book appointments, manage medical records, and connect with healthcare providers all
                in one secure place.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg"
                    render={
                      <Link to="/auth" className="flex items-center gap-2">
                        Get Started <ArrowRight className="h-5 w-5" />
                      </Link>
                    }
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg"
                    render={<a href="#features">Learn More</a>}
                  />
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg"
                    render={
                      <Link to="/dashboard" className="flex items-center gap-2">
                        Go to Dashboard <ArrowRight className="h-5 w-5" />
                      </Link>
                    }
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg"
                    render={
                      <Link to="/dashboard/appointments" className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Book Appointment
                      </Link>
                    }
                  />
                </>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="transition-transform duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 transition-colors duration-300 dark:bg-blue-900/20">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Next Appointment</div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">Dr. Smith</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Tomorrow, 2:30 PM</div>
                </CardContent>
              </Card>

              <Card className="transition-transform duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2 transition-colors duration-300 dark:bg-green-900/20">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Health Score</div>
                      <div className="text-2xl font-bold text-green-600">92/100</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-transform duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2 transition-colors duration-300 dark:bg-purple-900/20">
                      <Pill className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Medications</div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">3 active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-transform duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-100 p-2 transition-colors duration-300 dark:bg-orange-900/20">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Records</div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">Up to date</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
