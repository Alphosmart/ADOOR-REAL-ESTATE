import React from 'react'
import { useSelector } from 'react-redux'
import HorizontalCardProduct from '../components/HorizontalCardProduct.jsx'
import VerticalCardProduct from '../components/VerticalCardProduct.jsx'
import useSiteContent from '../hooks/useSiteContent'
import { Link } from 'react-router-dom'
import { FaHome, FaBuilding, FaKey, FaHandshake, FaStar, FaMapMarkerAlt, FaPhone, FaCheckCircle, FaUsers, FaAward, FaShieldAlt } from 'react-icons/fa'

const Home = () => {
  const user = useSelector(state => state?.user?.user)
  const { content: homeContent } = useSiteContent('homePage')

  // Default content fallback
  const heroContent = homeContent?.hero || {
    title: "Find Your Dream Property in Nigeria",
    subtitle: "Discover premium residential and commercial properties across Lagos, Abuja, and major Nigerian cities. Expert guidance from property search to ownership.",
    primaryButtonText: "Browse Properties",
    primaryButtonLink: "/properties",
    secondaryButtonText: "Contact Us",
    secondaryButtonLink: "/contact-us"
  }

  const stats = [
    { number: '500+', label: 'Properties Listed', icon: FaHome },
    { number: '2,000+', label: 'Happy Clients', icon: FaUsers },
    { number: '10+', label: 'Years Experience', icon: FaAward },
    { number: '98%', label: 'Client Satisfaction', icon: FaStar }
  ]

  const services = [
    {
      icon: FaHome,
      title: 'Property Sales',
      description: 'Buy your dream home from our extensive portfolio of residential and commercial properties.'
    },
    {
      icon: FaKey,
      title: 'Property Rentals',
      description: 'Find the perfect rental property that suits your budget and lifestyle needs.'
    },
    {
      icon: FaHandshake,
      title: 'Property Management',
      description: 'Professional property management services for landlords and investors.'
    },
    {
      icon: FaBuilding,
      title: 'Real Estate Consulting',
      description: 'Expert advice on property investment, valuation, and market trends.'
    }
  ]

  const features = [
    { icon: FaCheckCircle, text: 'Verified Property Listings' },
    { icon: FaShieldAlt, text: 'Secure Transactions' },
    { icon: FaMapMarkerAlt, text: 'Prime Locations' },
    { icon: FaPhone, text: '24/7 Customer Support' }
  ]

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent-800 via-accent-700 to-primary-500 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {heroContent.title}
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto opacity-90 leading-relaxed">
              {heroContent.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to={heroContent.primaryButtonLink} 
                className="bg-primary-500 text-white px-10 py-5 rounded-lg font-semibold text-lg hover:bg-primary-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                {heroContent.primaryButtonText}
              </Link>
              <Link 
                to={heroContent.secondaryButtonLink} 
                className="bg-white text-accent-800 px-10 py-5 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl border-2 border-white"
              >
                {heroContent.secondaryButtonText}
              </Link>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <feature.icon className="text-primary-300 text-xl" />
                  <span className="text-sm md:text-base font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="text-primary-500 text-4xl mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-accent-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-accent-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <service.icon className="text-primary-500 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-accent-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-accent-800 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600">Explore our handpicked selection of premium properties</p>
          </div>
          <VerticalCardProduct category={"all"} heading={"Latest Listings"} limit={8} />
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-accent-800 mb-12 text-center">Browse by Category</h2>
          <HorizontalCardProduct category={"houses"} heading={"Houses & Villas"} />
          <HorizontalCardProduct category={"apartments"} heading={"Apartments & Condos"} />
          <HorizontalCardProduct category={"commercial"} heading={"Commercial Properties"} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-accent-800 mb-4">Why Choose Adoor Real Estate</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner in finding the perfect property
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-primary-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-accent-800 mb-4">Trusted & Verified</h3>
              <p className="text-gray-600 leading-relaxed">
                All our properties are thoroughly verified and legally documented to ensure your peace of mind.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-primary-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-accent-800 mb-4">Expert Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                Our experienced real estate professionals guide you through every step of your property journey.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaAward className="text-primary-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-accent-800 mb-4">Award Winning</h3>
              <p className="text-gray-600 leading-relaxed">
                Recognized for excellence in real estate services across Nigeria with numerous industry awards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Let our experts help you discover the perfect property that matches your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/properties" 
              className="bg-white text-primary-600 px-10 py-5 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              View All Properties
            </Link>
            <Link 
              to="/contact-us" 
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home