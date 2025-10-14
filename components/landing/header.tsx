"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { rootDomain } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { analytics } from "@/lib/analytics"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Determine which logo to show based on theme
  if (!mounted) return null
  const currentTheme = theme === 'system' ? systemTheme : theme
  const logoSrc = currentTheme === 'dark' ? '/images/logo.svg' : '/images/logo.svg'

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={logoSrc}
                alt={rootDomain}
                width={120}
                height={40}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/#features" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link 
                href="/#how-it-works" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link 
                href="/pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>

            {/* Desktop Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/pricing">
                <Button 
                  size="sm"
                  onClick={() => analytics.ctaClicked('Get Started', 'header')}
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/#features" 
                  className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Features
                </Link>
                <Link 
                  href="/#how-it-works" 
                  className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  How It Works
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Pricing
                </Link>
                
                {/* Mobile Action Buttons */}
                <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                  <Link href="/pricing">
                    <Button className="w-full" onClick={closeMobileMenu}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}