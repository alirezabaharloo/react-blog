import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { HEADER_DATA } from '../../data/PAGE_DATAS.jsx';
import HeaderSearch from '../../components/HeaderSearch.jsx';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.jsx';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const userMenuRef = useRef(null);

  // Check if we're on mobile based on screen width
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Animation variants for the mobile menu
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // User menu animation variants
  const userMenuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  // Separate main nav items from auth items
  const mainNavItems = HEADER_DATA.slice(0, 4);
  const authItems = HEADER_DATA.slice(4);
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className={`text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'text-blue-600' : ''}`}>
            News Portal
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <nav className="flex-1">
              <ul className="flex space-x-2 lg:space-x-6">
                {
                  mainNavItems.map((item) => (
                    <li key={item.id} className='relative group'>
                      <Link to={item.path} className={`px-2 py-1 group-hover:text-blue-600 transition-all duration-300 ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-600'}`}>
                        {item.name}
                      </Link>
                      <span className={`absolute bottom-0 group-hover:w-full transition-all duration-400 h-[2px] bg-blue-600 left-0 ${location.pathname === item.path ? 'w-full' : 'w-0'}`}>
                      </span>
                    </li>
                  ))
                }
              </ul>
            </nav>
            
            {/* Search Component */}
            <HeaderSearch />

            {/* Auth Links or User Menu */}
            {isAuthenticated ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-gray-700">{user?.username || 'User'}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      variants={userMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    >
                      
                      <motion.div variants={itemVariants} className="py-1">
                        <Link to="/profile" onClick={() => setShowUserMenu(false)}   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="py-1 border-t border-gray-100">
                        <button 
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex space-x-2 ml-2">
                {authItems.map((item) => (
                  <Link 
                    key={item.id}
                    to={item.path}
                    className={`
                      px-4 py-2 rounded-md font-medium transition-all duration-200
                      ${item.name === 'Login' ? 
                        'text-blue-600 border border-blue-600 hover:bg-blue-50' : 
                        'bg-blue-600 text-white hover:bg-blue-700'
                      }
                      ${location.pathname === item.path ? 'ring-2 ring-blue-300' : ''}
                    `}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile Navigation Controls */}
          <div className="flex items-center md:hidden">
            <HeaderSearch />
            <button
              className="ml-4 p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={isOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-center items-center"
              >
                <motion.span
                  className="w-6 h-0.5 bg-current block mb-1.5"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 8 }
                  }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
                <motion.span
                  className="w-6 h-0.5 bg-current block"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
                <motion.span
                  className="w-6 h-0.5 bg-current block mt-1.5"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -8 }
                  }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, boxShadow: 'none' }}
            animate={{ height: 'auto', opacity: 1, boxShadow: '0 2rem 2rem rgba(0, 0, 0, 0.2)' }}
            exit={{ height: 0, opacity: 0, boxShadow: 'none' }} 
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-200 absolute top-16 left-0 right-0"
          >
            <motion.nav 
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="px-4 py-4"
            >
              <ul className="space-y-4">
                {mainNavItems.map((item) => (
                  <motion.li key={item.id} variants={itemVariants}>
                    <Link
                      to={item.path}
                      className={`block py-2 px-3 rounded-md transition-colors ${
                        location.pathname === item.path
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <motion.li variants={itemVariants}>
                      <div className="px-3 py-2 border-t border-gray-100 mt-2">
                        <div className="flex items-center space-x-3 py-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium">{user?.username || 'User'}</span>
                        </div>
                      </div>
                    </motion.li>
                    <motion.li variants={itemVariants}>
                      <Link 
                        to="/profile" 
                        className="block py-2 px-3 rounded-md transition-colors text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                      >
                        Your Profile
                      </Link>
                    </motion.li>
                    
                    {/* Admin Links for Mobile */}
                    {isAdmin && (
                      <>
                        <motion.li variants={itemVariants}>
                          <div className="px-3 py-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Admin</p>
                          </div>
                        </motion.li>
                        <motion.li variants={itemVariants}>
                          <Link 
                            to="/admin" 
                            className="block py-2 px-3 rounded-md transition-colors text-purple-600 hover:bg-purple-50"
                          >
                            Admin Dashboard
                          </Link>
                        </motion.li>
                        <motion.li variants={itemVariants}>
                          <Link 
                            to="/admin/users" 
                            className="block py-2 px-3 rounded-md transition-colors text-purple-600 hover:bg-purple-50"
                          >
                            Manage Users
                          </Link>
                        </motion.li>
                        <motion.li variants={itemVariants}>
                          <Link 
                            to="/admin/articles" 
                            className="block py-2 px-3 rounded-md transition-colors text-purple-600 hover:bg-purple-50"
                          >
                            Manage Articles
                          </Link>
                        </motion.li>
                        <motion.li variants={itemVariants}>
                          <Link 
                            to="/admin/categories" 
                            className="block py-2 px-3 rounded-md transition-colors text-purple-600 hover:bg-purple-50"
                          >
                            Manage Categories
                          </Link>
                        </motion.li>
                      </>
                    )}
                    
                    <motion.li variants={itemVariants}>
                      <div className="border-t border-gray-100 mt-2"></div>
                      <button
                        onClick={logout}
                        className="w-full text-left block py-2 px-3 rounded-md transition-colors text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </motion.li>
                  </>
                ) : (
                  <>
                    {authItems.map((item) => (
                      <motion.li key={item.id} variants={itemVariants}>
                        <Link
                          to={item.path}
                          className={`block py-2 px-3 rounded-md transition-colors ${
                            item.name === 'Login' || item.name === 'Register' 
                              ? `font-medium ${item.name === 'Login' ?
                               'text-blue-600 border border-blue-600' :
                              'bg-blue-600 text-white'}`
                              : location.pathname === item.path
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                          } ${location.pathname === '/login' && item.name === 'Login' ||
                             location.pathname === '/register' && item.name === 'Register' 
                             ? 'ring-2 ring-blue-300' : ''}`}
                        >
                          {item.name}
                        </Link>
                      </motion.li>
                    ))}
                  </>
                )}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile User Menu */}
      <AnimatePresence>
        {showUserMenu && isMobile && (
          <motion.div
            variants={userMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute right-4 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
            ref={userMenuRef}
          >
            <motion.div variants={itemVariants} className="py-1">
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowUserMenu(false)}
              >
                Your Profile
              </Link>
            </motion.div>
            
            {/* Admin Links for Mobile User Menu */}
            {isAdmin && (
              <motion.div variants={itemVariants} className="py-1 border-t border-gray-100">
                <Link 
                  to="/admin" 
                  className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  Admin Dashboard
                </Link>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants} className="py-1 border-t border-gray-100">
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 