import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './pages/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Error from './pages/Error';
import { ArticleProvider } from './context/ArticleContext';
import { SearchProvider } from './context/SearchContext';
import PageTransition from './components/PageTransition';
import Register from './pages/Register';
import Login from './pages/Login';

// Create a wrapper component to use useLocation
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/articles" element={
          <PageTransition>
            <Articles />
          </PageTransition>
        } />
        <Route path="/articles/:articleId" element={
          <PageTransition>
            <ArticleDetail />
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <About />
          </PageTransition>
        } />
        <Route path="/contact" element={
          <PageTransition>
            <Contact />
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition>
            <Error />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Register />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ArticleProvider>
      <SearchProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </SearchProvider>
    </ArticleProvider>
  );
}

export default App;