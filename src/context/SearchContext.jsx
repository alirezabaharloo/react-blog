import { createContext, useState } from 'react';

export const SearchContext = createContext({
  searchTerm: '',
  searchResults: [],
  isSearching: false,
  performSearch: () => {},
  clearSearch: () => {}
});

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(null);

  
  const performSearch = async (term) => {
    if (!term) return;

    setSearchTerm(term);
    setIsSearching(true);

    try {
      const response = await fetch(`http://localhost:8000/api/blog/articles/search?q=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
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
        performSearch, 
        clearSearch 
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext; 