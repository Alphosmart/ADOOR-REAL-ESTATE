import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaBuilding, FaChevronLeft, FaChevronRight, FaHome, FaKey, FaMapMarkerAlt, FaSearch } from 'react-icons/fa'
import VerticalCardProduct from '../components/VerticalCardProduct.jsx'
import useSiteContent from '../hooks/useSiteContent'

const Home = () => {
  const { content: siteContent } = useSiteContent()
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [intent, setIntent] = useState('buy')
  const [propertyType, setPropertyType] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const hero = siteContent?.homePage?.hero || {
    title: 'Where do you want to live?',
    subtitle: 'Search verified homes and investment opportunities across Nigeria.',
    primaryButtonText: 'Show properties',
    primaryButtonLink: '/search',
    secondaryButtonText: 'Explore Lagos',
    secondaryButtonLink: '/search?q=Lagos'
  }
  const slides = hero.slides?.filter(slide => slide?.videoUrl || slide?.posterUrl) || []
  const heroSlides = slides.length ? slides : [{ title: 'Exceptional homes. Remarkable places.', location: 'Nigeria', posterUrl: `${process.env.PUBLIC_URL}/adoo.jpeg`, videoUrl: '' }]
  const activeVideoUrl = heroSlides[activeSlide]?.videoUrl
  const nextSlide = () => setActiveSlide(current => (current + 1) % heroSlides.length)
  const previousSlide = () => setActiveSlide(current => (current - 1 + heroSlides.length) % heroSlides.length)

  useEffect(() => {
    if (activeVideoUrl || heroSlides.length < 2) return undefined
    const timer = setTimeout(() => setActiveSlide(current => (current + 1) % heroSlides.length), 6500)
    return () => clearTimeout(timer)
  }, [activeSlide, activeVideoUrl, heroSlides.length])
  const submitSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams({ q: location, intent, ...(propertyType && { category: propertyType }) })
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="adoo-home">
      <section className="adoo-video-hero">
        <div className="adoo-video-stage">
          {heroSlides.map((slide, index) => (
            <div className={`adoo-video-slide ${index === activeSlide ? 'active' : ''}`} key={`${slide.videoUrl}-${index}`}>
              {slide.videoUrl ? <video src={slide.videoUrl} poster={slide.posterUrl || undefined} autoPlay muted playsInline onEnded={nextSlide} /> : <div className="adoo-slide-poster" style={{ backgroundImage: `url(${slide.posterUrl})` }} />}
            </div>
          ))}
          <div className="adoo-video-overlay" />
          <div className="adoo-video-copy">
            <p className="adoo-kicker">ADOOR presents</p>
            <h1>{hero.title}</h1>
            <p>{hero.subtitle}</p>
          </div>
          <div className="adoo-slide-label"><span>{String(activeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span><div><small>{heroSlides[activeSlide]?.location || 'Featured property'}</small><strong>{heroSlides[activeSlide]?.title || 'Find your next address'}</strong></div></div>
          {heroSlides.length > 1 && <div className="adoo-carousel-controls"><button onClick={previousSlide} aria-label="Previous video"><FaChevronLeft /></button><button onClick={nextSlide} aria-label="Next video"><FaChevronRight /></button></div>}
        </div>
        <form className="adoo-hero-search" onSubmit={submitSearch}>
          <div className="adoo-intent-tabs">{['buy', 'rent', 'invest'].map(option => <button type="button" key={option} className={intent === option ? 'active' : ''} onClick={() => setIntent(option)}>{option}</button>)}</div>
          <label><span>Location</span><div><FaMapMarkerAlt /><input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, area or landmark" /></div></label>
          <label><span>Property type</span><select value={propertyType} onChange={e => setPropertyType(e.target.value)}><option value="">All properties</option><option value="houses">House or villa</option><option value="apartments">Apartment</option><option value="commercial">Commercial</option><option value="land">Land</option></select></label>
          <button type="submit"><FaSearch /><span>Search</span></button>
        </form>
      </section>

      <section className="adoo-market-bar">
        <div className="adoo-shell"><p>Explore by market</p>{['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'].map(city => <Link key={city} to={`/search?q=${encodeURIComponent(city)}`}>{city}<FaArrowRight /></Link>)}</div>
      </section>

      <section className="adoo-shell adoo-listings-section">
        <div className="adoo-heading"><div><p className="adoo-kicker">Curated for you</p><h2>Properties worth seeing</h2></div><Link to="/search">View all properties <FaArrowRight /></Link></div>
        <VerticalCardProduct featured heading="Featured properties" limit={8} />
      </section>

      <section className="adoo-shell adoo-paths">
        <div className="adoo-heading"><div><p className="adoo-kicker">Start your journey</p><h2>What brings you to ADOOR?</h2></div></div>
        <div className="adoo-path-grid">
          <Link to="/search?intent=buy"><FaHome /><span>01</span><h3>Buy a home</h3><p>Find a verified home that fits the way you live.</p><b>Explore homes <FaArrowRight /></b></Link>
          <Link to="/search?intent=rent"><FaKey /><span>02</span><h3>Find a rental</h3><p>Discover flexible living in the right neighbourhood.</p><b>Browse rentals <FaArrowRight /></b></Link>
          <Link to="/contact-us"><FaBuilding /><span>03</span><h3>Invest in property</h3><p>Build a stronger portfolio with local market insight.</p><b>Speak to an adviser <FaArrowRight /></b></Link>
        </div>
      </section>

      <section className="adoo-advice"><div className="adoo-shell adoo-advice-grid"><div><p className="adoo-kicker">People before property</p><h2>Good decisions start with good local advice.</h2></div><div><p>From the first shortlist to document verification and closing, our team gives you a clear path through the Nigerian property market.</p><div className="adoo-stats"><span><strong>500+</strong>verified listings</span><span><strong>2,000+</strong>clients guided</span><span><strong>10+</strong>years of insight</span></div><Link to="/about-us">Meet ADOOR <FaArrowRight /></Link></div></div></section>

      <section className="adoo-shell adoo-cta"><div><p className="adoo-kicker">Ready when you are</p><h2>Let’s find your place.</h2></div><Link to="/contact-us">Book a consultation <FaArrowRight /></Link></section>
    </div>
  )
}

export default Home
