// Google Analytics / GTM tracking utilities

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Send custom events to Google Analytics via GTM
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      // Add default parameters
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

// Track page views (automatically handled by GTM, but useful for SPAs)
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-CV6W14EG0Y', {
      page_title: title || document.title,
      page_location: url,
    })
  }
}

// Predefined event trackers for common actions
export const analytics = {
  // Email capture events
  emailSubmitted: (source: string) => {
    trackEvent('email_submitted', {
      event_category: 'engagement',
      event_label: source,
      source: source,
    })
  },

  emailCaptureSuccess: (source: string) => {
    trackEvent('email_capture_success', {
      event_category: 'conversion',
      event_label: source,
      source: source,
    })
  },

  emailCaptureError: (source: string, error: string) => {
    trackEvent('email_capture_error', {
      event_category: 'error',
      event_label: source,
      source: source,
      error_message: error,
    })
  },

  // Navigation events
  ctaClicked: (buttonText: string, location: string) => {
    trackEvent('cta_clicked', {
      event_category: 'engagement',
      event_label: buttonText,
      button_text: buttonText,
      button_location: location,
    })
  },

  navigationClicked: (linkText: string, destination: string) => {
    trackEvent('navigation_clicked', {
      event_category: 'navigation',
      event_label: linkText,
      link_text: linkText,
      destination: destination,
    })
  },

  // Pricing events
  pricingViewed: (plan?: string) => {
    trackEvent('pricing_viewed', {
      event_category: 'engagement',
      event_label: plan || 'all_plans',
      plan: plan,
    })
  },

  planSelected: (planName: string, planPrice: string) => {
    trackEvent('plan_selected', {
      event_category: 'conversion_intent',
      event_label: planName,
      plan_name: planName,
      plan_price: planPrice,
    })
  },

  // Contact events
  contactFormViewed: () => {
    trackEvent('contact_form_viewed', {
      event_category: 'engagement',
    })
  },

  contactFormSubmitted: () => {
    trackEvent('contact_form_submitted', {
      event_category: 'conversion',
    })
  },

  // Feature engagement
  featureClicked: (featureName: string, section: string) => {
    trackEvent('feature_clicked', {
      event_category: 'engagement',
      event_label: featureName,
      feature_name: featureName,
      section: section,
    })
  },

  // Scroll tracking
  scrollToSection: (sectionName: string) => {
    trackEvent('scroll_to_section', {
      event_category: 'engagement',
      event_label: sectionName,
      section: sectionName,
    })
  },

  // Theme changes
  themeChanged: (newTheme: string) => {
    trackEvent('theme_changed', {
      event_category: 'user_preference',
      event_label: newTheme,
      theme: newTheme,
    })
  },
}

// Enhanced conversion tracking
export const trackConversion = (conversionType: string, value?: number, currency = 'USD') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      event_category: 'conversion',
      event_label: conversionType,
      value: value,
      currency: currency,
    })
  }
}

// User identification (for authenticated users)
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-CV6W14EG0Y', {
      user_id: userId,
      custom_map: properties,
    })
  }
}