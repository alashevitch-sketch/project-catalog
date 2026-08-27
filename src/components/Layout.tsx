import { CircleDot, FolderKanban, GitBranch, Pause, Play } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { formatSyncDate } from '../lib/metrics'
import { projects, snapshot } from '../data/projects'
import { useAnimation } from './animation-context'

export function Layout() {
  const location = useLocation()
  const previousPath = useRef(location.pathname)
  const capture = new URLSearchParams(location.search).has('capture')
  const { animated, systemReduced, toggle } = useAnimation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (previousPath.current !== location.pathname) document.getElementById('main-content')?.focus({ preventScroll: true })
    previousPath.current = location.pathname
  }, [location.pathname])
  return <div className={`shell ${capture ? 'capture-mode' : ''}`} data-animations={animated ? 'on' : 'off'}>
    <a className="skip-link" href="#main-content" onClick={event => {
      event.preventDefault()
      document.getElementById('main-content')?.focus()
      document.getElementById('main-content')?.scrollIntoView({ behavior: 'instant' })
    }}>Перейти к содержанию</a>
    <header className="topbar">
      <Link className="brand" to="/" aria-label="На главную"><span className="brand-mark"><FolderKanban aria-hidden="true" size={18} /></span><span>ЕВГЕНИЙ / ПРОЕКТЫ</span></Link>
      <nav aria-label="Главная навигация"><Link to="/">Обзор</Link><a href="https://github.com/alashevitch-sketch" target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" size={15} /> Исходный код</a></nav>
      <div className="header-tools">
        <button type="button" className="motion-toggle" onClick={toggle} disabled={systemReduced} aria-pressed={!animated}
          aria-label={systemReduced ? 'Анимация отключена в настройках устройства' : animated ? 'Отключить анимацию' : 'Включить анимацию'}>
          {animated ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}<span>{animated ? 'Анимация' : 'Без движения'}</span>
        </button>
        <span className="live"><CircleDot aria-hidden="true" size={13} /><span>Каталог открыт</span></span>
      </div>
    </header>
    <Outlet />
    <footer>
      <div><span>Сайт обновлён</span><strong>{formatSyncDate(snapshot.syncedAt)}</strong></div>
      <p>Планы проверены {formatSyncDate(projects[0]?.measurement?.checkedAt ?? snapshot.syncedAt)}. Внутренние документы не публикуются.</p>
      <a href="https://github.com/alashevitch-sketch/project-catalog" target="_blank" rel="noreferrer">Исходный код <GitBranch aria-hidden="true" size={14} /></a>
    </footer>
  </div>
}
