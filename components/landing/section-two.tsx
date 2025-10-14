"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function SectionTwo() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Determine which image to show based on theme
  const currentTheme = theme === 'system' ? systemTheme : theme
  const dashboardImage = currentTheme === 'dark' ? '/images/dark-app.png' : '/images/light-app.png'

  return (
    <section>
      <div className="px-8 py-24 mx-auto md:px-12 lg:px-24 max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:order-last">
            <p className="text-sm leading-normal font-bold uppercase text-primary">
              Intelligence
            </p>
            <h2 className="text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl capitalize lg:text-4xl mt-4 font-medium text-foreground">
              Transforming business operations with AI-powered automation
            </h2>
            <p className="text-base leading-normal mt-4 text-muted-foreground font-medium">
              The fastest method for implementing intelligent automation that scales with your business needs.
            </p>
            <div className="flex flex-wrap items-center gap-2 mx-auto mt-12">
              <Button className="flex items-center justify-center transition-all duration-200 focus:ring-2 focus:outline-none text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-primary/50 h-9 px-4 py-2 text-sm font-medium rounded-md">
                Get started
              </Button>
              <Button 
                variant="outline"
                className="flex items-center justify-center transition-all duration-200 focus:ring-2 focus:outline-none text-muted-foreground bg-background hover:text-primary ring-1 ring-border focus:ring-primary/20 h-9 px-4 py-2 text-sm font-medium rounded-md"
              >
                Learn more details
              </Button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="p-5 bg-muted/30 rounded-2xl">
              <Image
                src={dashboardImage}
                alt="AI Agents Dashboard"
                width={900}
                height={500}
                className="relative w-full ring-4 ring-background border border-border lg:rounded-2xl object-cover rounded"
                priority
              />
            </div>
          </div>
        </div>

        {/* Feature Details Grid */}
        <div className="gap-x-2 gap-y-14 mt-12 lg:gap-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div>
              <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                Intelligent Automation
              </h3>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Our AI agents provide advanced automation that learns and adapts to your business processes.
              </p>
            </div>
            <ul
              role="list"
              className="space-y-1 mt-6 text-base font-medium text-foreground"
            >
              <li>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/icon.svg"
                    alt="Check"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  <span className="text-base leading-normal">
                    Revolutionizing workflow efficiency
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/icon.svg"
                    alt="Check"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  <span className="text-base leading-normal">
                    Enhancing decision accuracy
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <div>
              <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                Powerful Integration
              </h3>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Seamlessly connect with your existing tools and systems for unified business operations.
              </p>
            </div>
            <ul
              role="list"
              className="space-y-1 mt-6 text-base font-medium text-foreground"
            >
              <li>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/icon.svg"
                    alt="Check"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  <span className="text-base leading-normal">
                    Unlocking cross-platform synergy
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/icon.svg"
                    alt="Check"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  <span className="text-base leading-normal">
                    Enabling real-time data flow
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <div>
              <h3 className="text-base leading-normal sm:text-lg md:text-xl text-foreground font-medium">
                Effortless Setup
              </h3>
              <p className="text-base leading-normal mt-2 text-muted-foreground font-medium">
                Get started in minutes with our intuitive setup process and comprehensive onboarding.
              </p>
            </div>
            <ul
              role="list"
              className="space-y-1 mt-6 text-base font-medium text-foreground"
            >
              <li>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/icon.svg"
                    alt="Check"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  <span className="text-base leading-normal">
                    Streamlining deployment
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/icon.svg"
                    alt="Check"
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  <span className="text-base leading-normal">
                    Simplifying configuration
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
