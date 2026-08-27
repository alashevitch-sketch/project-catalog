import { GitBranch } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { formatSyncDate } from '../lib/metrics'
import { projects, snapshot } from '../data/projects'
import { useAnimation } from './animation-context'
import { SiteHeader } from './SiteHeader'

export function Layout() {
  const { animated } = useAnimation()
  const location = useLocation()
  const capture = new URLSearchParams(location.search).has('capture')
  return <div className={`shell ${capture ? 'capture-mode' : ''}`} data-animations={animated ? 'on' : 'off'}>
    <a className="skip-link" href="#main-content" onClick={event => {
      event.preventDefault()
      document.getElementById('main-content')?.focus()
      document.getElementById('main-content')?.scrollIntoView({ behavior: 'instant' })
    }}>Перейти к содержанию</a>
    <SiteHeader />
    <Outlet />
    <footer>
      <div><span>Сайт обновлён</span><strong>{formatSyncDate(snapshot.syncedAt)}</strong></div>
      <p>Планы проверены {formatSyncDate(projects[0]?.measurement?.checkedAt ?? snapshot.syncedAt)}. Внутренние документы не публикуются.</p>
      <a href="https://github.com/alashevitch-sketch/project-catalog" target="_blank" rel="noreferrer">Исходный код <GitBranch aria-hidden="true" size={14} /></a>
    </footer>
  </div>
}
