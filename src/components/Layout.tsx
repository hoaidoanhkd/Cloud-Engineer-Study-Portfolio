/**
 * Enhanced layout component with modern design and improved UX
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { 
  Home, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  HelpCircle,
  Brain,
  LogIn,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  Bell,
  Upload,
  Database
} from 'lucide-react';
import { cn, getHoverClasses } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import UserMenu from './auth/UserMenu';
import LoginModal from './auth/LoginModal';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Navigation item interface
 */
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  { 
    name: 'Home', 
    href: '/', 
    icon: Home, 
    description: 'Dashboard and overview' 
  },
  { 
    name: 'Quiz', 
    href: '/quiz', 
    icon: FileText, 
    description: 'Practice questions and tests' 
  },
  { 
    name: 'GCP Quiz', 
    href: '/gcp-quiz', 
    icon: Brain, 
    description: 'GCP Cloud Engineer Exam Practice' 
  },
  { 
    name: 'Heatmap', 
    href: '/heatmap', 
    icon: BarChart3, 
    description: 'Visual progress tracking' 
  },
  { 
    name: 'Portfolio', 
    href: '/portfolio', 
    icon: TrendingUp, 
    description: 'Achievement and analytics' 
  },
  { 
    name: 'Guide', 
    href: '/guide', 
    icon: HelpCircle, 
    description: 'Study materials and resources' 
  },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { state } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /**
   * Handle scroll effect for header
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Close mobile menu when route changes
   */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  /**
   * Get current page info
   */
  const getCurrentPage = () => {
    return navigationItems.find(item => item.href === location.pathname) || navigationItems[0];
  };

  const currentPage = getCurrentPage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-slate-200/50" 
          : "bg-white/80 backdrop-blur-sm border-b border-slate-200/30"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className={cn("flex items-center space-x-3 group transition-transform", getHoverClasses('scale'))}>
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Brain className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  GCP Learning Hub
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 font-medium">
                  Associate Cloud Engineer
                </p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                      )} />
                      <span className="hidden lg:inline">{item.name}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications - only for authenticated users */}
              {state.isAuthenticated && (
                <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-100">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </Button>
              )}

              {/* Auth Section */}
              {state.isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button 
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-blue-600" : "text-slate-500"
                      )} />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-slate-500 mt-1">{item.description}</div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumb */}
      {location.pathname !== '/' && (
        <div className="bg-white/30 backdrop-blur-sm border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-3 text-sm">
              <Link to="/" className="text-slate-500 hover:text-slate-700 transition-colors">
                Home
              </Link>
              <ChevronDown className="h-4 w-4 text-slate-400 rotate-[-90deg]" />
              <span className="text-slate-900 font-medium flex items-center space-x-2">
                <currentPage.icon className="h-4 w-4" />
                <span>{currentPage.name}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">GCP Learning Hub</h3>
                  <p className="text-slate-400 text-sm">Associate Cloud Engineer</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your comprehensive platform for mastering Google Cloud Platform 
                and achieving Associate Cloud Engineer certification.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Learning</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/quiz" className="text-slate-400 hover:text-white transition-colors">Practice Quiz</Link></li>
                <li><Link to="/heatmap" className="text-slate-400 hover:text-white transition-colors">Progress Heatmap</Link></li>
                <li><Link to="/guide" className="text-slate-400 hover:text-white transition-colors">Study Guide</Link></li>
                <li><Link to="/portfolio" className="text-slate-400 hover:text-white transition-colors">Portfolio</Link></li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cloud Calculator</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Architecture Designer</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cost Optimizer</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Practice Simulator</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 GCP Learning Hub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
