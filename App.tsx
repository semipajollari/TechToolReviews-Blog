
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import About from './pages/About';
import BackendDesign from './pages/BackendDesign';
import InsiderList from './pages/InsiderList';
import { useLanguage } from './i18n';
import { AdminAuthProvider, AdminLogin, AdminDashboard } from './admin';

// Main Site Layout
const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/insider-list" element={<InsiderList />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/architecture" element={<BackendDesign />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900 pt-20 pb-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-600/20">
                  <i className="fas fa-bolt text-xl"></i>
                </div>
                <span className="font-black text-2xl text-gray-900 dark:text-white tracking-tight">TechToolReviews<span className="text-indigo-600">.</span></span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-sm leading-relaxed font-medium">
                {t.footer.description}
              </p>
              <div className="flex space-x-5">
                <a href="#" className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                  <i className="fab fa-linkedin-in text-lg"></i>
                </a>
              </div>
            </div>
            
            <div className="space-y-8">
              <h4 className="font-black text-gray-900 dark:text-gray-50 uppercase tracking-[0.2em] text-[10px]">{t.home.categories}</h4>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-bold">
                <li><Link to="/category/software" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.software}</Link></li>
                <li><Link to="/category/tech-stacks" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.techStacks}</Link></li>
                <li><Link to="/category/ai-tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.aiTools}</Link></li>
                <li><Link to="/category/guides" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.footer.resources}</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-black text-gray-900 dark:text-gray-50 uppercase tracking-[0.2em] text-[10px]">{t.footer.legal}</h4>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400 font-bold">
                <li><Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.about}</Link></li>
                <li><Link to="/architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.architecture}</Link></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.footer.privacy}</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.footer.terms}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-500 font-bold uppercase tracking-widest">
            <p>&copy; 2025-2026 TechToolReviews Media Group. {t.footer.allRightsReserved}</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <span className="hover:text-indigo-600 cursor-default">Designed for 2026 Stacks</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component - Single Routes with all paths
const App: React.FC = () => {
  return (
    <Routes>
      {/* Admin Routes - Completely separate, no navbar/footer */}
      <Route path="/admin" element={
        <AdminAuthProvider>
          <AdminLogin />
        </AdminAuthProvider>
      } />
      <Route path="/admin/dashboard" element={
        <AdminAuthProvider>
          <AdminDashboard />
        </AdminAuthProvider>
      } />
      
      {/* Public Routes - With MainLayout */}
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
};

export default App;
