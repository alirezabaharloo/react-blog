import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(-1);
    }
  }, [isAuthenticated, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      nextStep();
      return;
    }
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password
      };
      
      const result = await register(userData);
      
      if (result.success) {
        setSuccessMessage('Registration was successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle backend validation errors
        if (result.error.hasOwnProperty("username")) {
          setErrors(prev => ({...prev, username: result.error.username[0]}));
          setStep(1); // Go back to username step
        } else if (result.error.hasOwnProperty("password")) {
          setErrors(prev => ({...prev, password: result.error.password[0]}));
        } else {    
          setErrors(prev => ({...prev, form: result.error}));
        }
      }
    } catch (err) {
      setErrors({ form:'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 250 : -250,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 250 : -250,
      opacity: 0
    })
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
    disabled: { opacity: 0.7 }
  };

  if (successMessage) {
    return (
      <motion.div 
        className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg my-[8rem]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
          <p className="text-green-600 mt-2">{successMessage}</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <p className="text-gray-600">Redirecting to login page...</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg my-[8rem]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-8" 
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 mt-2">Join our community today</p>
      </motion.div>

      {errors.form && (
        <motion.div 
          className="bg-red-50 text-red-600 p-3 rounded-md mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {errors.form}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait" custom={step > 1 ? -1 : 1}>
          {step === 1 ? (
            <motion.div
              key="step1"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div className="mb-4" variants={itemVariants}>
                <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                <motion.input
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                  transition={{ duration: 0.2 }}
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <motion.p 
                    className="mt-1 text-red-500 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.username}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div className="mt-6" variants={itemVariants}>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              custom={-1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div className="mb-4" variants={itemVariants}>
                <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                <motion.input
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                  transition={{ duration: 0.2 }}
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <motion.p 
                    className="mt-1 text-red-500 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              <motion.div className="mb-6" variants={itemVariants}>
                <label htmlFor="confirm_password" className="block text-gray-700 mb-2">Confirm Password</label>
                <motion.input
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                  transition={{ duration: 0.2 }}
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Confirm your password"
                />
                {errors.confirm_password && (
                  <motion.p 
                    className="mt-1 text-red-500 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.confirm_password}
                  </motion.p>
                )}
              </motion.div>

              <motion.div className="flex gap-4" variants={itemVariants}>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Back
                </motion.button>
                
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  animate={isLoading ? "disabled" : "visible"}
                  disabled={isLoading}
                  type="submit"
                  className="w-2/3 bg-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-200"
                >
                  {isLoading ? (
                    <motion.div 
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </motion.div>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="text-center mt-6"
          variants={itemVariants}
        >
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Register; 