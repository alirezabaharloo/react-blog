import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function AccessDenied() {
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <motion.div
        >
          <motion.div 
            className="flex justify-center mb-2"
            initial={{ scale: 0,  }}
            animate={{ scale: 1, }}
            transition={{ delay: 0.1, duration:0.4, type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-25 w-25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-center text-red-600 mb-4"
            initial={{ opacity: 0, y: -40, x: 20 }}
            animate={{ opacity: 1, y: 0, x:0 }}
            transition={{ delay: 0.1, duration:0.4, type: "spring", stiffness: 260, damping: 20 }}
          >
            Access Denied
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 text-center mb-6"
            initial={{ opacity: 0,  x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration:0.4, type: "spring", stiffness: 260, damping: 20 }}
          >
            You don't have permission to access the admin area. Please contact an administrator if you believe this is an error.
          </motion.p>

          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.1, duration:0.4, type: "spring", stiffness: 260, damping: 20 }}
            >
              Return to Home
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}