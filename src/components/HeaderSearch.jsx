import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchContext from '../context/SearchContext';

const HeaderSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const inputRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { performSearch } = useContext(SearchContext);
  
  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Fetch recommendations when search term changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (searchTerm.trim().length < 2) {
        setRecommendations([]);
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8000/articles/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.slice(0, 5)); // Limit to 5 suggestions
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    
    const timer = setTimeout(() => {
      fetchRecommendations();
    }, 300); // Debounce search
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Handle Enter key press - search and show results on Articles page
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    performSearch(searchTerm);
    setIsFocused(false);
    setSearchTerm('');
    navigate('/articles');
  };
  
  // Handle recommendation click - navigate directly to article detail
  const handleRecommendationClick = (article) => {
    setIsFocused(false);
    setSearchTerm('');
    navigate(`/articles/${article.id}`);
  };
  
  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className={`flex items-center rounded-full overflow-hidden transition-all duration-200 bg-gray-100 ${isFocused ? 'ring-2 ring-blue-500' : 'hover:bg-gray-200'}`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles..."
            className="w-full py-2 px-4 bg-transparent outline-none text-sm text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          <button
            type="submit"
            className="flex items-center justify-center h-full px-3 text-gray-500 hover:text-blue-600"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Recommendations dropdown */}
      <AnimatePresence>
        {isFocused && recommendations.length > 0 && (
          <motion.div
            className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul>
              {recommendations.map((article) => (
                <li key={article.id} className="border-b border-gray-100 last:border-0">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center"
                    onClick={() => handleRecommendationClick(article)}
                  >
                    <div className="flex-1 truncate">
                      <p className="text-sm font-medium text-gray-800">{article.title}</p>
                      <p className="text-xs text-gray-500">{typeof article.category === 'string' ? article.category : article.category?.name}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderSearch; 