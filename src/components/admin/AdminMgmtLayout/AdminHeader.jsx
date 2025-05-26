import { motion } from 'framer-motion';
import AdminSearch from './AdminSearch';

const AdminHeader = ({ 
  title, 
  icon, 
  searchQuery, 
  onSearchChange,
  searchPlaceholder,
  children
}) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block mr-3 p-2 bg-blue-50 rounded-lg"
          >
            {icon}
          </motion.span>
          {title}
        </h1>
        {children}
        <AdminSearch 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
    </div>
  );
};

export default AdminHeader;