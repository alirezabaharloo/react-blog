import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import SpinLoader from '../../components/loaders/SpinLoader';
import AdminSomethingWentWrong from '../../components/admin/errors/AdminSomethingWentWrong';

const ArticleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    date: '',
    read_time: 0,
    image: null,
    category: null,
    status: 'draft'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialArticleData, setInitialArticleData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch article data
  const { 
    isLoading: isArticleLoading,
    isError: isArticleError,
    data: articleData,
    sendRequest: fetchArticleData
  } = useAuthHttp(`http://localhost:8000/api/admin/articles/${id}/`);

  // Fetch categories for dropdown
  const {
    isLoading: isCategoriesLoading,
    data: categoriesData
  } = useAuthHttp('http://localhost:8000/api/blog/categories/');

  // Update article data
  const {
    sendRequest: updateArticleData
  } = useAuthHttp(`http://localhost:8000/api/admin/articles/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });

  // Load categories
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  // Load article data
  useEffect(() => {
    if (articleData) {
      const articleDetailData = {
        title: articleData.title || '',
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        date: articleData.date ? new Date(articleData.date).toISOString().split('T')[0] : '',
        read_time: parseInt(articleData.read_time) || 0,
        category: Number(articleData.category) || '',
        status: articleData.status || 'draft'
      };
      setFormData(articleDetailData);
      setInitialArticleData(articleDetailData);
      
      if (articleData.image) {
        setImagePreview(articleData.image);
      }
    }
  }, [articleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert read_time to number
    if (name === 'read_time' || name === 'category') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isDataChanged = () => {
    if (!initialArticleData) return false;
    
    // Check if any of the text fields have changed
    const hasTextFieldsChanged = Object.keys(initialArticleData).some(key => {
      if (key === 'image') return false; // Skip image in this check
      return formData[key] !== initialArticleData[key];
    });

    // Check if a new image has been selected
    const hasImageChanged = formData.image !== null && formData.image !== undefined;
    
    return hasTextFieldsChanged || hasImageChanged;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    let formErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      showErrorToast('Failed to update article. Please check your input.');
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`http://localhost:8000/api/admin/articles/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.title) {
          setErrors({ title: data.title[0] });
        } else {
          setErrors({
            'form': Object.values(data)[0] || "An error occurred. Please try again."
          });
        }
        showErrorToast('Failed to update article. Please check your input.');
      } else {
        setInitialArticleData({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          date: data.date,
          read_time: parseInt(data.read_time) || 0,
          category: Number(data.category),
          status: data.status
        });
        showSuccessToast('Article updated successfully!');
      }
    } catch (error) {
      console.error(error);
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

  if (isArticleLoading || isCategoriesLoading) {
    return <SpinLoader />;
  }

  if (isArticleError) {
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
          <h1 className="text-2xl font-bold text-gray-800">Article Details</h1>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Articles
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

        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <motion.div variants={itemVariants}>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </motion.div>

          {/* Excerpt */}
          <motion.div variants={itemVariants}>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="2"
              value={formData.excerpt}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${errors.excerpt ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
            />
            {errors.excerpt && (
              <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>
            )}
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants}>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="10"
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border ${errors.content ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-600">{errors.content}</p>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {/* Date */}
            <motion.div variants={itemVariants}>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.date ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-600">{errors.date}</p>
              )}
            </motion.div>

            {/* Read Time */}
            <motion.div variants={itemVariants}>
              <label htmlFor="read_time" className="block text-sm font-medium text-gray-700 mb-1">
                Read Time (minutes)
              </label>
              <input
                type="number"
                id="read_time"
                name="read_time"
                value={formData.read_time}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 rounded-md border ${errors.read_time ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
              {errors.read_time && (
                <p className="mt-1 text-xs text-red-600">{errors.read_time}</p>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Category */}
            <motion.div variants={itemVariants}>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">{errors.category}</p>
              )}
            </motion.div>

            {/* Status */}
            <motion.div variants={itemVariants}>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </motion.div>
          </div>

          {/* Image Upload */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Article Image
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Choose Image
              </label>
              {imagePreview && (
                <div className="ml-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting || !isDataChanged()}
            className={`px-6 py-2 ${isDataChanged() ? 'bg-blue-600' : 'bg-gray-400'} text-white rounded-md font-medium transition-all duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            } ${isDataChanged() ? 'hover:bg-blue-700' : 'hover:cursor-not-allowed hover:bg-gray-400'}`}
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

export default ArticleDetail;