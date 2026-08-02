import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { trackLandingPageInteraction, trackShopButtonClick, trackNewsletterSignup } from '../utils/analytics';
import SummaryApi from '../common';
import useSiteContent from '../hooks/useSiteContent';
import { 
  FaStar, 
  FaHeadset, 
  FaUsers, 
  FaAward,
  FaQuoteLeft,
  FaArrowRight,
  FaCheck,
  FaHeart,
  FaHome,
  FaBrush,
  FaRuler,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const LandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('houses');
  const [email, setEmail] = useState('');
  const [testimonials, setTestimonials] = useState([]);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const { content: homeContent } = useSiteContent('homePage');
  const heroContent = homeContent?.hero || {
    title: 'Find Your Dream Home',
    subtitle: 'Discover our exclusive collection of premium residential and commercial properties.',
    primaryButtonText: 'View Properties',
    primaryButtonLink: '/search',
    slides: []
  };
  const heroSlides = useMemo(() => {
    const configuredSlides = heroContent.slides?.filter(slide => slide?.videoUrl || slide?.posterUrl) || [];
    return configuredSlides.length ? configuredSlides : [{ videoUrl: '', posterUrl: '' }];
  }, [heroContent.slides]);

  const showNextHeroSlide = () => setActiveHeroSlide(current => (current + 1) % heroSlides.length);
  const showPreviousHeroSlide = () => setActiveHeroSlide(current => (current - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    if (activeHeroSlide >= heroSlides.length) setActiveHeroSlide(0);
  }, [activeHeroSlide, heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length < 2 || heroSlides[activeHeroSlide]?.videoUrl) return undefined;
    const timer = window.setTimeout(() => {
      setActiveHeroSlide(current => (current + 1) % heroSlides.length);
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [activeHeroSlide, heroSlides]);

  // Fetch testimonials on component mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${SummaryApi.getTestimonials.url}?limit=6`, {
          method: SummaryApi.getTestimonials.method,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        if (data.success) {
          // Always use API data, even if empty (respects admin's inactive settings)
          setTestimonials(data.data);
        } else {
          // Fallback testimonials only if API call fails
          setFallbackTestimonials();
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Use fallback testimonials on error
        setFallbackTestimonials();
      }
    };
    
    const setFallbackTestimonials = () => {
      setTestimonials([
        {
          name: "Sarah Johnson",
          role: "Interior Designer",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b788?w=100&h=100&fit=crop&crop=face",
          rating: 5,
          text: "Adoo Real Estate has transformed my design business. The quality and variety are unmatched, and my clients are always thrilled with the results."
        },
        {
          name: "Michael Chen",
          role: "Homeowner",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          rating: 5,
          text: "I found my dream home using this platform. The customer service was exceptional and the process was incredibly smooth."
        },
        {
          name: "Emma Rodriguez",
          role: "Property Investor",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          rating: 5,
          text: "Working with Adoo Real Estate has been exceptional. Their professionalism and property selection helped me find the perfect investment property."
        }
      ]);
    };
    
    fetchTestimonials();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      trackNewsletterSignup('landing_page');
      // Here you would typically send the email to your backend
      console.log('Newsletter signup:', email);
      setEmail('');
      alert('Thank you for subscribing!');
    }
  };



  const services = [
    {
      icon: FaHome,
      title: "Property Consultation",
      description: "Professional property investment advice from certified experts to help you choose the perfect property for your needs."
    },
    {
      icon: FaRuler,
      title: "Property Surveys",
      description: "Comprehensive property surveys and land measurement services for accurate documentation."
    },
    {
      icon: FaBrush,
      title: "Property Management",
      description: "Professional property management services to maintain and maximize your investment value."
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you throughout your property journey."
    }
  ];

  const featuredProducts = {
    houses: [
      {
        id: "697dbd235d42b12cdaa06a1b",
        name: "Luxury Villa Lekki",
        price: "₦85,000,000",
        originalPrice: "₦95,000,000",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 127
      },
      {
        id: "697dbd235d42b12cdaa06a1d",
        name: "Modern Duplex Ikoyi",
        price: "₦120,000,000",
        originalPrice: "₦135,000,000",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=300&fit=crop",
        rating: 4.9,
        reviews: 203
      },
      {
        id: "697dbd235d42b12cdaa06a1e",
        name: "Family Home Victoria Island",
        price: "₦75,000,000",
        originalPrice: "₦88,000,000",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 89
      }
    ],
    apartments: [
      {
        id: "697dbd235d42b12cdaa06a1c",
        name: "3BR Apartment Lekki",
        price: "₦45,000,000",
        originalPrice: "₦52,000,000",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 156
      },
      {
        id: "697dbd235d42b12cdaa06a1f",
        name: "2BR Flat Yaba",
        price: "₦28,500,000",
        originalPrice: "₦32,000,000",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 94
      }
    ],
    commercial: [
      {
        id: "697dbd235d42b12cdaa06a1b",
        name: "Office Space Ikeja",
        price: "₦150,000,000",
        originalPrice: "₦175,000,000",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=300&fit=crop",
        rating: 4.9,
        reviews: 78
      },
      {
        id: "697dbd235d42b12cdaa06a1c",
        name: "Retail Shop VI",
        price: "₦95,000,000",
        originalPrice: "₦110,000,000",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 112
      }
    ]
  };  const stats = [
    { number: "50K+", label: "Happy Clients", icon: FaUsers },
    { number: "5K+", label: "Properties Sold", icon: FaHome },
    { number: "20+", label: "Years Experience", icon: FaAward },
    { number: "99.9%", label: "Client Satisfaction", icon: FaHeart }
  ];

  return (
    <div className="min-h-screen">
      {/* Floating Contact Button */}
      <Link 
        to="/search" 
        onClick={() => trackShopButtonClick('floating_button', '/search')}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-accent-800 to-primary-500 text-white px-6 py-3 rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50 flex items-center gap-2"
      >
        🏠 View Properties
      </Link>

      {/* Hero Section */}
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-accent-800 via-accent-700 to-primary-500 text-white">
        <div className="absolute inset-0 -z-10">
          {heroSlides.map((slide, index) => (
            <div key={`${slide.videoUrl || slide.posterUrl}-${index}`} className={`absolute inset-0 transition-opacity duration-700 ${index === activeHeroSlide ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              {slide.videoUrl && index === activeHeroSlide ? (
                <video src={slide.videoUrl} poster={slide.posterUrl || undefined} autoPlay muted playsInline loop={heroSlides.length === 1} preload="auto" onEnded={showNextHeroSlide} className="h-full w-full object-cover" />
              ) : slide.posterUrl ? (
                <img src={slide.posterUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
        </div>

        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-end px-4 pb-24 pt-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold leading-tight drop-shadow-lg lg:text-6xl">{heroContent.title}</h1>
            <p className="mb-8 mt-5 max-w-3xl text-lg leading-relaxed text-gray-100 drop-shadow lg:text-xl">{heroContent.subtitle}</p>
            <Link to={heroContent.primaryButtonLink || '/search'} onClick={() => trackShopButtonClick('hero_section', heroContent.primaryButtonLink || '/search')} className="inline-flex items-center gap-2 border border-white bg-white px-8 py-4 font-semibold text-accent-700 transition hover:bg-transparent hover:text-white">
              {heroContent.primaryButtonText || 'View Properties'} <FaArrowRight />
            </Link>
          </div>
        </div>

        {heroSlides.length > 1 && (
          <>
            <div className="absolute bottom-8 left-4 z-10 flex gap-2 md:left-8">
              {heroSlides.map((slide, index) => <button key={`landing-hero-dot-${index}`} type="button" onClick={() => setActiveHeroSlide(index)} aria-label={`Show hero video ${index + 1}`} className={`h-2.5 rounded-full transition-all ${index === activeHeroSlide ? 'w-8 bg-primary-400' : 'w-2.5 bg-white/60 hover:bg-white'}`} />)}
            </div>
            <button type="button" onClick={showPreviousHeroSlide} aria-label="Previous hero video" className="absolute bottom-6 right-20 z-10 border border-white/60 bg-black/30 p-3 backdrop-blur-sm transition hover:bg-white hover:text-black"><FaChevronLeft /></button>
            <button type="button" onClick={showNextHeroSlide} aria-label="Next hero video" className="absolute bottom-6 right-6 z-10 border border-white/60 bg-black/30 p-3 backdrop-blur-sm transition hover:bg-white hover:text-black"><FaChevronRight /></button>
          </>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="text-2xl text-accent-600" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of premium properties, luxury homes, and investment opportunities
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              {[
                { key: 'houses', label: 'Houses' },
                { key: 'apartments', label: 'Apartments' },
                { key: 'commercial', label: 'Commercial' }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    selectedCategory === category.key
                      ? 'bg-white text-accent-600 shadow-md'
                      : 'text-gray-600 hover:text-accent-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts[selectedCategory]?.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-accent-600">{product.price}</span>
                      <span className="text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <Link 
                      to={`/product/${product.id}`}
                      className="bg-gradient-to-r from-accent-800 to-primary-500 text-white px-4 py-2 rounded-lg hover:from-accent-900 hover:to-primary-600 transition-all transform hover:scale-105 font-medium"
                    >
                      🏠 View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/search" 
              className="bg-gradient-to-r from-accent-800 to-primary-500 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-accent-900 hover:to-primary-600 transition-all transform hover:scale-105 inline-flex items-center gap-3 shadow-2xl"
            >
              🛍️ Explore All Products <FaArrowRight />
            </Link>
            <p className="text-gray-600 mt-4 text-lg">
              Over 15,000+ premium products waiting for you!
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Premium Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end solutions for your property investment and real estate needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center">
                <div className="bg-accent-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <service.icon className="text-2xl text-accent-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                <Link 
                  to="/search" 
                  className="text-accent-600 hover:text-accent-700 font-medium inline-flex items-center gap-1"
                >
                  Learn More <FaArrowRight className="text-sm" />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/search" 
              className="bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-700 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              🏠 Explore Our Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Why Choose Adoo Real Estate?</h2>
              
              <div className="space-y-6">
                {[
                  "Curated collection of premium properties in prime locations",
                  "Professional property consultation and viewing services",
                  "Transparent pricing with no hidden fees",
                  "Comprehensive property documentation and legal support",
                  "24/7 customer support from real estate experts",
                  "Secure transaction processing with client protection"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                      <FaCheck className="text-green-600" />
                    </div>
                    <p className="text-gray-700 text-lg">{feature}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link 
                  to="/about-us" 
                  className="text-accent-600 font-semibold text-lg hover:text-accent-700 inline-flex items-center gap-2"
                >
                  Learn More About Us <FaArrowRight />
                </Link>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=500&fit=crop" 
                alt="Beautiful property investment" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <FaAward className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Award Winning</div>
                    <div className="text-gray-600 text-sm">Design Excellence 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Only show if testimonials exist */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
              <p className="text-xl text-gray-600">
                Join thousands of satisfied customers who have transformed their spaces
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg relative">
                  <FaQuoteLeft className="text-accent-200 text-3xl mb-4" />
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-accent-800 to-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated with Latest Trends</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get exclusive access to new products, design tips, and special offers delivered to your inbox
          </p>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button 
                type="submit"
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm mt-4 opacity-80">
              No spam, unsubscribe at any time. Your privacy is protected.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and start your property investment journey today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/search" 
              onClick={() => trackShopButtonClick('final_cta', '/search')}
              className="bg-gradient-to-r from-primary-500 to-accent-800 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-primary-600 hover:to-accent-900 transition-all transform hover:scale-105 inline-flex items-center gap-3 shadow-2xl"
            >
              🏠 Browse Properties Now <FaArrowRight />
            </Link>
            <Link 
              to="/contact-us" 
              onClick={() => trackLandingPageInteraction('get_consultation', 'final_cta')}
              className="border-2 border-accent-600 text-accent-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-600 hover:text-white transition-colors"
            >
              Get Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
