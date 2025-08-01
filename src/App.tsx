/**
 * Main application component with routing configuration
 */

import { HashRouter, Route, Routes } from 'react-router'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/Home'
import QuizPage from './pages/Quiz'
import HeatmapPage from './pages/Heatmap'
import PortfolioPage from './pages/Portfolio'
import GuidePage from './pages/Guide'
import ProfilePage from './pages/Profile'
import ImportQuestionsPage from './pages/ImportQuestions'
import QuestionManagementPage from './pages/QuestionManagement'
import Layout from './components/Layout'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/heatmap" element={<HeatmapPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/import" element={<ImportQuestionsPage />} />
              <Route path="/manage" element={<QuestionManagementPage />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  )
}
