import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CandidateSearch from './components/CandidateSearch';
import ShortlistManager from './components/ShortlistManager';
import EmailDraft from './components/EmailDraft';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AnimatedBackground from './components/AnimatedBackground';

// Navigation component with active link styling
const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getIcon = (iconType) => {
    const iconClass = "w-5 h-5";
    switch (iconType) {
      case 'search':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'list':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'mail':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { path: '/', name: 'Search', description: 'Find candidates', icon: 'search' },
    { path: '/shortlists', name: 'Shortlists', description: 'Saved candidates', icon: 'list' },
    { path: '/email', name: 'Email', description: 'Draft messages', icon: 'mail' },
    { path: '/analytics', name: 'Analytics', description: 'Pipeline insights', icon: 'chart' }
  ];

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white backdrop-blur-lg bg-opacity-95 shadow-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                HR Agent
              </h1>
              <p className="text-sm text-slate-500 hidden sm:block font-medium">Intelligent Recruitment Assistant</p>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActiveRoute(item.path)
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-600/25'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {getIcon(item.icon)}
                  <div className="text-center">
                    <div className="font-semibold">{item.name}</div>
                    <div className={`text-xs transition-opacity ${
                      isActiveRoute(item.path) ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                {isActiveRoute(item.path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Enhanced Mobile menu button */}
          <button
            className="md:hidden p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 border border-slate-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-slate-50/50 backdrop-blur-sm">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center space-x-3 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 mx-2 ${
                    isActiveRoute(item.path)
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActiveRoute(item.path) ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'
                  }`}>
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className={`text-xs ${
                      isActiveRoute(item.path) ? 'text-slate-200' : 'text-slate-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <Navigation />
        
        <main className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Background decoration (kept for extra depth) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-emerald-100 to-slate-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-slate-100 to-emerald-100 rounded-full opacity-30 blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                  <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                  <Link to="/" className="btn-primary">
                    Go Home
                  </Link>
                </div>
              } 
            />
            </Routes>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="relative bg-white/80 backdrop-blur-lg border-t border-slate-200 mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">HR Agent</p>
                  <p className="text-xs text-slate-500">Intelligent Recruitment Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex space-x-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-400">© 2024 HR Agent. Built for modern recruitment workflows.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
