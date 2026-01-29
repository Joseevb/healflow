import { CTASection } from "./components/cta-section";
import { HeroSection } from "./components/hero-section";
import { PatientFeatures } from "./components/patient-features";
import { ProviderFeatures } from "./components/provider-features";
import { StatsSection } from "./components/stats-section";
import { TrustIndicators } from "./components/trust-indicators";
import { ViewTransition } from "react";

export default function Home() {
	return (
		<ViewTransition>
			<main className="h-full p-10 bg-gradient-to-tr from-slate-100 via-blue-50 to-green-50 dark:from-slate-950 dark:via-blue-950 dark:to-green-950">
				<HeroSection />
				<StatsSection />
				<PatientFeatures />
				<ProviderFeatures />
				<TrustIndicators />
				<CTASection />
			</main>
		</ViewTransition>
	);
}
