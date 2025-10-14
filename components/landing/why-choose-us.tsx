"use client"

import { Cloud, BarChart3, Shield, Brain, Workflow, Globe } from "lucide-react"

export default function WhyChooseUs() {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24">
        <div className="text-center mb-14">
          <p className="text-sm leading-normal font-bold uppercase text-primary-foreground/90">
            Why Choose Us
          </p>
          <h2 className="text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl capitalize lg:text-4xl mt-4 font-medium text-primary-foreground">
            Features Built to Accelerate Business Growth
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/90 max-w-xl mx-auto">
            Everything you need to transform your business with intelligent AI automation.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-background/95 text-foreground p-8 rounded-2xl hover:scale-[1.025] transition ease-linear shadow-lg">
            <div className="mb-4 text-primary">
              <Cloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cloud Native</h3>
            <p className="text-base font-medium text-muted-foreground">
              Scale globally with reliable, serverless AI infrastructure that grows with your business.
            </p>
          </div>

          <div className="bg-background/95 text-foreground p-8 rounded-2xl hover:scale-[1.025] transition ease-linear shadow-lg">
            <div className="mb-4 text-primary">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Ready</h3>
            <p className="text-base font-medium text-muted-foreground">
              Get actionable insights with built-in AI analytics and real-time performance tracking.
            </p>
          </div>

          <div className="bg-background/95 text-foreground p-8 rounded-2xl hover:scale-[1.025] transition ease-linear shadow-lg">
            <div className="mb-4 text-primary">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
            <p className="text-base font-medium text-muted-foreground">
              Bank-level security and compliance protection for your sensitive business data.
            </p>
          </div>

          <div className="bg-background/95 text-foreground p-8 rounded-2xl hover:scale-[1.025] transition ease-linear shadow-lg">
            <div className="mb-4 text-primary">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Intelligence</h3>
            <p className="text-base font-medium text-muted-foreground">
              Advanced machine learning that adapts and improves your business processes automatically.
            </p>
          </div>

          <div className="bg-background/95 text-foreground p-8 rounded-2xl hover:scale-[1.025] transition ease-linear shadow-lg">
            <div className="mb-4 text-primary">
              <Workflow className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Automation</h3>
            <p className="text-base font-medium text-muted-foreground">
              Intelligent workflow automation that handles complex tasks without human intervention.
            </p>
          </div>

          <div className="bg-background/95 text-foreground p-8 rounded-2xl hover:scale-[1.025] transition ease-linear shadow-lg">
            <div className="mb-4 text-primary">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Integration</h3>
            <p className="text-base font-medium text-muted-foreground">
              Connect with popular business tools and platforms used worldwide for seamless operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
