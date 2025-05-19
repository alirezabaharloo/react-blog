import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      
      if (!result.success) {
        setError(result.error ? result.error[0] : 'Failed to login. Please check your credentials.');
      } else {
        navigate("/");
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
        staggerChildren: 0.2,
        duration: 0.5
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

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
    disabled: { opacity: 0.7 }
  };

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
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </motion.div>

      {error && (
        <motion.div 
          className="bg-red-50 text-red-600 p-3 rounded-md mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" }}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
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
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
            placeholder="Enter your username"
          />
        </motion.div>

        <motion.div className="mb-6" variants={itemVariants}>
          <div className="flex justify-between mb-2">
            <label htmlFor="password" className="text-gray-700">Password</label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <motion.input
            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
            transition={{ duration: 0.2 }}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
            placeholder="Enter your password"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            animate={isLoading ? "disabled" : "visible"}
            disabled={isLoading}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-200 relative overflow-hidden"
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
                Signing in...
              </motion.div>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </motion.div>
      </form>

      <motion.div 
        className="text-center mt-6"
        variants={itemVariants}
      >
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login; 