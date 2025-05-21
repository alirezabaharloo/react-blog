import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';


// blog pages
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PageTransition from './components/PageTransition';
import Error from './pages/Error';
import Dashboard from './pages/admin/Dashboard';
import AdminPageNotFound from './components/admin/errors/AdminPageNotFound';
import Users from './pages/admin/Users';
import AdminLayout from './layouts/AdminLayout';

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

const AdminRoutes = () => {
  return (
    <Route path="/admin/*" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="*" element={<AdminPageNotFound />} />
    </Route>
  );
}

export { BlogRoutes, AdminRoutes };