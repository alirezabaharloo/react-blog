import { motion } from 'framer-motion';

const AdminPagination = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
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
        onClick={() => onPageChange(1)}
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
            onClick={() => onPageChange(i)}
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
          onClick={() => onPageChange(totalPages)}
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2"
    >
      <div className="mb-4 sm:mb-0 flex items-center">
        <span className="text-sm text-gray-700 mr-3">Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
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
          onClick={() => onPageChange(currentPage - 1)}
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
          onClick={() => onPageChange(currentPage + 1)}
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
  );
};

export default AdminPagination;