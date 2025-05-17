import {
  BrowserRouter as Router,
} from 'react-router-dom';

import Header from './pages/partial/Header.jsx';
import Footer from './pages/partial/Footer.jsx';
import { ArticleProvider } from './context/ArticleContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { BlogRoutes } from './routes';



function App() {
  return (
    <Router>
      <ArticleProvider>
        <SearchProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <BlogRoutes />
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </SearchProvider>
      </ArticleProvider>
    </Router>
  );
}

export default App;