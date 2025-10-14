# Landing Page Components

This directory contains all the components for the OakRidge AI landing page. The landing page is built using Next.js 14 with the App Router and features a modern, responsive design with theme support.

## 🏗️ Architecture Overview

The landing page follows a modular component architecture with each section as a separate, reusable component:

```
app/page.tsx                    # Main landing page layout
components/landing/
├── README.md                   # This file
├── header.tsx                  # Fixed navigation header
├── hero.tsx                    # Main hero section with carousel
├── section-one.tsx            # Features showcase
├── section-two.tsx            # Intelligence & automation section
├── why-choose-us.tsx          # Value proposition section
├── how-it-works.tsx           # Process explanation
└── pricing.tsx                # Interactive pricing plans
```

## 📱 Component Details

### Header (`header.tsx`)
- **Purpose**: Fixed navigation header with logo and CTA buttons
- **Features**: 
  - OakRidge AI logo (light theme variant)
  - Responsive design
  - Call-to-action buttons
- **Dependencies**: Button, Image components

### Hero (`hero.tsx`)
- **Purpose**: Main hero section with feature carousel and app screenshots
- **Features**:
  - Auto-advancing feature carousel (5-second intervals)
  - Theme-aware app screenshots (light/dark variants)
  - Responsive image grid
  - Primary and secondary CTAs
- **State Management**: Feature carousel rotation
- **Dependencies**: useTheme, useState, useEffect, Image, Button

### Section One (`section-one.tsx`)
- **Purpose**: Features showcase with animated scrolling banner
- **Features**:
  - Scrolling feature banner with 6 key features
  - 8-feature grid with icons and descriptions
  - CSS animations for scrolling effects
- **Icons**: Lucide React icons (Bot, Zap, Shield, etc.)
- **Styling**: Custom scrolling animations, responsive grid

### Section Two (`section-two.tsx`)
- **Purpose**: Intelligence and automation capabilities showcase
- **Features**:
  - Dashboard screenshot display
  - Feature breakdown with custom checkmark icons
  - Theme-aware dashboard images
- **Assets**: Custom icon.svg for checkmarks, dashboard images
- **Dependencies**: useTheme, Image component

### Why Choose Us (`why-choose-us.tsx`)
- **Purpose**: Value proposition and competitive advantages
- **Features**:
  - 6-feature grid highlighting key benefits
  - Primary background with card-based layout
  - Responsive design with proper spacing
- **Icons**: Lucide React icons for each feature
- **Styling**: Primary background theme, card layout

### How It Works (`how-it-works.tsx`)
- **Purpose**: 3-step process explanation
- **Features**:
  - Sequential step breakdown (Design → Deploy → Scale)
  - Visual step indicators
  - Clear call-to-action
- **Layout**: Responsive 3-column grid
- **Styling**: Step-based visual hierarchy

### Pricing (`pricing.tsx`)
- **Purpose**: Interactive pricing plans with monthly/annual toggle
- **Features**:
  - 3-tier pricing structure (Starter, Professional, Enterprise)
  - Interactive monthly/annual toggle with sliding animation
  - Feature comparison lists
  - Theme-aware styling for different plan types
- **State Management**: Pricing duration toggle (monthly/annual)
- **Plans**:
  - **Starter**: $299/month, $249/annual - For small teams
  - **Professional**: $499/month, $399/annual - For growing businesses (Popular)
  - **Enterprise**: Contact pricing - For large organizations

## 🎨 Design System

### Colors & Themes
- Uses Tailwind CSS with custom OKLCH color system
- Theme-aware components with light/dark mode support
- Primary colors: `text-primary`, `bg-primary`
- Muted variants: `text-muted-foreground`, `bg-muted`
- Background variants: `bg-background`, `bg-card`

### Typography Scale
- Headers: `text-xl` to `text-4xl` with `font-medium`
- Body text: `text-base` with `leading-normal`
- Captions: `text-sm` for supplementary information
- Responsive typography with `sm:`, `md:`, `lg:` breakpoints

