/**
 * Main application component with routing configuration
 */

import { HashRouter, Route, Routes } from 'react-router'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/Home'
import QuizPage from './pages/Quiz'
import GCPQuizPage from './pages/GCPQuiz'
import HeatmapPage from './pages/Heatmap'
import Layout from './components/Layout'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/gcp-quiz" element={<GCPQuizPage />} />
              <Route path="/heatmap" element={<HeatmapPage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  )
}
