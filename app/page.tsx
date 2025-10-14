import Link from 'next/link';
import { SubdomainForm } from './subdomain-form';
import { rootDomain } from '@/lib/utils';
import Hero from '@/components/landing/hero';
import Header from '@/components/landing/header';
import SectionOne from '@/components/landing/section-one';
import SectionTwo from '@/components/landing/section-two';
import WhyChooseUs from '@/components/landing/why-choose-us';
import HowItWorks from '@/components/landing/how-it-works';
import PricingSimple from '@/components/pricing/pricing-simple';

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <SectionOne />

      {/* Intelligence Section */}
      <SectionTwo />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Pricing Section */}
      <PricingSimple />

      {/* Subdomain Form Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Get Started Today
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Create your own subdomain with a custom emoji
              </p>
            </div>

            <div className="bg-card shadow-lg rounded-lg p-6 border">
              <SubdomainForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
