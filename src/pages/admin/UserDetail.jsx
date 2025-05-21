import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import SpinLoader from '../../components/loaders/SpinLoader';
import SomethingWentWrong from '../../components/errors/SomethingWentWrong';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialUserData, setInitialUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch user data
  const { 
    isLoading,
    isError,
    data: userData,
    sendRequest: fetchUserData
  } = useAuthHttp(`http://localhost:8000/api/admin/users/${id}/`);

  // Update user data
  const {
    sendRequest: updateUserData
  } = useAuthHttp(`http://localhost:8000/api/admin/users/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });

  useEffect(() => {
    if (userData) {
      const userDetailData = {
        username: userData.username || '',
        password: '',
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || ''
      };
      setFormData(userDetailData);
      setInitialUserData(userDetailData);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  

  const isDataChanged = JSON.stringify(formData) !== JSON.stringify(initialUserData);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      
      const updateData = {
        ...(formData.username.trim() && { username: formData.username }),
        ...(formData.password.trim() && { password: formData.password }),
        ...(formData.email.trim() && { email: formData.email }),
        ...(formData.first_name.trim() !== undefined && { first_name: formData.first_name }),
        ...(formData.last_name.trim() !== undefined && { last_name: formData.last_name }),
      };
      
      const response = await updateUserData(updateData);
      console.log(response);
      
      if (response?.isError) {
        if (response.errorMessage.hasOwnProperty('email')) {
          setErrors({ email: response.errorMessage.email[0] });
        } else if (response.errorMessage.hasOwnProperty('username')) {
          setErrors({ username: response.errorMessage.username[0] });
        } else {
          setErrors({
            'form': Object.values(response.errorMessage)[0] || "An error occurred. Please try again."
          });
        }
        showErrorToast('Failed to update user. Please check your input.');
      } else {
        console.log(response.email);
        setInitialUserData({
          username: response.username,
          password: '',
          email: response.email,
          first_name: response.first_name,
          last_name: response.last_name,
        });
        showSuccessToast('User updated successfully!');
      }
    } catch (error) {
      console.log(error.message);
      
      showErrorToast('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  if (isLoading) {
    return <SpinLoader />;
  }

  if (isError) {
    return <SomethingWentWrong />;
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Users
          </button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        {errors.form && (
          <motion.div 
            variants={itemVariants}
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md"
          >
            {errors.form}
          </motion.div>
        )}

        <div className="flex flex-col">
          <div className='grid grid-cols-3 gap-[1rem] mb-[1rem]'>
            {/* Username */}
          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </motion.div>

          {/* First Name */}
          <motion.div variants={itemVariants}>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
            />
          </motion.div>

          {/* Last Name */}
          <motion.div variants={itemVariants}>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
            />
          </motion.div>
          </div>
          <div className='grid grid-cols-2 gap-[0.5rem]'>
            {/* Email */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <span className="text-xs text-gray-500 italic">
                For security reasons, existing password cannot be displayed
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting || !isDataChanged}
            className={`px-6 py-2 ${isDataChanged ? 'bg-blue-600' : 'bg-gray-400'} text-white rounded-md font-medium transition-all duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            } ${isDataChanged ? 'hover:bg-blue-700' : 'hover:cursor-not-allowed'}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default UserDetail; 