import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CandidateSearch from './components/CandidateSearch';
import ShortlistManager from './components/ShortlistManager';
import EmailDraft from './components/EmailDraft';
import AnalyticsDashboard from './components/AnalyticsDashboard';

// Navigation component with active link styling
const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', name: '🔍 Search', description: 'Find candidates' },
    { path: '/shortlists', name: '📋 Shortlists', description: 'Saved candidates' },
    { path: '/email', name: '✉️ Email', description: 'Draft messages' },
    { path: '/analytics', name: '📊 Analytics', description: 'Pipeline insights' }
  ];

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-purple-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl">🤖</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HR Agent</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Intelligent Recruitment Assistant</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                }`}
              >
                <div className="text-center">
                  <div>{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActiveRoute(item.path)
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div>{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Main App component with routing
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <div>
                  <CandidateSearch />
                </div>
              } 
            />
            
            <Route 
              path="/shortlists" 
              element={
                <div>
                  <ShortlistManager />
                </div>
              } 
            />
            
            <Route 
              path="/email" 
              element={
                <div>
                  <EmailDraft />
                </div>
              } 
            />
            
            <Route 
              path="/analytics" 
              element={
                <div>
                  <AnalyticsDashboard />
                </div>
              } 
            />
            
            {/* 404 Page */}
            <Route 
              path="*" 
              element={
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤷‍♂️</div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                  <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                  <Link to="/" className="btn-primary">
                    🏠 Go Home
                  </Link>
                </div>
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">HR Agent</p>
                  <p className="text-xs text-gray-500">Intelligent Recruitment Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex space-x-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🟢 Online
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
              <p>© 2024 HR Agent. Built with ❤️ for modern recruitment workflows.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
