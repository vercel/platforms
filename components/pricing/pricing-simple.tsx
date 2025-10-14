"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FeatureList } from "@/components/feature-list"
import Link from "next/link"

export default function PricingSimple() {
  // Simplified 4 Plans for landing page
  const plans = [
    {
      name: "Launch",
      subtitle: "Get Started",
      description: "Perfect for small businesses starting with AI automation.",
      setupCost: "$2,500",
      baseFee: "$250",
      includedHours: "25 hrs",
      features: [
        "1–2 hosted AI agents",
        "1 business app integration",
        "Basic analytics dashboard",
        "Standard support (<24 hrs)",
      ],
      popular: false,
    },
    {
      name: "Elevate",
      subtitle: "Grow Smart",
      description: "For teams ready to automate multiple workflows.",
      setupCost: "$10,000",
      baseFee: "$500",
      includedHours: "50 hrs",
      features: [
        "Up to 5 AI agents",
        "3 system integrations",
        "Performance dashboards",
        "Priority support (<12 hrs)",
      ],
      popular: true,
    },
    {
      name: "Advance",
      subtitle: "Scale Up",
      description: "For growing organizations with advanced needs.",
      setupCost: "$20,000",
      baseFee: "$1,000",
      includedHours: "120 hrs",
      features: [
        "Up to 10 AI agents",
        "Cross-department integrations",
        "Full analytics suite",
        "Dedicated success architect",
      ],
      popular: false,
    },
    {
      name: "Pinnacle",
      subtitle: "Transform",
      description: "Complete automation transformation with VIP support.",
      setupCost: "$15,000+",
      baseFee: "$2,000",
      includedHours: "300 hrs",
      features: [
        "20+ AI agents & custom dev",
        "Unlimited integrations",
        "Executive ROI reviews",
        "99.5% uptime guarantee",
      ],
      popular: false,
    },
  ]

  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-semibold tracking-tight">
          White-Glove AI Automation Pricing
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your automation goals. All plans include $5/hr usage after included hours.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border ${
                plan.popular 
                  ? "border-primary shadow-lg scale-105 lg:scale-110 z-10" 
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  Popular
                </span>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground mb-4 text-left">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="mb-3">
                    <div className="flex items-baseline mb-1">
                      <span className="text-lg font-semibold text-muted-foreground">{plan.setupCost}</span>
                      <span className="ml-1 text-sm text-muted-foreground">setup</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-semibold">{plan.baseFee}</span>
                      <span className="ml-1 text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Includes {plan.includedHours}
                  </div>
                </div>
                
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full mb-6"
                >
                  {plan.name === "Pinnacle" ? "Contact Us" : "Get Started"}
                </Button>
                <FeatureList items={plan.features} className="mt-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Detailed Pricing CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Want to see detailed pricing, add-ons, and feature comparisons?
          </p>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View Detailed Pricing & Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}