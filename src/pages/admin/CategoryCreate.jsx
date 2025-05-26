import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthHttp from '../../hooks/useAuthHttp';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import SpinLoader from '../../components/loaders/SpinLoader';
import { AdminMgmtWrapper, AdminHeader } from '../../components/admin/AdminMgmtLayout';

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Use useAuthHttp for creating a category
  const {
    sendRequest: createCategory,
  } = useAuthHttp('http://localhost:8000/api/blog/categories/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showErrorToast('Please correct the errors in the form.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await createCategory(formData);
      
      if (response?.isError) {
        const errorObj = {};
        
        // Loop through all form fields to check for backend errors
        if (response.errorMessage && typeof response.errorMessage === 'object') {
          Object.keys(formData).forEach(field => {
            if (response.errorMessage.hasOwnProperty(field)) {
              // DRF typically returns errors as arrays
              errorObj[field] = Array.isArray(response.errorMessage[field]) 
                ? response.errorMessage[field][0] 
                : response.errorMessage[field];
            }
          });
          
          // Check for non-field errors or general detail errors
          if (response.errorMessage.non_field_errors) {
            errorObj.form = response.errorMessage.non_field_errors[0];
          } else if (response.errorMessage.detail) {
            errorObj.form = typeof response.errorMessage.detail === 'string' 
              ? response.errorMessage.detail 
              : response.errorMessage.detail[0] || "An error occurred. Please try again.";
          }
        } else if (typeof response.errorMessage === 'string') {
          errorObj.form = response.errorMessage;
        } else {
          errorObj.form = "An unexpected error occurred. Please try again.";
        }
        
        setErrors(errorObj);
        showErrorToast(errorObj.form || 'Failed to create category. Please check the form for errors.');
      } else {
        showSuccessToast('Category created successfully!');
        // Clear sessionStorage for category list to ensure fresh data on redirect
        sessionStorage.removeItem('adminCategoryListPage');
        sessionStorage.removeItem('adminCategoryListPerPage');
        sessionStorage.removeItem('adminCategoryListSearch');
        navigate('/admin/categories');
      }
    } catch (error) {
      showErrorToast('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminMgmtWrapper>
      <AdminHeader
        title="Create New Category"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        }
      />
      <div className="mt-8 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              required
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              placeholder="Enter a description for the category"
            ></textarea>
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </AdminMgmtWrapper>
  );
};

export default CategoryCreate;