
import { useState, useEffect, createContext } from 'react';

export const ArticleContext = createContext({
    articles: [],
    loading: true,
    error: null,
});

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  

  const setArticleData = (articles) => {
    setArticles(articles);
  }
  

  return (
    <ArticleContext.Provider value={{ articles, setArticleData }}>
      {children}
    </ArticleContext.Provider>
  );

};


export default ArticleContext;