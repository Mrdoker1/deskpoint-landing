import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CasesSection } from "@/components/landing/cases-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DataResidencySection } from "@/components/landing/data-residency-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { PrivacySection } from "@/components/landing/privacy-section";
import { AudienceSection } from "@/components/landing/audience-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <CasesSection />
      <HowItWorksSection />
      <DataResidencySection />
      <IntegrationsSection />
      <PrivacySection />
      <AudienceSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
