import React from 'react'
import { useSelector } from 'react-redux'
// import BannerProduct from '../components/BannerProduct.jsx'
import HorizontalCardProduct from '../components/HorizontalCardProduct.jsx'
import VerticalCardProduct from '../components/VerticalCardProduct.jsx'
import BackendStatus from '../components/BackendStatus'
import useSiteContent from '../hooks/useSiteContent'
import { Link } from 'react-router-dom'

const Home = () => {
  console.log('🔍 Home component: Rendering at', new Date().toISOString());
  
  const user = useSelector(state => state?.user?.user)
  const { content: homeContent } = useSiteContent('homePage')

  console.log('🔍 Home component: User state:', user?.name || 'Not logged in');
  console.log('🔍 Home component: Site content loading...');

  // Default content fallback
  const heroContent = homeContent?.hero || {
    title: "Find Your Dream Property",
    subtitle: "Explore our exclusive collection of residential and commercial properties in Lagos and beyond. Professional consultation and property viewing services available.",
    primaryButtonText: "View Properties",
    primaryButtonLink: "/properties",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "/about-us"
  }

  return (
    <div>
      <BackendStatus />
      
      <p className="text-center p-4 text-red-600 font-bold">🔍 DEBUG: Home component is rendering successfully!</p>
      
      {/* Dynamic Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {heroContent.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={heroContent.primaryButtonLink} 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {heroContent.primaryButtonText}
            </Link>
            <Link 
              to={heroContent.secondaryButtonLink} 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              {heroContent.secondaryButtonText}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Temporarily commenting out product components to debug */}
      {/* <BannerProduct /> */}
      
      <p className="text-center p-4 text-blue-600 font-bold">🔍 DEBUG: About to load VerticalCardProduct...</p>
      
      {/* Show all properties from our company */}
      <VerticalCardProduct category={"all"} heading={"All Properties"} />
      
      {/* Featured property categories */}
      <HorizontalCardProduct category={"houses"} heading={"Houses & Villas"} />
      <HorizontalCardProduct category={"apartments"} heading={"Apartments & Condos"} />

      <VerticalCardProduct category={"commercial"} heading={"Commercial Properties"} />
      <VerticalCardProduct category={"land"} heading={"Land & Plots"} />
      <VerticalCardProduct category={"villas"} heading={"Luxury Villas"} />
      <VerticalCardProduct category={"duplexes"} heading={"Duplexes"} />
      <VerticalCardProduct category={"penthouses"} heading={"Penthouses"} />
      <VerticalCardProduct category={"townhouses"} heading={"Townhouses"} />
      <VerticalCardProduct category={"studios"} heading={"Studio Apartments"} />
    </div>
  )
}

export default Home