import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ArticleCart from '../components/ArticleCart';
import { ArticleContext } from '../context/ArticleContext';
import SearchContext from '../context/SearchContext';
import SomethingWentWrong from '../components/errors/SomethingWentWrong';
import SpinLoader from '../components/loaders/SpinLoader';
import SearchBox from '../components/SearchBox';
import useHttp from '../hooks/useHttp';
import { motion } from 'framer-motion';

export default function ArticlesWithPagination() {
  const location = useLocation();
  const { setArticleData } = useContext(ArticleContext);
  const { searchTerm, searchResults, isSearching, performSearch, clearSearch } = useContext(SearchContext);
  const { data: articles, isLoading, isError } = useHttp('http://localhost:8000/articles');
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setArticleData(articles);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [articles, setArticleData]);

  // Check if coming from header search
  useEffect(() => {
    if (location.state?.fromSearch && searchTerm) {
      // Focus will be on search results from header
      window.scrollTo(0, 0);
    }
  }, [location.state, searchTerm]);

  // Load more articles handler with animation delay
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    
    // Add a small delay to make the loading animation visible
    setTimeout(() => {
      setVisibleArticles(prev => prev + 6);
      setIsLoadingMore(false);
    }, 800);
  };

  if (isLoading) {
    return <SpinLoader />;
  }

  if (isError) {
    return <SomethingWentWrong />;
  }

  // Determine which articles to display
  // Priority: 1. Global search results, 2. Local search results, 3. All articles
  const displayArticles = searchResults.length > 0 
    ? searchResults 
      : articles;
  
  // Get only the visible articles (unless searching)
  const displayedArticles = searchResults.length > 0  
    ? displayArticles 
    : displayArticles ? displayArticles.slice(0, visibleArticles) : [];
    
  const hasMoreArticles = !searchResults.length  && articles && visibleArticles < articles.length;
  const isShowingSearchResults = searchResults.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          className="text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {isShowingSearchResults 
            ? `Search Results for "${searchTerm}"` 
            : "Latest Articles"}
        </motion.h1>
      
        <motion.div
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-4 py-2 rounded-md">
            Back to Home
          </Link> 
        </motion.div>
      </div>
      
      {/* Search Results Header for Global Search */}
      {isShowingSearchResults && (
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700">
            {searchResults.length === 0 
              ? "No articles found" 
              : `Found ${searchResults.length} article${searchResults.length !== 1 ? 's' : ''}`
            }
          </h2>
          <button 
            onClick={clearSearch}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear Search
          </button>
        </motion.div>
      )}
    
      
      {/* Loading Search Results */}
      {(isSearching ) ? (
        <div className="flex justify-center items-center py-20">
          <SpinLoader />
        </div>
      ) : displayedArticles.length === 0 ? (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-700">No articles found</h3>
          <p className="mt-2 text-gray-500">Try searching with different keywords</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {displayedArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index < visibleArticles - 6 ? 0.1 * (index % 6) : 0.1 * (index % 6) + 0.5
              }}
              layout
            >
              <ArticleCart article={article} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Load More Button */}
      {hasMoreArticles && (
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 30px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isLoadingMore ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading More...
                </>
              ) : (
                <>
                  Discover More Articles
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}