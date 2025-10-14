"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { analytics } from "@/lib/analytics"

export default function Hero() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Features data
  const features = [
    {
      title: "Smart Analysis",
      description: "AI that understands your business context and data patterns"
    },
    {
      title: "Secure Processing", 
      description: "Enterprise-grade security with end-to-end encryption"
    },
    {
      title: "Simple Integration",
      description: "Connect to your existing apps in minutes, not months"
    },
    {
      title: "Real-time Actions",
      description: "Automated responses and workflows that scale with your business"
    },
    {
      title: "Custom Workflows",
      description: "Build unique automation flows tailored to your processes"
    },
    {
      title: "24/7 Monitoring",
      description: "Continuous oversight with intelligent alerts and reporting"
    }
  ]

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(timer)
  }, [features.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Track email submission attempt
    analytics.emailSubmitted('hero-form')
    
    try {
      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          source: 'hero-form' 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success - clear form and show success toast
        setEmail("")
        
        // Track successful email capture
        analytics.emailCaptureSuccess('hero-form')
        
        if (data.alreadyExists) {
          toast.success("Thanks! We already have your email.", {
            description: "We'll keep you updated on our latest features.",
          })
        } else {
          toast.success("Email captured successfully!", {
            description: "We'll be in touch soon with next steps.",
          })
        }
        
        // Optional: redirect to thank you page after toast
        // setTimeout(() => window.location.href = '/thank-you', 2000)
        
      } else {
        console.error('Error capturing email:', data.error)
        
        // Track email capture error
        analytics.emailCaptureError('hero-form', data.error || 'Unknown error')
        
        toast.error("Oops! Something went wrong.", {
          description: "Please try again or contact us directly.",
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      
      // Track network error
      analytics.emailCaptureError('hero-form', 'Network error')
      
      toast.error("Connection error", {
        description: "Please check your internet connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return null
  }

  // Determine which image to show based on theme
  const currentTheme = theme === 'system' ? systemTheme : theme
  const appImage = currentTheme === 'dark' ? '/images/dark-app.png' : '/images/light-app.png'

  return (
    <section className="overflow-hidden">
      <div className="px-8 pt-32 mx-auto md:px-12 lg:px-24 max-w-7xl relative">
        {/* Centered Content */}
        <div className="max-w-2xl text-center mx-auto lg:text-balance mb-10">
          <p className="text-sm leading-normal font-bold uppercase text-primary">
            AI Automation Platform
          </p>
          <h1 className="text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-4 font-medium text-foreground">
            Smart, Secure, Simple AI Agents for Your Business Apps
          </h1>
          <p className="text-base leading-normal mt-4 text-muted-foreground font-medium">
            Agents that read, understand, and act on your business automatically
          </p>
          
          {/* Email Capture Form */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row items-center gap-3 justify-center mx-auto mt-12 max-w-md">
            <div className="flex-1 w-full">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <Button 
              type="submit"
              size="lg" 
              disabled={isSubmitting || !email}
              className="flex items-center justify-center transition-all duration-200 focus:ring-2 focus:outline-none text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-primary/50 h-11 px-6 py-2 text-sm font-medium rounded-md whitespace-nowrap"
            >
              {isSubmitting ? "Getting Started..." : "Get Started"}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Start your free consultation • No credit card required
          </p>
        </div>



        {/* App Screenshot */}
        <div className="relative w-full mx-auto max-w-7xl items-center py-12 pb-12">
          <div className="p-10 bg-muted/30 rounded-2xl">
            <Image
              src={appImage}
              alt="AI Agents Dashboard Screenshot"
              width={1200}
              height={700}
              className="relative w-full ring-4 ring-background border border-border lg:rounded-2xl object-cover rounded"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
