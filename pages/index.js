import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import softwareDatabase from '../data/enterprise-software-database.json'
import { trackSoftwareEvent } from '../utils/analytics'

export default function HomePage({ stats, featuredSoftware, categories }) {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('')

  const handleNewsletterSignup = async (e) => {
    e.preventDefault()
    setNewsletterStatus('loading')
    
    trackSoftwareEvent('newsletter_signup', {
      source: 'homepage_hero',
      email_domain: email.split('@')[1]
    })
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'homepage_hero',
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json()

      if (result.success) {
        setNewsletterStatus('success')
        setEmail('')
      } else {
        setNewsletterStatus('error')
        console.error('Newsletter signup failed:', result.message)
      }
    } catch (error) {
      setNewsletterStatus('error')
      console.error('Newsletter signup error:', error)
    }
  }

  const handleSoftwareClick = (software, location) => {
    trackSoftwareEvent('software_click', {
      software_name: software.name,
      software_category: software.category,
      click_location: location,
      source: 'homepage'
    })
  }

  return (
    <div className="homepage min-h-screen bg-gray-50">
      {/* SEO Head */}
      <Head>
        <title>Enterprise Software Hub 2025 - Compare Business Software Solutions | Trusted by IT Directors</title>
        <meta name="description" content="Compare the best enterprise software solutions for 2025. Expert reviews, ROI analysis, and implementation guides trusted by 10,000+ IT directors and CTOs." />
        <meta name="keywords" content="enterprise software, business software comparison, CRM systems, project management, HR software, ERP systems" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Enterprise Software Hub 2025 - Business Software Comparison" />
        <meta property="og:description" content="Find your perfect enterprise software solution. Compare CRM, ERP, project management tools with expert analysis from IT professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://enterprisesoftwarehub.com" />
        <meta property="og:image" content="https://enterprisesoftwarehub.com/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Enterprise Software Hub 2025 - Business Software Comparison" />
        <meta name="twitter:description" content="Find your perfect enterprise software solution with expert reviews and ROI analysis." />
        
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Enterprise Software Hub",
              "description": "Comprehensive comparison platform for enterprise business software solutions",
              "url": "https://enterprisesoftwarehub.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://enterprisesoftwarehub.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "Organization",
                "name": "Enterprise Software Hub",
                "description": "Business software comparison platform trusted by 10,000+ IT directors and CTOs",
                "url": "https://enterprisesoftwarehub.com"
              }
            })
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block bg-blue-600 bg-opacity-40 text-blue-100 px-6 py-3 rounded-full text-lg font-medium mb-6">
                🏢 Trusted by 10,000+ IT Directors & CTOs
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Enterprise Software
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-4xl mx-auto">
                Compare {stats.totalSoftware}+ enterprise business solutions. 
                Get expert analysis, ROI calculations, and implementation guides 
                from the platform trusted by Fortune 500 IT teams.
              </p>
            </div>

            {/* Value Proposition Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">{stats.totalSoftware}+</div>
                <div className="text-blue-200">Enterprise Tools</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-blue-200">IT Professionals</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">6.5X</div>
                <div className="text-blue-200">Average ROI</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold mb-2">$2.1B</div>
                <div className="text-blue-200">Cost Savings</div>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/software">
                <a className="bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
                  🎯 Find Enterprise Solution (Free)
                </a>
              </Link>
              <Link href="/categories">
                <a className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-700 transition-colors">
                  📊 Compare All Categories
                </a>
              </Link>
            </div>

            {/* Newsletter Signup */}
            <div className="max-w-md mx-auto">
              <p className="text-blue-200 mb-4">
                Get weekly enterprise software insights + exclusive vendor discounts
              </p>
              <form onSubmit={handleNewsletterSignup} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? '...' : 'Subscribe'}
                </button>
              </form>
              {newsletterStatus === 'success' && (
                <p className="text-green-300 mt-2 text-sm">
                  ✓ Success! Check your email for enterprise software insights.
                </p>
              )}
              {newsletterStatus === 'error' && (
                <p className="text-red-300 mt-2 text-sm">
                  ⚠ Something went wrong. Please try again.
                </p>
              )}
              <p className="text-xs text-blue-300 mt-2">
                No spam, unsubscribe anytime. Join 10,000+ IT professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Enterprise Software Selection is Critical
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              With {stats.totalSoftware}+ enterprise solutions available, choosing the wrong platform 
              can cost your organization millions in failed implementations, lost productivity, and vendor lock-in.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💸</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Failed Implementations</h3>
                <p className="text-gray-600">
                  60% of enterprise software projects fail, costing organizations 
                  $2M+ in wasted resources and lost opportunity costs.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vendor Lock-in</h3>
                <p className="text-gray-600">
                  Poor software choices lead to expensive vendor dependencies, 
                  integration challenges, and limited scalability options.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⏰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Delayed ROI</h3>
                <p className="text-gray-600">
                  IT teams spend 6+ months evaluating solutions instead of 
                  focusing on strategic initiatives and digital transformation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Smart Way to Choose Enterprise Software
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our proven methodology helps IT directors find the perfect enterprise 
                solution in weeks, not months, backed by real implementation data.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Requirements Analysis</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Define your technical requirements, integration needs, and scalability goals. 
                  Get personalized recommendations based on your industry and company size.
                </p>
                <Link href="/requirements">
                  <a className="text-blue-600 font-semibold hover:underline">
                    Start Analysis →
                  </a>
                </Link>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Compare Solutions</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Side-by-side comparison of features, pricing, implementation costs, and ROI. 
                  Filter by your specific technical and business requirements.
                </p>
                <Link href="/compare">
                  <a className="text-blue-600 font-semibold hover:underline">
                    View Comparisons →
                  </a>
                </Link>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Implementation Guide</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Get detailed implementation timelines, cost breakdowns, and ROI projections. 
                  Access our vendor negotiation templates and deployment checklists.
                </p>
                <Link href="/implementation">
                  <a className="text-blue-600 font-semibold hover:underline">
                    Get Implementation Guide →
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Software */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Top-Rated Enterprise Software
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Vetted by our team and validated by 10,000+ IT professionals. 
                These solutions consistently deliver exceptional ROI and implementation success.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredSoftware.map((software, index) => (
                <FeaturedSoftwareCard 
                  key={software.id} 
                  software={software} 
                  rank={index + 1}
                  onSoftwareClick={handleSoftwareClick}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/software">
                <a className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-lg">
                  View All {stats.totalSoftware}+ Solutions
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Software Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Browse by Category
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find enterprise software solutions for your specific business needs. Each category includes 
                expert analysis, implementation guides, and cost-benefit analysis.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {Object.values(categories).map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Community */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Join 10,000+ IT Professionals
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Get access to our exclusive community, weekly software reviews, 
              and insider vendor discounts on enterprise solutions.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-5xl font-bold mb-2">10,000+</div>
                <div className="text-blue-200">IT Directors & CTOs</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">4.8/5</div>
                <div className="text-blue-200">Average Solution Rating</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">$2.1B+</div>
                <div className="text-blue-200">Cost Savings Generated</div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Enterprise?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Start with our free requirements analysis and discover which enterprise 
                software solution will deliver the best ROI for your organization.
              </p>
              <Link href="/software">
                <a className="bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg">
                  Find My Perfect Solution - Free
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Featured Software Card Component
const FeaturedSoftwareCard = ({ software, rank, onSoftwareClick }) => {
  const handleClick = () => {
    onSoftwareClick(software, 'homepage_featured')
  }

  const handleAffiliateClick = (e) => {
    e.preventDefault()
    trackSoftwareEvent('affiliate_click', {
      software_name: software.name,
      software_category: software.category,
      click_location: 'homepage_featured',
      expected_commission: software.affiliate.commission_amount,
      source: 'homepage'
    })
    window.open(software.affiliate.link, '_blank')
  }

  return (
    <div className="software-card bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-600">
            {software.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{software.name}</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(software.ratings.overall_score) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
              <span className="text-sm text-gray-600 ml-1">
                {software.ratings.overall_score}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            ${software.pricing.starting_price}
            <span className="text-sm font-normal text-gray-600">/user/mo</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 leading-relaxed">
        {software.description}
      </p>
      
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
        <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
          {software.features.target_audience}
        </p>
      </div>
      
      <div className="flex gap-2">
        <Link href={`/software/${software.category}`}>
          <a 
            onClick={handleClick}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors text-sm"
          >
            Learn More
          </a>
        </Link>
        <button
          onClick={handleAffiliateClick}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
        >
          {software.pricing.free_trial ? 'Try Free' : 'Get Demo'}
        </button>
      </div>
    </div>
  )
}

// Category Card Component
const CategoryCard = ({ category, index }) => {
  const icons = ['🏢', '📊', '👥', '💼']
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600', 
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600'
  ]

  return (
    <Link href={`/software/${category.slug}`}>
      <a className="category-card group block bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className={`w-16 h-16 bg-gradient-to-r ${colors[index % colors.length]} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
          {icons[index % icons.length]}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {category.description}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-blue-600 font-medium">
            {category.tools.length} solutions available
          </span>
          <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
            Explore →
          </span>
        </div>
      </a>
    </Link>
  )
}

export const getStaticProps = async () => {
  const categories = softwareDatabase.categories
  const software = softwareDatabase.tools
  
  // Calculate stats
  const totalSoftware = Object.keys(software).length
  const totalCategories = Object.keys(categories).length
  
  // Get featured software (top-rated from each category)
  const featuredSoftware = []
  Object.values(categories).forEach(category => {
    const categorySoftware = category.tools
      .map(softwareId => software[softwareId])
      .filter(Boolean)
      .sort((a, b) => b.ratings.overall_score - a.ratings.overall_score)
    
    // Add top software from each category
    if (categorySoftware.length > 0) {
      featuredSoftware.push(categorySoftware[0])
    }
  })
  
  // Sort featured software by rating and take top 6
  featuredSoftware.sort((a, b) => b.ratings.overall_score - a.ratings.overall_score)

  return {
    props: {
      stats: {
        totalSoftware,
        totalCategories
      },
      featuredSoftware: featuredSoftware.slice(0, 6),
      categories
    },
    revalidate: 86400 // Revalidate daily
  }
}