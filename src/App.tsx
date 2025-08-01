/**
 * Main application component with routing configuration
 */

import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import GCPQuizPage from './pages/GCPQuiz';
import Layout from './components/Layout';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gcp-quiz" element={<GCPQuizPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
