/**
 * Main application component with routing configuration
 */

import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';

// Dynamic imports for code splitting
const HomePage = React.lazy(() => import('./pages/Home'));
const QuizPage = React.lazy(() => import('./pages/Quiz'));
const GCPQuizPage = React.lazy(() => import('./pages/GCPQuiz'));
const HeatmapPage = React.lazy(() => import('./pages/Heatmap'));
const PortfolioPage = React.lazy(() => import('./pages/Portfolio'));
const GuidePage = React.lazy(() => import('./pages/Guide'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-slate-600 text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/gcp-quiz" element={<GCPQuizPage />} />
                <Route path="/heatmap" element={<HeatmapPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/guide" element={<GuidePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
