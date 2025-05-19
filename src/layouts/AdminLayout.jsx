import { Outlet, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LEFT_NAVBAR_LINKS_DATA } from '../data/admin/PAGE_DATAS';
import useAuth from '../hooks/useAuth';
import SpinLoader from '../components/loaders/SpinLoader';
import AccessDenied from '../components/errors/AccessDenied';
import AdminPageNotFound from '../components/admin/errors/AdminPageNotFound';
import Header from '../pages/partial/Header';
import Footer from '../pages/partial/Footer';

const AdminLayout = () => {
  const location = useLocation();
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
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
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
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
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 