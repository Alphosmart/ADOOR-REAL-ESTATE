import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Logo from './Logo';
import SmartSearchBar from './SmartSearchBar';
import {FaRegCircleUser} from 'react-icons/fa6';
import { FaChevronDown, FaEnvelope, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const dropdownRef = useRef(null)

  // Only show if user is admin or staff
  const isAdminOrStaff = user && (user.role === 'ADMIN' || user.role === 'STAFF')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuDisplay(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = useCallback(async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    })

    const data = await fetchData.json()

    if(data.success) {
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
      setMenuDisplay(false)
    }

    if(data.error) {
      toast.error(data.message)
    }
  }, [dispatch, navigate])

  const handleSearch = useCallback((query) => {
    if(query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }, [navigate])

  const toggleMenu = useCallback(() => {
    setMenuDisplay(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuDisplay(false)
  }, [])

  const userProfileImage = useMemo(() => {
    if (user?.profilePic) {
      return <img src={user.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
    }
    return <FaRegCircleUser />
  }, [user?.profilePic, user?.name])

  const adminMenuItems = useMemo(() => {
    if (!isAdminOrStaff) return null
    
    // Show property management options for admin and staff with upload permissions
    const canManageProperties = user.role === 'ADMIN' || 
                               (user.role === 'STAFF' && user.permissions?.canUploadProducts);
    
    if (canManageProperties) {
      return (
        <>
          <Link 
            to={'/add-product'} 
            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
            onClick={closeMenu}
          >
            <span className='text-sm'>➕</span>
            Add Property
          </Link>
          <Link 
            to={'/my-products'} 
            className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
            onClick={closeMenu}
          >
            <span className='text-sm'>🏠</span>
            Manage Properties
          </Link>
          {user.role === 'ADMIN' && (
            <Link 
              to={'/admin-panel'} 
              className='flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors' 
              onClick={closeMenu}
            >
              <span className='text-sm'>⚙️</span>
              Admin Panel
            </Link>
          )}
        </>
      )
    }
    
    return null
  }, [isAdminOrStaff, user, closeMenu])

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        <div className=''>
          <Link to={'/'}>
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div className='hidden lg:block w-full max-w-sm'>
          <SmartSearchBar 
            onSearch={handleSearch}
            placeholder="Search properties, locations..."
            showSuggestions={true}
          />
        </div>

        {/* Main Navigation */}
        <nav className='hidden lg:flex items-center gap-6 text-gray-700'>
          <Link to='/search' className='bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all font-medium shadow-md'>
            🏠 Browse Properties
          </Link>
          <Link to='/' className='hover:text-primary-600 transition-colors font-medium'>
            🏡 Home
          </Link>
          <Link to='/about-us' className='hover:text-primary-600 transition-colors font-medium'>
            About
          </Link>
          <Link to='/contact-us' className='hover:text-primary-600 transition-colors font-medium'>
            Contact
          </Link>
        </nav>

        <div className='flex items-center gap-7'>
          
          {isAdminOrStaff && user?.role === 'ADMIN' && (
            <Link to={"/add-product"} className='px-3 py-1 rounded-full text-white bg-primary-500 hover:bg-primary-600 hidden md:block shadow-md transition-all font-medium'>
              Add Property
            </Link>
          )}

          {/* Admin/Staff Profile Dropdown */}
          {isAdminOrStaff && (
            <div className='relative' ref={dropdownRef}>
              <div 
                className='flex items-center gap-2 cursor-pointer p-2 rounded-lg'
                onClick={toggleMenu}
              >
                <div className='text-2xl'>
                  {userProfileImage}
                </div>
                <div className='hidden md:block'>
                  <div className='text-sm font-medium text-gray-700'>{user?.name}</div>
                  <div className='text-xs text-gray-500 flex items-center gap-1'>
                    <FaShieldAlt className='text-primary-500' />
                    {user?.role}
                  </div>
                </div>
                <FaChevronDown className={`text-xs text-gray-400 transition-transform ${menuDisplay ? 'rotate-180' : ''}`} />
              </div>
              
              {menuDisplay && (
                <div 
                  className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[280px] z-50'
                >
                  {/* User Info Section */}
                  <div className='px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg'>
                    <div className='flex items-center gap-3'>
                      <div className='text-2xl'>
                        {userProfileImage}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                          <FaShieldAlt className='text-xs text-primary-500' />
                          <span className='font-medium text-gray-900'>{user?.name}</span>
                        </div>
                        <div className='flex items-center gap-2 mt-1'>
                          <FaEnvelope className='text-xs text-gray-500' />
                          <span className='text-sm text-gray-600'>{user?.email}</span>
                        </div>
                        <div className='text-xs text-primary-600 font-medium mt-1'>{user?.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <nav className='py-2'>
                    {adminMenuItems && (
                      <>
                        <div className='px-4 py-1'>
                          <span className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Management</span>
                        </div>
                        {adminMenuItems}
                      </>
                    )}
                  </nav>

                  {/* Logout Button */}
                  <hr className='border-gray-100' />
                  <div className='p-2'>
                    <button 
                      onClick={handleLogout} 
                      className='flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors'
                    >
                      <FaSignOutAlt className='text-sm' />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin Login Button - Only show if not logged in */}
          {!isAdminOrStaff && (
            <Link to={"/admin-login"} className='px-4 py-2 rounded-full text-white bg-accent-700 hover:bg-accent-800 transition-colors flex items-center gap-2'>
              <FaShieldAlt />
              Staff Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
