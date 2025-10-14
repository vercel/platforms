"use client"

import { Brain, Shield, Zap, BarChart3, Settings, Clock, Workflow, MessageSquare } from "lucide-react"

export default function SectionOne() {
  const aiFeatures = [
    "Intelligent Document Processing",
    "Natural Language Understanding", 
    "Automated Workflow Triggers",
    "Real-time Data Analysis",
    "Smart Decision Making",
    "Predictive Analytics",
    "Voice Command Integration",
    "Multi-language Support",
    "Custom AI Training",
    "Enterprise Security",
    "24/7 Monitoring",
    "API Integration"
  ]

  return (
    <section id="features">
      <div className="px-8 py-20 mx-auto md:px-12 lg:px-24 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto lg:text-balance">
          <p className="text-sm leading-normal font-bold uppercase text-primary">
            Features
          </p>
          <h2 className="text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl capitalize lg:text-4xl mt-4 font-medium text-foreground lg:text-balance">
            Transforming business operations with intelligent AI agents
          </h2>
          <p className="text-base leading-normal mt-4 text-muted-foreground font-medium">
            The fastest method for automating complex business processes with AI-powered intelligence.
          </p>
        </div>

        {/* Scrolling Features Banner */}
        <div className="relative py-12 mx-auto overflow-hidden overflow-x-hidden 2xl:max-w-screen-xl">
          <div className="grid justify-between w-full">
            <div className="absolute inset-0 left-0 z-10 from-background via-transparent w-44 bg-gradient-to-r"></div>
            <div className="absolute inset-0 left-0 z-10 ml-auto from-background via-transparent w-44 bg-gradient-to-l"></div>
          </div>
          <div className="relative flex items-center gap-2 whitespace-nowrap animate-scroll">
            {aiFeatures.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center font-medium relative text-foreground bg-muted/50 px-4 py-1.5 text-sm rounded-lg border border-border/50"
              >
                {feature}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {aiFeatures.map((feature, index) => (
              <span
                key={`duplicate-${index}`}
                className="inline-flex items-center font-medium relative text-foreground bg-muted/50 px-4 py-1.5 text-sm rounded-lg border border-border/50"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 text-center gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-y-16">
          <div>
            <div className="flex flex-col gap-3 text-primary">
              <Brain className="size-5 mx-auto" />
              <div>
                <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                  Smart Learning
                </h3>
              </div>
            </div>
            <div>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                AI agents that learn from your business patterns and improve over time.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 text-primary">
              <Shield className="size-5 mx-auto" />
              <div>
                <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                  Enterprise Security
                </h3>
              </div>
            </div>
            <div>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Bank-level security with end-to-end encryption and compliance standards.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 text-primary">
              <Zap className="size-5 mx-auto" />
              <div>
                <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                  Instant Processing
                </h3>
              </div>
            </div>
            <div>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Process thousands of documents and tasks in seconds, not hours.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 text-primary">
              <BarChart3 className="size-5 mx-auto" />
              <div>
                <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                  Analytics & Insights
                </h3>
              </div>
            </div>
            <div>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Get deep insights into your business operations with AI-powered analytics.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 text-primary">
              <Settings className="size-5 mx-auto" />
              <div>
                <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                  Custom Workflows
                </h3>
              </div>
            </div>
            <div>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Build and customize workflows that match your unique business needs.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 text-primary">
              <Clock className="size-5 mx-auto" />
              <div>
                <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                  24/7 Operation
                </h3>
              </div>
            </div>
            <div>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                AI agents work around the clock, ensuring your business never stops.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 text-primary">
              <Workflow className="size-5 mx-auto" />
              <div>
                <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                  Process Automation
                </h3>
              </div>
            </div>
            <div>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Automate complex multi-step processes with intelligent decision making.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 text-primary">
              <MessageSquare className="size-5 mx-auto" />
              <div>
                <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                  Natural Language
                </h3>
              </div>
            </div>
            <div>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Communicate with AI agents using natural language commands and queries.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
