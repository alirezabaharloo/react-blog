import { motion } from 'framer-motion';

const AdminFilter = ({ 
  filters,
  onFilterChange,
  onClearFilters,
  filterConfig,
  totalItems,
  filteredItems,
  searchQuery
}) => {
  // Style for filter buttons
  const getFilterButtonStyle = (type, value) => {
    const isActive = filters[type] === value;
    return `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <motion.div 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-gray-50 rounded-xl p-4 mb-6 shadow-sm"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {filterConfig.map((filterGroup) => (
          <div key={filterGroup.type} className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className={`w-2 h-2 bg-${filterGroup.color}-500 rounded-full mr-2`}></span>
              {filterGroup.title}
            </h3>
            <div className="flex space-x-2">
              {filterGroup.options.map((option) => (
                <motion.button 
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onFilterChange(filterGroup.type, option.value)}
                  className={`${getFilterButtonStyle(filterGroup.type, option.value)} flex-1`}
                >
                  {option.icon && (
                    <span className={`inline-block w-2 h-2 bg-${option.iconColor}-500 rounded-full mr-2`}></span>
                  )}
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Filter Stats */}
      <div className="text-xs text-gray-500 mt-3 flex justify-between items-center">
        <span>
          {searchQuery && (
            <span className="mr-2">
              Search results: <strong>{filteredItems}</strong>
            </span>
          )}
          Showing: <strong>{filteredItems}</strong> of <strong>{totalItems}</strong> items
        </span>
        {(Object.values(filters).some(value => value !== 'all') || searchQuery) && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default AdminFilter;