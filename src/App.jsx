import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './pages/partial/Header.jsx';
import Footer from './pages/partial/Footer.jsx';
import { ArticleProvider } from './context/ArticleContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { BlogRoutes } from './routes';

function App() {
  return (
    <Router>
      <ToastContainer />
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