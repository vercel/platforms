"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check } from "lucide-react"
import { FeatureList } from "@/components/feature-list"
import { ComparePlans } from "../compare-plans"

export default function Pricing() {
  const [view, setView] = useState<"setup" | "hosting">("hosting")

  // 4 Plans - Setup + Usage-based hosting model
  const plans = [
    {
      name: "Launch",
      subtitle: "Get Started with Automation",
      description: "For small businesses taking their first step toward AI-driven automation.",
      setupCost: "$2,500",
      baseFee: "$250",
      includedHours: "25 hrs",
      usageRate: "$5/hr thereafter",
      comparison: "≈ $0.14/min vs $25/hr employee",
      features: [
        "1–2 hosted AI agents",
        "Integration with 1 business app",
        "Basic analytics dashboard (up to 5 users)",
        "ROI visibility & task tracking",
        "Standard support response (<24 hrs)",
      ],
      popular: false,
    },
    {
      name: "Elevate",
      subtitle: "Grow with Intelligence",
      description: "For teams ready to automate multiple workflows and expand analytics insights.",
      setupCost: "$10,000",
      baseFee: "$500",
      includedHours: "50 hrs",
      usageRate: "$5/hr thereafter",
      comparison: "≈ 80% cheaper than manual data entry",
      features: [
        "Up to 5 AI agents with parallel execution",
        "Integrations across 3 systems",
        "Analytics & performance dashboards (up to 10 users)",
        "Quarterly ROI & performance reviews",
        "Priority support (<12 hrs)",
      ],
      popular: true,
    },
    {
      name: "Advance",
      subtitle: "Optimize & Scale",
      description: "For growing organizations scaling automation with proactive optimization.",
      setupCost: "$20,000",
      baseFee: "$1,000",
      includedHours: "120 hrs",
      usageRate: "$5/hr thereafter",
      comparison: "≈ cost of one ¼ FTE",
      features: [
        "Up to 10 AI agents with advanced logic",
        "Cross-department integrations",
        "Full analytics suite (up to 25 users)",
        "Functional testing & advisory services",
        "Dedicated success architect (<6 hrs response)",
      ],
      popular: false,
    },
    {
      name: "Pinnacle",
      subtitle: "Transform Your Operations",
      description: "For businesses seeking full-scale automation with VIP support and custom insights.",
      setupCost: "$15,000+",
      baseFee: "$2,000",
      includedHours: "300 hrs",
      usageRate: "$5/hr thereafter",
      comparison: "≈ 4× faster than full-time staff",
      features: [
        "20+ AI agents & custom development",
        "Unlimited integrations & custom dashboards (50 users)",
        "Full telemetry & record-level reporting",
        "Executive ROI reviews & transformation roadmap",
        "Guaranteed 99.5% uptime, <1 hr response",
      ],
      popular: false,
    },
  ]

  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-semibold tracking-tight">
          White-Glove Intelligent Automation for Small to Mid-Size Businesses
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Choose the Oakridge plan that fits your goals — from first automation to a fully managed, analytics-driven operation.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border ${
                plan.popular ? "border-primary shadow-lg" : "border-border"
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
                      <span className="ml-1 text-sm text-muted-foreground">one-time setup</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-semibold">{plan.baseFee}</span>
                      <span className="ml-1 text-sm text-muted-foreground">/month hosting</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Includes {plan.includedHours}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {plan.usageRate}
                  </div>
                  <div className="text-xs text-primary font-medium">
                    {plan.comparison}
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

        {/* Cost Comparison Table */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-center mb-6">
            Complete Pricing Breakdown
          </h3>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            One-time setup includes AI agent development, integrations, and training. 
            Monthly hosting includes runtime, support, and ongoing optimization.
          </p>
          
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-center">Setup Cost</TableHead>
                  <TableHead className="text-center">Monthly Hosting</TableHead>
                  <TableHead className="text-center">Included Hours</TableHead>
                  <TableHead className="text-center">Additional Usage</TableHead>
                  <TableHead className="text-center">Est. Savings vs Employee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Launch</TableCell>
                  <TableCell className="text-center">$2,500</TableCell>
                  <TableCell className="text-center">$250</TableCell>
                  <TableCell className="text-center">25 hrs</TableCell>
                  <TableCell className="text-center">$5/hr</TableCell>
                  <TableCell className="text-center text-primary font-semibold">~72% lower</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Elevate</TableCell>
                  <TableCell className="text-center">$6,000</TableCell>
                  <TableCell className="text-center">$500</TableCell>
                  <TableCell className="text-center">50 hrs</TableCell>
                  <TableCell className="text-center">$5/hr</TableCell>
                  <TableCell className="text-center text-primary font-semibold">~80% lower</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Advance</TableCell>
                  <TableCell className="text-center">$9,000</TableCell>
                  <TableCell className="text-center">$1,000</TableCell>
                  <TableCell className="text-center">120 hrs</TableCell>
                  <TableCell className="text-center">$5/hr</TableCell>
                  <TableCell className="text-center text-primary font-semibold">~75% lower</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pinnacle</TableCell>
                  <TableCell className="text-center">$15,000+</TableCell>
                  <TableCell className="text-center">$2,000</TableCell>
                  <TableCell className="text-center">300 hrs</TableCell>
                  <TableCell className="text-center">$5/hr</TableCell>
                  <TableCell className="text-center text-primary font-semibold">~80% lower</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add-On Services Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-center mb-6">
            Enhanced Capabilities & Add-Ons
          </h3>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Extend your automation with advanced features and specialized integrations. 
            Available as add-ons to any plan.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Voice Integration */}
            <Card className="border border-border">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Voice Integration</CardTitle>
                <CardDescription>AI-powered voice interactions</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-semibold">$1,500</span>
                  <span className="text-sm text-muted-foreground ml-1">setup</span>
                </div>
                <div className="mb-4">
                  <span className="text-lg font-semibold">+$150</span>
                  <span className="text-sm text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Natural language voice commands</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Real-time speech-to-text processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Multi-language support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Voice authentication & security</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Add Voice
                </Button>
              </CardContent>
            </Card>

            {/* Interactive Avatar */}
            <Card className="border border-border">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Interactive Avatar</CardTitle>
                <CardDescription>AI-powered virtual assistant</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-semibold">$2,500</span>
                  <span className="text-sm text-muted-foreground ml-1">setup</span>
                </div>
                <div className="mb-4">
                  <span className="text-lg font-semibold">+$250</span>
                  <span className="text-sm text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Lifelike 3D avatar representation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Real-time facial expressions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Custom branding & appearance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Multi-modal interactions</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Add Avatar
                </Button>
              </CardContent>
            </Card>

            {/* Non-API Workflows */}
            <Card className="border border-border">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Non-API Workflows</CardTitle>
                <CardDescription>UI automation & legacy systems</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-semibold">$3,000</span>
                  <span className="text-sm text-muted-foreground ml-1">setup</span>
                </div>
                <div className="mb-4">
                  <span className="text-lg font-semibold">+$200</span>
                  <span className="text-sm text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Screen automation & UI interaction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Legacy system integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Document processing automation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Browser-based task automation</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Add Workflows
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bundle Pricing */}
          <div className="mt-8 p-6 bg-primary/5 rounded-lg max-w-3xl mx-auto border border-primary/20">
            <h4 className="font-semibold text-center mb-3">💎 Complete Enhancement Bundle</h4>
            <div className="text-center mb-4">
              <span className="text-2xl font-semibold text-primary">$6,000</span>
              <span className="text-sm text-muted-foreground ml-1">setup</span>
              <span className="text-lg font-semibold text-primary ml-4">+$500</span>
              <span className="text-sm text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Save $1,000 on setup when you add all three enhancements together. Perfect for comprehensive automation solutions.
            </p>
            <div className="flex justify-center">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Complete Bundle
              </Button>
            </div>
          </div>
        </div>

        {/* Compare Plans Section */}
        <div className="mt-24 text-left">
  

          <ComparePlans />

          <p className="text-center text-sm mt-6 text-muted-foreground">
            Need a tailored plan or more analytics access?{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">
              Contact Oakridge Automation
            </a>{" "}
            for a custom quote.
          </p>
        </div>
      </div>
    </section>
  )
}
