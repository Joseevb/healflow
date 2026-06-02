import { createFileRoute } from '@tanstack/react-router'

import { Header } from '@/routes/-components/header'

import { CTASection } from './-components/cta-section'
import { HeroSection } from './-components/hero-section'
import { PatientFeatures } from './-components/patient-features'
import { ProviderFeatures } from './-components/provider-features'
import { StatsSection } from './-components/stats-section'
import { TrustIndicators } from './-components/trust-indicators'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Header />
      <main className="min-h-full overflow-hidden bg-linear-to-tr from-slate-100 via-blue-50 to-green-50 px-5 pt-20 text-slate-950 sm:px-8 lg:px-10 dark:from-slate-950 dark:via-blue-950 dark:to-green-950 dark:text-white">
        <HeroSection />
        <StatsSection />
        <PatientFeatures />
        <ProviderFeatures />
        <TrustIndicators />
        <CTASection />
      </main>
    </>
  )
}
