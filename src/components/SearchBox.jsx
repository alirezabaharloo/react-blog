import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBox = ({ articles, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const recommendationsRef = useRef(null);

  // Handle click outside to close recommendations
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        recommendationsRef.current && 
        !recommendationsRef.current.contains(event.target) && 
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update recommendations when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setRecommendations([]);
      return;
    }

    const filtered = articles
      .filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 recommendations

    setRecommendations(filtered);
  }, [searchTerm, articles]);

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setIsFocused(false);
    }
  };

  // Handle recommendation click
  const handleRecommendationClick = (title) => {
    setSearchTerm(title);
    onSearch(title);
    setIsFocused(false);
  };

  // Handle keyboard events for navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <motion.div 
      className="relative z-50 w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.form 
        onSubmit={handleSubmit}
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.div 
          className={`flex items-center overflow-hidden bg-white rounded-full shadow-lg transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500 shadow-blue-100' : ''}`}
          animate={{ boxShadow: isFocused ? '0 10px 25px rgba(59, 130, 246, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          <motion.div 
            className="flex items-center justify-center h-12 w-12 text-gray-500"
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </motion.div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles by title..."
            className="w-full h-12 px-4 text-gray-700 bg-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <motion.button
              type="button"
              className="flex items-center justify-center h-12 w-12 text-gray-500"
              onClick={() => {
                setSearchTerm('');
                inputRef.current.focus();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          )}
          <motion.button
            type="submit"
            className="flex items-center justify-center h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Recommendations Panel */}
      <AnimatePresence>
        {isFocused && recommendations.length > 0 && (
          <motion.div
            ref={recommendationsRef}
            className="absolute w-full mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div className="py-2 px-3 bg-gray-50 text-sm font-medium text-gray-500">
              Recommendations
            </div>
            <ul>
              {recommendations.map((article, index) => (
                <motion.li
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border-b border-gray-100 last:border-0"
                >
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-start group"
                    onClick={() => handleRecommendationClick(article.title)}
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mr-3">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {typeof article.category === 'string' ? article.category : article.category?.name || 'Uncategorized'}
                      </p>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBox;