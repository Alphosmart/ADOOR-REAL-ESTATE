import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaPinterest, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaCreditCard,
  FaShieldAlt,
  FaHome
} from 'react-icons/fa';
import useSiteContent from '../hooks/useSiteContent';

const Footer = () => {
  const { content: footerContent } = useSiteContent('footer');

  // Default content fallback
  const companyInfo = footerContent?.companyInfo || {
    name: "Adoor Real Estate",
    description: "Your premier destination for premium real estate properties and home décor solutions. Transform your space with our extensive collection from trusted sellers worldwide.",
    address: "123 Design Street, Creative District, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "info@adoorrealestate.com"
  };

  return (
    <footer className='bg-gray-900 text-white'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          
          {/* Dynamic Company Information */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='bg-gradient-to-r from-accent-800 to-primary-500 p-2 rounded-lg'>
                <FaHome className='text-white text-xl' />
              </div>
              <h3 className='text-xl font-bold'>{companyInfo.name}</h3>
            </div>
            <p className='text-gray-300 text-sm leading-relaxed'>
              {companyInfo.description}
            </p>
            <div className='space-y-2'>
              <div className='flex items-center space-x-3 text-gray-300'>
                <FaMapMarkerAlt className='text-accent-400 flex-shrink-0' />
                <span className='text-sm'>{companyInfo.address}</span>
              </div>
              <div className='flex items-center space-x-3 text-gray-300'>
                <FaPhone className='text-green-400 flex-shrink-0' />
                <span className='text-sm'>{companyInfo.phone}</span>
              </div>
              <div className='flex items-center space-x-3 text-gray-300'>
                <FaEnvelope className='text-primary-400 flex-shrink-0' />
                <span className='text-sm'>{companyInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold border-b border-gray-700 pb-2'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link to="/" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/about-us" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold border-b border-gray-700 pb-2'>Client Services</h4>
            <ul className='space-y-2'>
              <li>
                <Link to="/about-us" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  About Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@adoorrealestate.com" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  Support Email
                </a>
              </li>
              <li>
                <span className='text-gray-300 text-sm'>
                  Support Hours: Mon-Fri 9AM-6PM EST
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold border-b border-gray-700 pb-2'>Legal & Social</h4>
            <ul className='space-y-2'>
              <li>
                <Link to="/privacy-policy" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className='text-gray-300 hover:text-accent-400 transition-colors text-sm'>
                  Cookie Policy
                </Link>
              </li>
            </ul>
            
            {/* Social Media Links */}
            <div className='pt-4'>
              <h5 className='text-sm font-medium text-gray-400 mb-3'>Follow Us</h5>
              <div className='flex space-x-3'>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className='bg-accent-600 hover:bg-accent-700 p-2 rounded-lg transition-colors'>
                  <FaFacebook className='text-white' />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className='bg-primary-600 hover:bg-primary-700 p-2 rounded-lg transition-colors'>
                  <FaInstagram className='text-white' />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className='bg-accent-400 hover:bg-accent-500 p-2 rounded-lg transition-colors'>
                  <FaTwitter className='text-white' />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"
                   className='bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors'>
                  <FaPinterest className='text-white' />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust Indicators */}
      <div className='border-t border-gray-800'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
            
            {/* Payment & Security Icons */}
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <FaShieldAlt className='text-accent-400 text-lg' />
                <span className='text-gray-400 text-sm'>SSL Protected</span>
              </div>
              <div className='flex items-center space-x-2'>
                <FaHome className='text-primary-400 text-lg' />
                <span className='text-gray-400 text-sm'>Verified Properties</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className='flex items-center space-x-3'>
              <span className='text-gray-400 text-sm'>Stay updated:</span>
              <div className='flex'>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className='bg-gray-800 border border-gray-600 rounded-l-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-accent-500'
                />
                <button className='bg-accent-600 hover:bg-accent-700 px-4 py-2 rounded-r-lg text-sm font-medium transition-colors'>
                  Subscribe
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className='border-t border-gray-800 bg-gray-950'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-col md:flex-row items-center justify-between text-center md:text-left'>
            <p className='text-gray-400 text-sm'>
              © {new Date().getFullYear()} Adoor Real Estate. All rights reserved.
            </p>
            <div className='mt-2 md:mt-0'>
              <p className='text-gray-500 text-xs'>
                Developed with ❤️ by{' '}
                <span className='text-accent-400 font-medium' title="YouTube Channel">
                  Dynamic Coding with Alphonsus
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;