# Google Tag Manager & Analytics Setup

## 🎯 **Analytics Configuration**

**Google Analytics ID**: `G-CV6W14EG0Y`  
**Implementation**: Google Tag Manager (GTM) integration  
**Location**: Next.js root layout with proper script loading

## 📊 **Tracking Events**

### **Email Capture Events**
- `email_submitted` - When user submits email form
- `email_capture_success` - Successful email capture
- `email_capture_error` - Email capture failures

### **Navigation Events**
- `cta_clicked` - Call-to-action button clicks
- `navigation_clicked` - Menu/navigation link clicks
- `scroll_to_section` - Section scrolling behavior

### **Pricing Events**
- `pricing_viewed` - Pricing page/section views
- `plan_selected` - When user selects a pricing plan

### **User Engagement**
- `feature_clicked` - Feature interaction tracking
- `theme_changed` - Light/dark mode toggles
- `contact_form_viewed` - Contact form engagement
- `contact_form_submitted` - Contact form submissions

## 🛠️ **Implementation Details**

### **Script Loading Strategy**
- **GTM Script**: `afterInteractive` strategy for optimal performance
- **Noscript Fallback**: Included for users with JavaScript disabled
- **Next.js Integration**: Proper SSR/hydration handling

### **Event Tracking Usage**
```typescript
import { analytics } from '@/lib/analytics'

// Track email submissions
analytics.emailSubmitted('hero-form')
analytics.emailCaptureSuccess('hero-form')

// Track button clicks
analytics.ctaClicked('Get Started', 'header')

// Track pricing engagement
analytics.planSelected('Professional', '$499/month')

// Custom event tracking
trackEvent('custom_event', {
  custom_parameter: 'value',
  page_section: 'hero'
})
```

## 📈 **Key Metrics to Monitor**

### **Conversion Funnel**
1. **Page Views** → Landing page traffic
2. **Email Submissions** → Lead capture rate
3. **Pricing Views** → Interest indication
4. **Plan Selections** → Purchase intent
5. **Contact Forms** → Sales qualified leads

### **User Behavior**
- **Scroll Depth** → Content engagement
- **Feature Clicks** → Product interest
- **Navigation Patterns** → User journey
- **Theme Preferences** → User experience data
- **Error Rates** → Technical issues

### **Source Attribution**
- **Email Sources**: `hero-form`, `footer-form`, `pricing-page`
- **Button Locations**: `header`, `hero`, `pricing`, `footer`
- **Feature Sections**: Specific feature interactions

## 🎯 **Goals & Conversions**

### **Primary Conversions**
1. **Email Capture** (Lead Generation)
2. **Pricing Page Views** (Interest)
3. **Plan Selection** (Intent)
4. **Contact Form** (Sales Qualified)

### **Secondary Metrics**
1. **Feature Engagement** (Product Fit)
2. **Content Consumption** (Education)
3. **Return Visits** (Consideration)
4. **Mobile vs Desktop** (User Preference)

## 🔧 **GTM Setup Recommendations**

### **Enhanced E-commerce**
```javascript
// Track pricing plan selections as products
gtag('event', 'select_item', {
  item_list_id: 'pricing_plans',
  item_list_name: 'Pricing Plans',
  items: [{
    item_id: 'professional_plan',
    item_name: 'Professional Plan',
    category: 'subscription',
    price: 499,
    currency: 'USD'
  }]
})
```

### **Custom Dimensions**
- **User Type**: First-time vs returning
- **Traffic Source**: Organic, paid, referral
- **Device Type**: Mobile, tablet, desktop
- **Geography**: Country/region targeting

## 📱 **Privacy & Compliance**

### **GDPR Compliance**
- **Consent Management**: Consider implementing cookie consent
- **Data Collection**: Only essential analytics data
- **User Rights**: Ability to opt-out of tracking

### **Data Retention**
- **Google Analytics**: 26 months default
- **Custom Events**: Follow data retention policies
- **PII Protection**: No personal data in events

## 🚀 **Advanced Tracking**

### **A/B Testing Integration**
```typescript
// Track experiment variations
analytics.trackEvent('experiment_viewed', {
  experiment_id: 'hero_cta_test',
  variant: 'variant_b',
  experiment_name: 'Hero CTA Button Text'
})
```

### **Scroll Tracking**
```typescript
// Automatic scroll depth tracking
useEffect(() => {
  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    )
    if (scrollPercent % 25 === 0) {
      analytics.trackEvent('scroll_depth', {
        scroll_percent: scrollPercent
      })
    }
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

## 📊 **Reporting & Dashboards**

### **Key Reports to Create**
1. **Conversion Funnel Report**
2. **Email Capture Performance**
3. **Pricing Page Analytics**
4. **User Journey Flow**
5. **Mobile vs Desktop Performance**

### **Custom Dashboards**
- **Marketing Performance**: Traffic, conversions, sources
- **Product Analytics**: Feature usage, engagement patterns
- **Technical Metrics**: Page speed, error rates
- **Business KPIs**: Lead quality, conversion rates

---

**Last Updated**: October 2024  
**Analytics ID**: G-CV6W14EG0Y  
**Implementation**: Complete GTM integration with custom event tracking