### Spacing & Layout
- Container max-width: `max-w-7xl`
- Padding: `px-8` (mobile), `md:px-12` (tablet), `lg:px-24` (desktop)
- Section spacing: `py-16` to `py-20`
- Grid gaps: `gap-4` to `gap-8` based on content density

## 🔧 Technical Implementation

### State Management
```tsx
// Hero carousel state
const [currentFeature, setCurrentFeature] = useState(0)

// Pricing toggle state  
const [duration, setDuration] = useState<'monthly' | 'annual'>('monthly')
```

### Theme Integration
```tsx
// Theme-aware image switching
const { theme, systemTheme } = useTheme()
const currentTheme = theme === 'system' ? systemTheme : theme
const imageSrc = currentTheme === 'dark' ? '/dashboard-dark.png' : '/dashboard-light.png'
```

### Responsive Design
- Mobile-first approach with progressive enhancement
- Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Flexible grid layouts: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

## 📦 Dependencies

### Core Next.js
- `next/image` - Optimized image loading
- `next/link` - Client-side navigation
- `"use client"` - Client components for interactivity

### UI Components
- Custom UI components from `/components/ui/`
- Button, Card, Badge components
- Tailwind CSS for styling

### Icons & Assets
- `lucide-react` - Icon library
- Custom SVG icons (`icon.svg`)
- App screenshot assets (theme variants)

### Hooks & Utilities
- `next-themes` - Theme management
- Custom hooks: `use-mobile.ts`
- Utility functions from `/lib/utils`

## 🚀 Usage

### Basic Implementation
```tsx
import Hero from '@/components/landing/hero'
import Pricing from '@/components/landing/pricing'

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Pricing />
    </div>
  )
}
```

### Customization Options

#### Pricing Plans
Modify the `plans` array in `pricing.tsx`:
```tsx
const plans = [
  {
    name: "Custom Plan",
    monthlyPrice: "$199.00",
    features: ["Feature 1", "Feature 2"],
    popular: true,
    // ... other properties
  }
]
```

#### Feature Carousel
Update hero features in `hero.tsx`:
```tsx
const features = [
  {
    title: "New Feature",
    description: "Feature description",
    icon: <NewIcon className="h-8 w-8" />
  }
]
```

## 📱 Responsive Behavior

### Mobile (< 640px)
- Single column layouts
- Stacked navigation
- Compressed spacing
- Touch-optimized interactions

### Tablet (640px - 1024px)
- 2-column feature grids
- Balanced content distribution
- Medium spacing scale

### Desktop (> 1024px)
- Full 3-column layouts
- Maximum content width containers
- Optimal spacing and typography

## 🎯 Performance Considerations

### Image Optimization
- Next.js Image component with automatic optimization
- WebP format conversion
- Responsive srcSet generation
- Lazy loading by default

### Code Splitting
- Individual component exports
- Client-only interactivity where needed
- Minimal bundle size per component

### Animation Performance
- CSS-based animations over JavaScript
- Hardware-accelerated transforms
- Reduced motion respect

## 🔄 Future Enhancements

### Potential Improvements
1. **A/B Testing Framework**: Component variants for testing
2. **CMS Integration**: Dynamic content management
3. **Analytics Tracking**: User interaction monitoring
4. **Performance Monitoring**: Core Web Vitals tracking
5. **Accessibility Enhancements**: ARIA labels, keyboard navigation
6. **Internationalization**: Multi-language support
7. **SEO Optimization**: Structured data, meta tags

### Component Extensions
- Footer component
- Testimonials section
- FAQ accordion
- Feature comparison table
- Contact form integration

## 📋 Maintenance Notes

### Regular Updates
- Keep dependency versions current
- Monitor Core Web Vitals performance
- Update pricing information as needed
- Refresh screenshot assets periodically

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration active
- Consistent component patterns
- Proper prop typing throughout

---

**Last Updated**: October 2024  
**Version**: 1.0.0  
**Maintainer**: OakRidge AI Team