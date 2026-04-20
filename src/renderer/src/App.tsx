import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import LearningPath from './pages/LearningPath'
import TheoryView from './pages/TheoryView'
import QuizEngine from './pages/QuizEngine'
import Achievements from './pages/Achievements'
import Profile from './pages/Profile'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<LearningPath />} />
          <Route path="/learn/:moduleId" element={<TheoryView />} />
          <Route path="/quiz/:moduleId" element={<QuizEngine />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
