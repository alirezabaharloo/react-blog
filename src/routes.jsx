import { Routes, Route, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Error from './pages/Error';
import PageTransition from './components/PageTransition';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';



// Create a wrapper component to use useLocation
const BlogRoutes = () => {
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
          <Route path="/profile" element={
            <PageTransition>
              <Profile />
            </PageTransition>
          } />
          <Route path="/change_password" element={
            <PageTransition>
              <ChangePassword />
            </PageTransition>
          } />
          <Route path="*" element={
            <PageTransition>
              <Error />
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
    );
};



export { BlogRoutes };