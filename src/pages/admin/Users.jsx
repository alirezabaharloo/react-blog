import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import SpinLoader from '../../components/loaders/SpinLoader';
import AdminSomethingWentWrong from '../../components/admin/errors/AdminSomethingWentWrong';
import { showSuccessToast, showErrorToast } from '../../utils/toastNotifs';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AdminPagination,
  AdminSearch,
  AdminFilter,
  AdminHeader,
  AdminMgmtWrapper
} from '../../components/admin/AdminMgmtLayout';
import UsersTable from '../../components/admin/UsersTable';

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter configuration for the users page
  const usersFilterConfig = [
    {
      type: 'status',
      title: 'Filter by Status',
      color: 'blue',
      options: [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active', icon: true, iconColor: 'green' },
        { value: 'inactive', label: 'Inactive', icon: true, iconColor: 'red' }
      ]
    },
    {
      type: 'type',
      title: 'Filter by Role',
      color: 'purple',
      options: [
        { value: 'all', label: 'All' },
        { value: 'admin', label: 'Admin', icon: true, iconColor: 'purple' },
        { value: 'normal', label: 'Regular', icon: true, iconColor: 'green' }
      ]
    }
  ];

  // Restore pagination and search state from sessionStorage when component mounts
  useEffect(() => {
    const savedPage = sessionStorage.getItem('adminUserListPage');
    const savedFilters = sessionStorage.getItem('adminUserListFilters');
    const savedPerPage = sessionStorage.getItem('adminUserListPerPage');
    const savedSearch = sessionStorage.getItem('adminUserListSearch');
    
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    }
    
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
    
    if (savedPerPage) {
      setUsersPerPage(parseInt(savedPerPage, 10));
    }

    if (savedSearch) {
      setSearchQuery(savedSearch);
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

  // Save current state when it changes
  useEffect(() => {
    sessionStorage.setItem('adminUserListPage', currentPage);
    sessionStorage.setItem('adminUserListFilters', JSON.stringify(filters));
    sessionStorage.setItem('adminUserListPerPage', usersPerPage);
    sessionStorage.setItem('adminUserListSearch', searchQuery);
  }, [currentPage, filters, usersPerPage, searchQuery]);

  // Apply search and filters when users list, filters, or search query changes
  useEffect(() => {
    if (usersList.length > 0) {
      let result = [...usersList];
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(user => 
          user.username.toLowerCase().includes(query) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.first_name && user.first_name.toLowerCase().includes(query)) ||
          (user.last_name && user.last_name.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (filters.status === 'active') {
        result = result.filter(user => user.isActive === true);
      } else if (filters.status === 'inactive') {
        result = result.filter(user => user.isActive === false);
      }
      
      // Apply type filter
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
  }, [filters, usersList, searchQuery]);

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

  const handlePageSizeChange = (size) => {
    setUsersPerPage(size);
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

  const handleClearFilters = () => {
    setFilters({ status: 'all', type: 'all' });
    setSearchQuery('');
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
        showErrorToast("Error during deactivating please try again!")
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

  const handleUserEdit = (userId) => {
    // Save pagination state before navigating
    sessionStorage.setItem('adminUserListPage', currentPage);
    sessionStorage.setItem('adminUserListFilters', JSON.stringify(filters));
    sessionStorage.setItem('adminUserListPerPage', usersPerPage);
    
    navigate(`/admin/users/${userId}`);
  };

  return (
    <AdminMgmtWrapper>
      <AdminHeader
        title="User Management"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search users..."
      />
      
      <AdminFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterConfig={usersFilterConfig}
        totalItems={usersList.length}
        filteredItems={filteredUsers.length}
        searchQuery={searchQuery}
      />
      
      <div className="overflow-x-auto">
        <UsersTable 
          filteredUsers={filteredUsers}
          firstLastIndex={firstLastIndex}
          handleDeactivate={handleDeactivate}
          handleUserEdit={handleUserEdit}
        />
      </div>

      {filteredUsers.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={usersPerPage}
          totalItems={filteredUsers.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handlePageSizeChange}
        />
      )}
    </AdminMgmtWrapper>
  );
};

export default Users;