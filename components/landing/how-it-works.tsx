"use client"

export default function HowItWorks() {
  return (
    <section className="bg-background pt-20 text-foreground">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24">
        <div className="text-center mb-16">
          <p className="text-sm leading-normal font-bold uppercase text-primary">
            Process
          </p>
          <h2 className="text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl capitalize lg:text-4xl mt-4 font-medium text-foreground lg:text-balance">
            How It Works
          </h2>
          <p className="text-base leading-normal mt-4 text-muted-foreground font-medium">
            A simple, three-step journey to get your AI agents up and running quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative gap-5 lg:gap-10 max-lg:divide-y lg:divide-x divide-primary/30 divide-dashed">
          <div className="relative z-10 bg-background text-center md:text-left pt-6 md:pe-10 lg:py-0 pb-10 last:pb-0 last:pe-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto md:mx-0 mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Connect Your Systems</h3>
            <p className="text-base text-muted-foreground">
              Integrate your existing business tools and data sources with our secure AI platform.
            </p>
          </div>

          <div className="relative z-10 bg-background text-center md:text-left pt-6 md:pe-10 lg:py-0 pb-10 last:pb-0 last:pe-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto md:mx-0 mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Configure AI Agents</h3>
            <p className="text-base text-muted-foreground">
              Set up intelligent agents, define workflows, and customize automation rules for your business needs.
            </p>
          </div>

          <div className="relative z-10 bg-background text-center md:text-left pt-6 md:pe-10 lg:py-0 pb-10 last:pb-0 last:pe-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto md:mx-0 mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Launch & Scale</h3>
            <p className="text-base text-muted-foreground">
              Deploy your AI agents, monitor performance, and scale operations with intelligent insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
