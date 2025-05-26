import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import SpinLoader from '../../components/loaders/SpinLoader';
import AdminSomethingWentWrong from '../../components/admin/errors/AdminSomethingWentWrong';

const CategoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialCategoryData, setInitialCategoryData] = useState(null);

  // Fetch category data
  const { 
    isLoading,
    isError,
    data: categoryData,
  } = useAuthHttp(`http://localhost:8000/api/admin/categories/${id}/`);

  // Update category data
  const {
    sendRequest: updateCategoryData
  } = useAuthHttp(`http://localhost:8000/api/admin/categories/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });

  useEffect(() => {
    if (categoryData) {
      const categoryDetailData = {
        name: categoryData.name || '',
        description: categoryData.description || ''
      };
      setFormData(categoryDetailData);
      setInitialCategoryData(categoryDetailData);
    }
  }, [categoryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const isDataChanged = JSON.stringify(formData) !== JSON.stringify(initialCategoryData);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    let formErrors = {};
    if (!formData.name.trim()) {
      formErrors.name = 'Category name is required';
    }
    if (!formData.description.trim()) {
      formErrors.description = 'Category description is required';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };
      
      const response = await updateCategoryData(updateData);
      
      if (response?.isError) {
        if (response.errorMessage.hasOwnProperty('name')) {
          setErrors({ name: response.errorMessage.name[0] });
        } else if (response.errorMessage.hasOwnProperty('description')) {
          setErrors({ description: response.errorMessage.description[0] });
        } else {
          setErrors({
            'form': Object.values(response.errorMessage)[0] || "An error occurred. Please try again."
          });
        }
        showErrorToast('Failed to update category. Please check your input.');
      } else {
        setInitialCategoryData({
          name: response.name,
          description: response.description,
        });
        showSuccessToast('Category updated successfully!');
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
    return <AdminSomethingWentWrong />;
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
          <h1 className="text-2xl font-bold text-gray-800">Category Details</h1>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Categories
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

        <div className="flex flex-col space-y-4">
          {/* Category Name */}
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </motion.div>

          {/* Category Description */}
          <motion.div variants={itemVariants}>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting || !isDataChanged}
            className={`px-6 py-2 ${isDataChanged ? 'bg-blue-600' : 'bg-gray-400'} text-white rounded-md font-medium transition-all duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            } ${isDataChanged ? 'hover:bg-blue-700' : 'hover:cursor-not-allowed hover:bg-gray-400'}`}
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

export default CategoryDetail;



