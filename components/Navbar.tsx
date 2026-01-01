
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, BRAND_NAME } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'glass border-b border-gray-200 dark:border-gray-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <i className="fas fa-bolt text-lg"></i>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              {BRAND_NAME}<span className="text-indigo-600">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-bold transition-colors hover:text-indigo-600 ${location.pathname === item.path ? 'text-indigo-600 underline decoration-2 underline-offset-8' : 'text-gray-600 dark:text-gray-300'}`}
              >
                {item.label}
              </Link>
            ))}
            
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <button className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-sm">
              Subscribe
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300"
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100 py-6 border-t border-gray-100 dark:border-gray-800' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 space-y-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 p-4 rounded-2xl text-lg font-bold transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <i className={`fas ${item.icon} w-6`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-4">
            <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 dark:shadow-none">
              Get Tech Stack Guide
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
