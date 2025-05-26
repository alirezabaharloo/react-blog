import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import SpinLoader from '../../components/loaders/SpinLoader';
import AdminSomethingWentWrong from '../../components/admin/errors/AdminSomethingWentWrong';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import { useNavigate, Link } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/admin/modals/DeleteConfirmationModal';
import {
  AdminPagination,
  AdminFilter,
  AdminHeader,
  AdminMgmtWrapper
} from '../../components/admin/AdminMgmtLayout';

const Articles = () => {
  const navigate = useNavigate();
  const [articlesList, setArticlesList] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [firstLastIndex, setFirstLastIndex] = useState({
    firstIndex: null,
    lastIndex: null
  });
  const [filters, setFilters] = useState({
    status: 'all',       // 'all', 'published', 'draft'
    category: 'all'      // 'all', or category id
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(5);
  const [categories, setCategories] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  // Fetch articles
  const { 
    data: articlesData, 
    isError: isArticlesError, 
    isLoading: isArticlesLoading, 
    sendRequest: fetchArticles 
  } = useAuthHttp('http://localhost:8000/api/admin/articles/');

  // Delete article hook
  const {
    isLoading: isDeleting,
    sendRequest: deleteArticle
  } = useAuthHttp();

  // Fetch categories for filter
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading
  } = useAuthHttp('http://localhost:8000/api/blog/categories/');

  // Filter configuration for the articles page
  const getArticleFilterConfig = () => [
    {
      type: 'status',
      title: 'Filter by Status',
      color: 'blue',
      options: [
        { value: 'all', label: 'All' },
        { value: 'published', label: 'Published', icon: true, iconColor: 'green' },
        { value: 'draft', label: 'Draft', icon: true, iconColor: 'yellow' }
      ]
    },
    {
      type: 'category',
      title: 'Filter by Category',
      color: 'purple',
      options: [
        { value: 'all', label: 'All Categories' },
        ...categories.map(cat => ({ 
          value: cat.id.toString(), 
          label: cat.name,
          icon: true,
          iconColor: 'purple'
        }))
      ]
    }
  ];

  // Restore pagination and search state from sessionStorage when component mounts
  useEffect(() => {
    const savedPage = sessionStorage.getItem('adminArticleListPage');
    const savedFilters = sessionStorage.getItem('adminArticleListFilters');
    const savedPerPage = sessionStorage.getItem('adminArticleListPerPage');
    const savedSearch = sessionStorage.getItem('adminArticleListSearch');
    
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
    
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
    
    if (savedPerPage) {
      setArticlesPerPage(parseInt(savedPerPage, 10));
    }

    if (savedSearch) {
      setSearchQuery(savedSearch);
    }
  }, []);

  // Load categories
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  // Load articles
  useEffect(() => {
    if (articlesData) {
      let articles = Array.isArray(articlesData) ? articlesData : [];
      setArticlesList(articles);
      setFilteredArticles(articles);
    }
  }, [articlesData]);

  // Save current state when it changes
  useEffect(() => {
    sessionStorage.setItem('adminArticleListPage', currentPage);
    sessionStorage.setItem('adminArticleListFilters', JSON.stringify(filters));
    sessionStorage.setItem('adminArticleListPerPage', articlesPerPage);
    sessionStorage.setItem('adminArticleListSearch', searchQuery);
  }, [currentPage, filters, articlesPerPage, searchQuery]);

  // Apply filters and search
  useEffect(() => {
    if (articlesList.length > 0) {
      let result = [...articlesList];
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(article => 
          article.title.toLowerCase().includes(query) ||
          (article.excerpt && article.excerpt.toLowerCase().includes(query)) ||
          (article.content && article.content.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (filters.status !== 'all') {
        result = result.filter(article => article.status === filters.status);
      }
      
      // Apply category filter
      if (filters.category !== 'all') {
        result = result.filter(article => article.category.toString() === filters.category);
      }
      
      setFilteredArticles(() => {
        if (articlesPerPage >= result.length) {
          setCurrentPage(1);
        }
        return result;
      });
    }
  }, [filters, articlesList, searchQuery]);

  // Apply pagination
  useEffect(() => {
    if (filteredArticles.length > 0) {
      const indexOfLastArticle = currentPage * articlesPerPage;
      const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
      
      setFirstLastIndex({
        firstIndex: indexOfFirstArticle,
        lastIndex: indexOfLastArticle
      });
    }
  }, [filteredArticles, currentPage, articlesPerPage]);
   
  // Calculate pagination controls
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (size) => {
    setArticlesPerPage(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all', category: 'all' });
    setSearchQuery('');
  };

  const handleArticleEdit = (articleId) => {
    // Save pagination state before navigating
    sessionStorage.setItem('adminArticleListPage', currentPage);
    sessionStorage.setItem('adminArticleListFilters', JSON.stringify(filters));
    sessionStorage.setItem('adminArticleListPerPage', articlesPerPage);
    
    navigate(`/admin/articles/${articleId}`);
  };

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/articles/${articleToDelete.id}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`
          }
        }
      );
      
      if (!response.ok) {
        showErrorToast(response.errorMessage || 'Failed to delete article. Please try again later.');
      } else {
        showSuccessToast('Article deleted successfully!');
        // Refresh article list
        fetchArticles();
      }
    } catch (error) {   
      showErrorToast('An error occurred while deleting the article. Please try again later.');
      console.error(error);
    } finally {
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleToggleArticleStatus = async (articleId, currentStatus) => {
    try {
      const result = await fetch(`http://localhost:8000/api/admin/articles/${articleId}/publish/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`
        }
      });
      
      if (!result.ok) {
        showErrorToast("Error updating article status. Please try again!");
        return;
      }

      const response = await result.json();
      
      if (response) {
        showSuccessToast(`Article ${response.current_status === 'published' ? 'published' : 'moved to drafts'} successfully`);
        
        // Refresh article list
        fetchArticles();
      } else {
        showErrorToast('Failed to update article status');
      }
    } catch (error) {
      showErrorToast('Failed to update article status');
    }
  };

  if (isArticlesLoading || isCategoriesLoading) {
    return <SpinLoader />;
  }

  if (isArticlesError) {
    return <AdminSomethingWentWrong />;
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <AdminMgmtWrapper>
      <AdminHeader
        title="Article Management"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search articles..."
      >
        <Link
          to="/admin/articles/new"
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium transition-all duration-200 hover:bg-blue-700"
        >
          New Article
        </Link>
      </AdminHeader>
      
      <AdminFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterConfig={getArticleFilterConfig()}
        totalItems={articlesList.length}
        filteredItems={filteredArticles.length}
        searchQuery={searchQuery}
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Excerpt
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredArticles.slice(firstLastIndex.firstIndex, firstLastIndex.lastIndex).map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  <div className="text-xs text-gray-500">{new Date(article.date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">{article.excerpt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{article.category_data?.name || getCategoryName(article.category)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{article.author_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleArticleEdit(article.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleArticleStatus(article.id, article.status)}
                    className={`${article.status === 'published' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'} mr-3`}
                  >
                    {article.status === 'published' ? 'Move to Draft' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(article)}
                    className="text-red-600 hover:text-red-900"
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredArticles.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredArticles.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={articlesPerPage}
          totalItems={filteredArticles.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handlePageSizeChange}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        itemType="Article"
        itemName={articleToDelete?.title}
        onConfirmDelete={handleConfirmDelete}
      />
    </AdminMgmtWrapper>
  );
};

export default Articles;