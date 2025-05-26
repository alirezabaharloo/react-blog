import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './pages/partial/Header.jsx';
import Footer from './pages/partial/Footer.jsx';
import { ArticleProvider } from './context/ArticleContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { BlogRoutes } from './routes';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/Users.jsx';
import UserDetail from './pages/admin/UserDetail.jsx';
import AdminPageNotFound from './components/admin/errors/AdminPageNotFound.jsx';
import Categories from './pages/admin/Categories.jsx';
import CategoryDetail from './pages/admin/CategoryDetail.jsx';
import Articles from './pages/admin/Articles.jsx';
import ArticleDetail from './pages/admin/ArticleDetail.jsx';
import CreateCategory from './pages/admin/CategoryCreate.jsx'
import CreateArticle from './pages/admin/ArticleCreate.jsx'


function App() {
  return (
    <Router>
      <ToastContainer />
      <AuthProvider>  
        <ArticleProvider>
          <SearchProvider>
            <Routes>
              {/* Blog Routes */}
              <Route path="/*" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-grow">
                    <BlogRoutes />
                  </main>
                  <Footer />
                </div>
              } />

              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="users/:id" element={<UserDetail />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/new" element={<CreateCategory />} />
                <Route path="categories/:id" element={<CategoryDetail />} />
                <Route path="articles" element={<Articles />} />
                <Route path="articles/new" element={<CreateArticle />} />
                <Route path="articles/:id" element={<ArticleDetail />} />
                <Route path="*" element={<AdminPageNotFound />} />
              </Route>
            </Routes>
          </SearchProvider>
        </ArticleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;