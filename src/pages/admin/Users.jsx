import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import SpinLoader from '../../components/loaders/SpinLoader';
import AdminSomethingWentWrong from '../../components/admin/errors/AdminSomethingWentWrong';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import { useNavigate, useLocation } from 'react-router-dom';

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [firstLastIndex, setFirstLastIndex] = useState({
    firstIndex: null,
    lastIndex: null
  });
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'active', 'inactive'
    type: 'all'    // 'all', 'admin', 'normal'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const { 
    data, 
    isError, 
    errorMessage,
    isLoading, 
    sendRequest 
  } = useAuthHttp('http://localhost:8000/api/admin/users');

  // Restore pagination state from sessionStorage when component mounts
  useEffect(() => {
    const savedPage = sessionStorage.getItem('adminUserListPage');
    const savedFilters = sessionStorage.getItem('adminUserListFilters');
    const savedPerPage = sessionStorage.getItem('adminUserListPerPage');
    
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
    
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
    
    if (savedPerPage) {
      setUsersPerPage(parseInt(savedPerPage, 10));
    }
  }, []);

  useEffect(() => {
    if (data) {
      let users = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data.users) {
        users = data.users;
      }
      setUsersList(users);
      setFilteredUsers(users);
    }
  }, [data]);

  // Save current pagination state when it changes
  useEffect(() => {
    sessionStorage.setItem('adminUserListPage', currentPage);
    sessionStorage.setItem('adminUserListFilters', JSON.stringify(filters));
    sessionStorage.setItem('adminUserListPerPage', usersPerPage);
  }, [currentPage, filters, usersPerPage]);

  // Apply filters when users list or filters change
  useEffect(() => {
    if (usersList.length > 0) {
      let result = [...usersList];
      
      
      if (filters.status === 'active') {
        result = result.filter(user => user.isActive === true);
      } else if (filters.status === 'inactive') {
        result = result.filter(user => user.isActive === false);
      }
      
      // Filter by type
      if (filters.type === 'admin') {
        result = result.filter(user => user.permission === 'admin' || user.is_superuser === true);
      } else if (filters.type === 'normal') {
        result = result.filter(user => user.permission !== 'admin' && user.is_superuser !== true);
      }
      
      setFilteredUsers(() => {
          if (usersPerPage >= result.length) {
            setCurrentPage(1);
          }
          return result;
      });
    
    }
  }, [filters, usersList]);


  // Apply pagination
  useEffect(() => {
    if (filteredUsers.length > 0) {
      const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      
      setFirstLastIndex({
        firstIndex: indexOfFirstUser,
        lastIndex: indexOfLastUser
      })
    }
  }, [filteredUsers, currentPage, usersPerPage]);
   
  // Calculate pagination controls
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when page size changes
  };

  if (isLoading) {
    return <SpinLoader />;
  }

  if (isError) {
    return <AdminSomethingWentWrong />;
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };


  const handleDeactivate = async (userId) => {
    try {
      const result = await fetch(`http://localhost:8000/api/admin/users/${userId}/deactivate/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('tokens'))?.access}`
        }
      });
      
      if (!result.ok) {
        showErrorToast("error during deactivating please try again!")
        return;
      }

      else if (result && !result.isError) {
        showSuccessToast('User status updated successfully');
        
        // Refresh user list
        const response = await sendRequest();
        
        if (response) {
          if (Array.isArray(response)) {
            setUsersList(response);
          } else if (response.users) {
            setUsersList(response.users);
          }
        }
      } else {
        showErrorToast('Failed to update user status');
      }
    } catch (error) {
      showErrorToast('Failed to update user status');
    }
  };

  const handleEdit = (userId) => {
    // Save pagination state before navigating
    sessionStorage.setItem('adminUserListPage', currentPage);
    sessionStorage.setItem('adminUserListFilters', JSON.stringify(filters));
    sessionStorage.setItem('adminUserListPerPage', usersPerPage);
    
    navigate(`/admin/users/${userId}`);
  };

  // Style for filter buttons
  const getFilterButtonStyle = (type, value) => {
    const isActive = filters[type] === value;
    return `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;
  };

  // Style for pagination buttons
  const getPaginationButtonStyle = (isActive) => {
    return `px-3 py-1 rounded-md text-sm ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;
  };

  // Generate pagination buttons array
  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        className={getPaginationButtonStyle(currentPage === 1)}
        disabled={currentPage === 1}
      >
        1
      </button>
    );

    // Add ellipsis after first page if needed
    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis-start" className="px-3 py-1">
          ...
        </span>
      );
    }

    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={getPaginationButtonStyle(currentPage === i)}
          >
            {i}
          </button>
        );
      }
    }

    // Add ellipsis before last page if needed
    if (currentPage < totalPages - 2 && totalPages > 3) {
      buttons.push(
        <span key="ellipsis-end" className="px-3 py-1">
          ...
        </span>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className={getPaginationButtonStyle(currentPage === totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };
  

  return (
    <>  
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      {/* Header Section with Title and Subtle Decoration */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block mr-3 p-2 bg-blue-50 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </motion.span>
          User Management
        </h1>
      </div>
      
      {/* Filter Controls in Card Format */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 rounded-xl p-4 mb-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter Group */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Filter by Status
            </h3>
            <div className="flex space-x-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('status', 'all')}
                className={`${getFilterButtonStyle('status', 'all')} flex-1`}
              >
                All
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('status', 'active')}
                className={`${getFilterButtonStyle('status', 'active')} flex-1`}
              >
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Active
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('status', 'inactive')}
                className={`${getFilterButtonStyle('status', 'inactive')} flex-1`}
              >
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Inactive
              </motion.button>
            </div>
          </div>
          
          {/* Type Filter Group */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Filter by Role
            </h3>
            <div className="flex space-x-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('type', 'all')}
                className={`${getFilterButtonStyle('type', 'all')} flex-1`}
              >
                All
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('type', 'admin')}
                className={`${getFilterButtonStyle('type', 'admin')} flex-1`}
              >
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Admin
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('type', 'normal')}
                className={`${getFilterButtonStyle('type', 'normal')} flex-1`}
              >
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Regular
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Filter Stats */}
        <div className="text-xs text-gray-500 mt-3 flex justify-between items-center">
          <span>
            Showing: <strong>{filteredUsers.length}</strong> of <strong>{usersList.length}</strong> users
          </span>
          {(filters.status !== 'all' || filters.type !== 'all') && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilters({ status: 'all', type: 'all' })}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </motion.button>
          )}
        </div>
      </motion.div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operations
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredUsers && filteredUsers.length > 0 && firstLastIndex.lastIndex ? (
                filteredUsers.slice(firstLastIndex.firstIndex, firstLastIndex.lastIndex).map((user) => (
                  <motion.tr
                    key={user.id || user._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (user.permission === 'admin' || user.is_superuser) ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {(user.permission === 'admin' || user.is_superuser) ? 'Admin' : 'Regular'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user.id || user._id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {handleDeactivate(user.id || user._id)}}
                        className={`${
                          user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching the selected filters
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredUsers.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2"
        >
          <div className="mb-4 sm:mb-0 flex items-center">
            <span className="text-sm text-gray-700 mr-3">Show:</span>
            <select
              value={usersPerPage}
              onChange={handlePageSizeChange}
              className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`mr-2 p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex space-x-1">
              {renderPaginationButtons()}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-2 p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="text-sm text-gray-500 mt-4 sm:mt-0">
            Page {currentPage} of {totalPages || 1}
          </div>
        </motion.div>
      )}
    </motion.div>
    </>
    
  );
};

export default Users;