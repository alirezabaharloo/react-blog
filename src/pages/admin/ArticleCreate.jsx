import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthHttp from '../../hooks/useAuthHttp';
import SpinLoader from '../../components/loaders/SpinLoader';
import AdminSomethingWentWrong from '../../components/admin/errors/AdminSomethingWentWrong';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import { AdminMgmtWrapper, AdminHeader } from '../../components/admin/AdminMgmtLayout';

const ArticleCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Use useAuthHttp for creating an article
  const {
    sendRequest: createArticle,
  } = useAuthHttp('http://localhost:8000/api/admin/articles/', {
    method: 'POST',
  });

  // Fetch categories for the dropdown
  const {
    data: categoriesData,
    isLoading: isFetchingCategories,
    isError: isCategoriesError,
  } = useAuthHttp('http://localhost:8000/api/blog/categories/');

  useEffect(() => {
    if (categoriesData) {
      const cats = Array.isArray(categoriesData) ? categoriesData : (categoriesData.results || []);
      setCategories(cats);
      if (cats.length > 0 && !formData.category) {
        setFormData(prev => ({
          ...prev,
          category: cats[0].id.toString()
        }));
      }
      setIsCategoriesLoading(false);
    }
  }, [categoriesData, formData.category]);

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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Article title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
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

    // Prepare data for API - ensure category is numeric
    const articleData = {
      ...formData,
      category: parseInt(formData.category, 10)
    };

    try {
      const response = await createArticle(articleData);
      
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
        showErrorToast(errorObj.form || 'Failed to create article. Please check the form for errors.');
      } else {
        showSuccessToast('Article created successfully!');
        // Clear sessionStorage to ensure fresh data on redirect
        sessionStorage.removeItem('adminArticleListPage');
        sessionStorage.removeItem('adminArticleListFilters');
        sessionStorage.removeItem('adminArticleListPerPage');
        sessionStorage.removeItem('adminArticleListSearch');
        navigate('/admin/articles');
      }
    } catch (error) {
      showErrorToast('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCategoriesLoading && !categoriesData) {
    return <SpinLoader />;
  }

  return (
    <AdminMgmtWrapper>
      <AdminHeader
        title="Create New Article"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        }
      />
      <div className="mt-8 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {errors.form}
          </div>
        )}
        
        {isCategoriesError && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
            Could not load categories. Please ensure the backend is running and accessible. You can still attempt to create an article, but category selection will be limited.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={isFetchingCategories || categories.length === 0}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              className={`mt-1 block w-full px-3 py-2 border ${errors.excerpt ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="A short summary of the article..."
            ></textarea>
            {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              className={`mt-1 block w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Write your article content here..."
            ></textarea>
            {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/articles')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </AdminMgmtWrapper>
  );
};

export default ArticleCreate;