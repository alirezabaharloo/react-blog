import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchContext = createContext({
  searchTerm: '',
  searchResults: [],
  isSearching: false,
  performSearch: () => {},
  clearSearch: () => {}
});

export const SearchProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(null);
  const [error, setError] = useState(false);
  
  const performSearch = async (term) => {
    if (!term) return;

    setSearchTerm(term);
    setIsSearching(true);

    try {
      const response = await fetch(`http://localhost:8000/api/blog/articles/search?q=${encodeURIComponent(term)}`);

      const data = await response.json();
      if (!response.ok && response.status === 404) {
        console.log(data.error);
        setError({
          isError: true,  
          errorMessage: data.error
        });
      } else if (!response.ok) {
        throw new Error('Search failed');
      }
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider 
      value={{ 
        searchTerm, 
        searchResults, 
        isSearching, 
        isError:error.isError,
        errorMessage:error.errorMessage,
        performSearch,
        clearSearch, 
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext; 