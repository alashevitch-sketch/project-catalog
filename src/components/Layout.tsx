import { CircleDot, FolderKanban, GitBranch } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { formatSyncDate } from '../lib/metrics'
import { snapshot } from '../data/projects'

export function Layout() {
  const location = useLocation()

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])

  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="На главную">
          <span className="brand-mark"><FolderKanban size={18} /></span>
          <span>EVGENIY / PROJECT SYSTEM</span>
        </Link>
        <nav aria-label="Главная навигация">
          <Link to="/">Dashboard</Link>
          <a href="https://github.com/alashevitch-sketch" target="_blank" rel="noreferrer"><GitBranch size={15} /> GitHub</a>
        </nav>
        <span className="live"><CircleDot size={13} /> PORTFOLIO ONLINE</span>
      </header>
      <Outlet />
      <footer>
        <div><span>Последняя синхронизация</span><strong>{formatSyncDate(snapshot.syncedAt)}</strong></div>
        <p>Публичный слой данных · без локальных путей и внутренних документов</p>
        <a href="https://github.com/alashevitch-sketch/project-catalog" target="_blank" rel="noreferrer">Исходный код <GitBranch size={14} /></a>
      </footer>
    </div>
  )
}
