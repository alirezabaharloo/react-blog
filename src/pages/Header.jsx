import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { HEADER_DATA } from '../data/PAGE_DATAS.jsx';
import HeaderSearch from '../components/HeaderSearch';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

            {/* Auth Links */}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-200"
          >
            <motion.nav 
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="px-4 py-4"
            >
              <ul className="space-y-4">
                {HEADER_DATA.map((item) => (
                  <motion.li key={item.id} variants={itemVariants}>
                    <Link
                      to={item.path}
                      className={`block py-2 px-3 rounded-md transition-colors ${
                        item.name === 'Login' || item.name === 'Register' 
                          ? `font-medium ${item.name === 'Login' ? 'text-blue-600 border border-blue-600' : 'bg-blue-600 text-white'}`
                          : location.pathname === item.path
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 