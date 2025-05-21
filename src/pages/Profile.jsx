import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthHttp from '../hooks/useAuthHttp';
import SpinLoader from '../components/loaders/SpinLoader.jsx';
import SomethingWentWrong from '../components/errors/SomethingWentWrong.jsx';
import { showSuccessToast, showErrorToast } from '../utils/toastNotifs';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useAuth();
  const [initialProfileData, setInitialProfileData] = useState(null); 

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const { 
    isLoading: isLoadingProfile,
    isError: isLoadingProfileError,
    data: profileData,
  } = useAuthHttp('http://localhost:8000/api/auth/profile/');

  const {
    sendRequest: updateProfile
  } = useAuthHttp('http://localhost:8000/api/auth/profile/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });

  useEffect(() => {
    if (profileData) {
      const userProfileData = {
        username: profileData.username,
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || ''
      }
      setFormData(userProfileData);
      setInitialProfileData(userProfileData);
    }
  }, [profileData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const isProfileDataChanged = JSON.stringify(formData) !== JSON.stringify(initialProfileData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        ...(formData.first_name.trim() && { first_name: formData.first_name }),
        ...(formData.last_name.trim() && { last_name: formData.last_name }),
        ...(formData.email.trim() && { email: formData.email })
      };

      const response = await updateProfile(updateData);
      
      if (response?.isError) {
        
        if (response.errorMessage.hasOwnProperty('email')) {
          setErrors({ email: response.errorMessage.email[0] });
        } else {
          setErrors({
            'form': Object.values(response.errorMessage)[0] || "An error occurred. Please try again."
          });
        }
      } else { 
        setInitialProfileData({
          username: response.username,
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email
        });
        console.log(response);
        showSuccessToast('Profile updated successfully!');
      }
    } catch (error) {
      console.log(error.message)
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

  if (isLoadingProfile) {
    return <SpinLoader />;
  }

  if (isLoadingProfileError) {
    return <SomethingWentWrong />;
  }

  return (
    <motion.div 
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg my-[3rem]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-8" 
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-gray-800">Profile Settings</h2>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </motion.div>
      {errors.form && (
        <motion.div variants={itemVariants}>
          <p className="mt-1 text-sm text-red-600">{errors.form}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Username (disabled) */}
          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-sm text-gray-500">Username cannot be changed</p>
          </motion.div>

         <div className="flex gap-4 w-full max-w-full">
           {/* First Name */}
           <motion.div variants={itemVariants} className='w-[50%]'>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1 ">
              First Name (Optional)
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
              placeholder="Enter your first name"
            />
          </motion.div>

          {/* Last Name */}
          <motion.div variants={itemVariants} className='w-[50%]'>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name (Optional)
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
              placeholder="Enter your last name"
            />
          </motion.div>
         </div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </motion.div>

          {/* Password Change Link */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Want to change your password?</span>
              </div>
              <Link 
                to="/change_password" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Change Password
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isProfileDataChanged}
              className={`w-full px-6 py-3 ${isProfileDataChanged ? 'bg-blue-600' : 'bg-gray-400'} text-white cursor-pointer rounded-lg font-medium transition-all duration-200 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              } ${isProfileDataChanged ? 'hover:bg-blue-700' : 'hover:cursor-not-allowed hover:bg-gray-400 ' }`}
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
                'Update Profile'
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default Profile;