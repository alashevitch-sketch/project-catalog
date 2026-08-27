import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { ProjectPage } from './pages/ProjectPage'
import './App.css'
import './components/site-enhancements.css'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="project/:slug" element={<ProjectPage />} />
        <Route path="*" element={<ProjectPage />} />
      </Route>
    </Routes>
  )
}
