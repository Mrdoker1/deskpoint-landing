import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DataResidencySection } from "@/components/landing/data-residency-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { PrivacySection } from "@/components/landing/privacy-section";
import { DevelopersSection } from "@/components/landing/developers-section";
import { CaseAlgardSection } from "@/components/landing/case-algard-section";
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
      <HowItWorksSection />
      <DataResidencySection />
      <IntegrationsSection />
      <PrivacySection />
      <DevelopersSection />
      <CaseAlgardSection />
      <AudienceSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
