import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AnimationProvider } from './components/Motion'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AnimationProvider><App /></AnimationProvider>
    </HashRouter>
  </StrictMode>,
)
