/**
 * Main application component with routing configuration
 */

import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Dynamic imports for code splitting
const HomePage = React.lazy(() => import('./pages/Home'));
const GCPQuizPage = React.lazy(() => import('./pages/GCPQuiz'));

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
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gcp-quiz" element={<GCPQuizPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
