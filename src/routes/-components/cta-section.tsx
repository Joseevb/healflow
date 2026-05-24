import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth-client'

export function CTASection() {
  const { data: session } = useSession.get()
  const isAuthenticated = session !== null

  return (
    <section className="-mx-10 bg-gray-50 py-20 dark:bg-slate-900">
      <div className="container mx-auto px-4 text-center lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 border-none pb-0 text-4xl font-bold">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="mb-8 text-xl text-gray-600 dark:text-slate-300">
            Join thousands of patients and healthcare providers who have already made the switch to
            smarter healthcare management.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {!isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg"
                  render={
                    <Link to="/auth/sign-up" className="flex items-center gap-2">
                      Sign Up Today <ArrowRight className="h-5 w-5" />
                    </Link>
                  }
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg"
                  render={<Link to="/auth">Sign In</Link>}
                />
              </>
            ) : (
              <Button
                size="lg"
                className="px-8 py-6 text-lg"
                render={
                  <Link to="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard <ArrowRight className="h-5 w-5" />
                  </Link>
                }
              />
            )}
          </div>

          <p className="mt-6 text-sm text-gray-500 dark:text-slate-400">
            No credit card required • HIPAA compliant • 24/7 support
          </p>
        </div>
      </div>
    </section>
  )
}
