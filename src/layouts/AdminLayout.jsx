import { Outlet, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LEFT_NAVBAR_LINKS_DATA } from '../data/admin/PAGE_DATAS';
import useAuth from '../hooks/useAuth';
import useAuthHttp from '../hooks/useAuthHttp';
import SpinLoader from '../components/loaders/SpinLoader';
import AccessDenied from '../components/errors/AccessDenied';
import AdminPageNotFound from '../components/admin/errors/AdminPageNotFound';
import Header from '../pages/partial/Header';
import Footer from '../pages/partial/Footer';
import LogoutConfirmationModal from '../components/admin/modals/LogoutConfirmationModal';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const {
    isLoading: profileLoading,
    isError: profileError,
    errorMessage: profileErrorMessage,
    data: profile,
  } = useAuthHttp('http://localhost:8000/api/auth/profile/');

  const handleLogout = () => {
    // Clear any auth tokens/storage
    localStorage.removeItem('token');
    // Redirect to login
    navigate('/login');
  };

  if (isLoading || profileLoading) {
    return <SpinLoader />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <AccessDenied />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg flex flex-col"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6 flex-grow">
          {
            LEFT_NAVBAR_LINKS_DATA.map((link) => (
              <Link 
                key={link.id}
                to={link.path} 
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${location.pathname === link.path ? 'bg-gray-100' : ''}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))
          }
        </nav>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Welcome back,</p>
              <p className="text-lg font-semibold text-gray-800">{profile?.username}</p>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
          
          {/* Return to Website Button */}
          <Link to="/"
            className="mt-4 flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
            </svg>
            Return to Website
          </Link>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;