import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import SpinLoader from '../../components/loaders/SpinLoader';
import AdminSomethingWentWrong from '../../components/admin/errors/AdminSomethingWentWrong';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/admin/modals/DeleteConfirmationModal';
import {
  AdminPagination,
  AdminSearch,
  AdminHeader,
  AdminMgmtWrapper
} from '../../components/admin/AdminMgmtLayout';


const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categoriesList, setCategoriesList] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [firstLastIndex, setFirstLastIndex] = useState({
    firstIndex: null,
    lastIndex: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const {
    data,
    isError,
    isLoading,
    sendRequest: fetchCategories
  } = useAuthHttp('http://localhost:8000/api/blog/categories/');
  

  // Restore pagination and search state from sessionStorage when component mounts
  useEffect(() => {
    const savedPage = sessionStorage.getItem('adminCategoryListPage');
    const savedPerPage = sessionStorage.getItem('adminCategoryListPerPage');
    const savedSearch = sessionStorage.getItem('adminCategoryListSearch');

    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }

    if (savedPerPage) {
      setCategoriesPerPage(parseInt(savedPerPage, 10));
    }

    if (savedSearch) {
      setSearchQuery(savedSearch);
    }
  }, []);

  useEffect(() => {
    if (data) {
      let categories = [];
      if (Array.isArray(data)) {
        categories = data;
      } else if (data.results) {
        categories = data.results;
      }
      setCategoriesList(categories);
      setFilteredCategories(categories);
    }
  }, [data]);

  // Save current state when it changes
  useEffect(() => {
    sessionStorage.setItem('adminCategoryListPage', currentPage);
    sessionStorage.setItem('adminCategoryListPerPage', categoriesPerPage);
    sessionStorage.setItem('adminCategoryListSearch', searchQuery);
  }, [currentPage, categoriesPerPage, searchQuery]);

  // Apply search when categories list or search query changes
  useEffect(() => {
    if (categoriesList.length > 0) {
      let result = [...categoriesList];

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(category =>
          category.name.toLowerCase().includes(query) ||
          (category.description && category.description.toLowerCase().includes(query))
        );
      }

      setFilteredCategories(() => {
        if (categoriesPerPage >= result.length) {
          setCurrentPage(1);
        }
        return result;
      });
    }
  }, [categoriesList, searchQuery]);

  // Apply pagination
  useEffect(() => {
    if (filteredCategories.length > 0) {
      const indexOfLastCategory = currentPage * categoriesPerPage;
      const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;

      setFirstLastIndex({
        firstIndex: indexOfFirstCategory,
        lastIndex: indexOfLastCategory
      })
    }
  }, [filteredCategories, currentPage, categoriesPerPage]);

  // Calculate pagination controls
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (size) => {
    setCategoriesPerPage(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleCategoryEdit = (categoryId) => {
    // Save pagination state before navigating
    sessionStorage.setItem('adminCategoryListPage', currentPage);
    sessionStorage.setItem('adminCategoryListPerPage', categoriesPerPage);

    navigate(`/admin/categories/${categoryId}`);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log('hello world');
    
    if (!categoryToDelete) return;
    
    try {
      const res = await fetch(
        `http://localhost:8000/api/blog/categories/${categoryToDelete}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("tokens")).access}`
          },
          method:"DELETE"
        }
      );

      
      if (!res.ok) {
        showErrorToast(res.errorMessage || 'Failed to delete category. Please try again later.');
      } else {
        showSuccessToast('Category deleted successfully!');
        // Refresh categories list
        fetchCategories();
      }
    } catch (error) {
      showErrorToast('An error occurred while deleting the category. Please try again later.');
      console.error(error);
    } finally {
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  if (isLoading) {
    return <SpinLoader />;
  }

  if (isError) {
    return <AdminSomethingWentWrong />;
  }

  return (
    <AdminMgmtWrapper>
      <AdminHeader
        title="Category Management"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search categories..."
      >
        <Link
          to="/admin/categories/new"
          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-md font-medium transition-all duration-200 hover:bg-purple-700"
        >
          New Category
        </Link>
      </AdminHeader>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.slice(firstLastIndex.firstIndex, firstLastIndex.lastIndex).map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">{category.description}</div>
                </td>
                <td className="py-4 whitespace-nowrap pl-[2rem] text-sm font-medium">
                  <button
                    onClick={() => handleCategoryEdit(category.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredCategories.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={categoriesPerPage}
          totalItems={filteredCategories.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handlePageSizeChange}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        itemType="Category"
        itemName={categoryToDelete?.name}
        onConfirmDelete={handleConfirmDelete}
      />
    </AdminMgmtWrapper>
  );
};

export default Categories;