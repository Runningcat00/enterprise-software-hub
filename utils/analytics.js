// Enterprise Software Hub Analytics Utilities

export const trackSoftwareEvent = (eventName, properties = {}) => {
  // Add timestamp and source
  const eventData = {
    ...properties,
    timestamp: new Date().toISOString(),
    platform: 'enterprise-software-hub',
    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
    page_url: typeof window !== 'undefined' ? window.location.href : null
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Analytics Event: ${eventName}`, eventData)
  }

  // In production, send to analytics service
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    try {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', eventName, {
          custom_parameter_1: properties.software_name || properties.category || 'unknown',
          custom_parameter_2: properties.click_location || properties.source || 'unknown',
          value: properties.expected_commission || 0
        })
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq('trackCustom', eventName, eventData)
      }

      // Custom analytics endpoint
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          properties: eventData
        })
      }).catch(err => console.warn('Analytics tracking failed:', err))

    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }
}

// Track software comparison events
export const trackSoftwareComparison = (software1, software2, source = 'comparison_page') => {
  trackSoftwareEvent('software_comparison', {
    software_1: software1.name,
    software_2: software2.name,
    category_1: software1.category,
    category_2: software2.category,
    source: source,
    comparison_type: software1.category === software2.category ? 'same_category' : 'cross_category'
  })
}

// Track affiliate link clicks
export const trackAffiliateClick = (software, location, expectedCommission) => {
  trackSoftwareEvent('affiliate_click', {
    software_name: software.name,
    software_category: software.category,
    click_location: location,
    expected_commission: expectedCommission,
    commission_type: software.affiliate.commission_type,
    vendor: software.name.toLowerCase().replace(/\s+/g, '_')
  })
}

// Track newsletter signups
export const trackNewsletterSignup = (source, emailDomain) => {
  trackSoftwareEvent('newsletter_signup', {
    source: source,
    email_domain: emailDomain,
    list_type: 'enterprise_insights'
  })
}

// Track software category browsing
export const trackCategoryView = (category, totalSoftware) => {
  trackSoftwareEvent('category_view', {
    category_name: category.name,
    category_slug: category.slug,
    total_software_in_category: totalSoftware,
    market_size: category.market_stats?.market_size || 'unknown'
  })
}

// Track search queries
export const trackSearch = (query, resultsCount, filters = {}) => {
  trackSoftwareEvent('search', {
    search_query: query,
    results_count: resultsCount,
    filters_applied: Object.keys(filters).length,
    filters: filters
  })
}

// Track implementation guide downloads
export const trackImplementationGuide = (software, guideType) => {
  trackSoftwareEvent('implementation_guide_download', {
    software_name: software.name,
    guide_type: guideType,
    software_category: software.category,
    expected_implementation_cost: software.pricing?.implementation_cost || 'unknown'
  })
}

// Track ROI calculator usage
export const trackROICalculator = (software, inputs, calculatedROI) => {
  trackSoftwareEvent('roi_calculator_used', {
    software_name: software.name,
    software_category: software.category,
    calculated_roi: calculatedROI,
    company_size: inputs.companySize,
    current_solution: inputs.currentSolution || 'none'
  })
}

// Track vendor contact requests
export const trackVendorContact = (software, contactType) => {
  trackSoftwareEvent('vendor_contact_request', {
    software_name: software.name,
    software_category: software.category,
    contact_type: contactType, // 'demo', 'pricing', 'trial', 'sales'
    expected_deal_size: software.pricing?.enterprise_price || software.pricing?.starting_price
  })
}