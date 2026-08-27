import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, FolderKanban, Menu, Pause, Play, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { projects } from '../data/projects'
import { overviewSections, projectSections, sectionSearch, selectedSection } from '../lib/navigation'
import { useAnimation } from './animation-context'

export function SiteHeader() {
  const location = useLocation()
  const isProject = projects.some(project => location.pathname === `/project/${project.slug}`)
  const sections = isProject ? projectSections : overviewSections
  const pathname = isProject ? location.pathname : '/'
  const section = selectedSection(location.search, sections)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(section)
  const header = useRef<HTMLElement>(null)
  const toggleButton = useRef<HTMLButtonElement>(null)
  const previousNavigation = useRef({ pathname: location.pathname, section })
  const { animated, systemReduced, toggle } = useAnimation()
  const motionEnabled = useRef(animated)
  useEffect(() => { motionEnabled.current = animated }, [animated])

  function jump(id: string, smooth: boolean) {
    const target = document.getElementById(id)
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ behavior: smooth && animated ? 'smooth' : 'instant', block: 'start' })
  }

  useEffect(() => {
    const changedPage = previousNavigation.current.pathname !== location.pathname
    const changed = changedPage || previousNavigation.current.section !== section
    previousNavigation.current = { pathname: location.pathname, section }
    let frame = 0
    const observer = new MutationObserver(ready)
    function ready() {
      if (document.querySelector('[data-section-loading]')) return
      observer.disconnect()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const target = document.getElementById(section)
        if (target) {
          if (changed) target.focus({ preventScroll: true })
          target.scrollIntoView({ behavior: changed && !changedPage && motionEnabled.current ? 'smooth' : 'instant', block: 'start' })
        } else window.scrollTo({ top: 0, behavior: 'instant' })
      })
    }
    observer.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true })
    ready()
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [location.pathname, section])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const limit = (header.current?.getBoundingClientRect().bottom ?? 78) + 100
      const positions = sections.map(item => ({ id: item.id, top: document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity }))
      setActive(positions.filter(item => item.top <= limit).at(-1)?.id ?? sections[0].id)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame) }
  }, [sections])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleButton.current?.focus() }
    }
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false) }
    const resize = () => { if (window.innerWidth > 1100) setOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', outside)
    window.addEventListener('resize', resize)
    return () => { document.removeEventListener('keydown', closeOnEscape); document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', resize) }
  }, [open])

  const links = sections.map(item => <Link key={item.id} to={{ pathname, search: sectionSearch(location.pathname === pathname ? location.search : '', item.id) }}
    aria-current={active === item.id && location.pathname === pathname ? 'location' : undefined}
    onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      setOpen(false)
      if (section === item.id && location.pathname === pathname) jump(item.id, true)
    }}><span>{item.label}</span></Link>)

  return <header ref={header} className="site-header" onBlur={event => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false)
  }}>
    <div className="topbar">
      <Link className="brand" to="/?section=top" aria-label="На главную" onClick={() => { setOpen(false); if (location.pathname === '/') jump('top', true) }}>
        <span className="brand-mark"><FolderKanban aria-hidden="true" size={18} /></span><span>ЕВГЕНИЙ / ПРОЕКТЫ</span>
      </Link>
      <nav className="desktop-navigation" aria-label={isProject ? 'Разделы проекта' : 'Разделы каталога'}>
        {isProject && <Link className="catalog-link" to="/?section=projects">Все проекты</Link>}{links}
      </nav>
      <div className="header-tools">
        <button type="button" className="motion-toggle" onClick={toggle} disabled={systemReduced} aria-pressed={!animated}
          aria-label={systemReduced ? 'Анимация отключена в настройках устройства' : animated ? 'Отключить анимацию' : 'Включить анимацию'}>
          {animated ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}<span>{animated ? 'Анимация' : 'Без движения'}</span>
        </button>
        <button ref={toggleButton} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setOpen(value => !value)}>
          {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}<span>Меню</span>
        </button>
      </div>
    </div>
    {open && <div className="mobile-menu" id="mobile-navigation">
      <p>{isProject ? 'Разделы проекта' : 'Навигация по каталогу'}</p>
      <nav aria-label="Мобильная навигация">{isProject && <Link to="/?section=projects" onClick={() => setOpen(false)}>Все проекты</Link>}{links}</nav>
      <a className="menu-source" href="https://github.com/alashevitch-sketch/project-catalog" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Исходный код <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>}
  </header>
}
