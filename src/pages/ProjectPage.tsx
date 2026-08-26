import { lazy, Suspense, useEffect } from 'react'
import { ArrowLeft, ArrowUpRight, GitBranch } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { StatusBadge } from '../components/StatusBadge'

const ProjectSignalChart = lazy(() => import('../components/ProjectSignalChart'))

export function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  useEffect(() => {
    document.title = project ? `${project.title} — Project System` : 'Проект не найден — Project System'
    return () => { document.title = 'EVGENIY / PROJECT SYSTEM' }
  }, [project])

  if (!project) {
    return <main className="not-found"><p className="eyebrow">404 / Project not found</p><h1>Такого проекта нет в публичном каталоге.</h1><Link to="/"><ArrowLeft size={17} /> Вернуться на dashboard</Link></main>
  }

  return (
    <main className="project-page" style={{ '--project-accent': project.accent } as React.CSSProperties}>
      <section className="project-hero">
        <Link className="back-link" to="/"><ArrowLeft size={16} /> Dashboard</Link>
        <div className="project-kicker"><span>{project.id}</span><StatusBadge status={project.status} health={project.health} /></div>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>{project.title}</motion.h1>
        <div className="project-intro"><p>{project.summary}</p><div className="progress-ring" style={{ '--progress': `${project.progress * 3.6}deg` } as React.CSSProperties}><strong>{project.progress}%</strong><span>готовность</span></div></div>
        <div className="project-actions">
          {project.website && <a href={project.website} target="_blank" rel="noreferrer">Открыть сайт <ArrowUpRight size={16} /></a>}
          {project.repository && <a href={project.repository.url} target="_blank" rel="noreferrer"><GitBranch size={16} /> Репозиторий</a>}
        </div>
      </section>

      <section className="project-metric-grid" aria-label="Метрики проекта">
        {project.metrics.map((metric) => <article key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><p>{metric.detail}</p></article>)}
      </section>

      <section className="detail-grid">
        <article className="detail-panel signal-panel"><div className="panel-heading"><span>01</span><div><h2>Сигналы проекта</h2><p>Готовность по ключевым контурам</p></div></div><Suspense fallback={<div className="chart-loading">Загрузка…</div>}><ProjectSignalChart project={project} /></Suspense></article>
        <article className="detail-panel next-panel"><div className="panel-heading"><span>02</span><div><h2>Следующая точка</h2><p>Конкретное действие, которое двигает проект</p></div></div><blockquote>{project.nextAction}</blockquote><div className="stack-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></article>
      </section>

      <section className="timeline-section">
        <div className="section-heading"><div><p className="eyebrow">Delivery map</p><h2>Этапы и контрольные точки</h2></div><span>Обновлено {project.updatedAt}</span></div>
        <ol className="timeline">{project.phases.map((phase, index) => <li className={phase.status} key={phase.label}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{phase.label}</h3><p>{phase.note}</p></div><i>{phase.status === 'complete' ? 'done' : phase.status === 'current' ? 'now' : 'next'}</i></li>)}</ol>
      </section>

      <section className="highlights-section"><p className="eyebrow">Что уже создано</p><div>{project.highlights.map((highlight, index) => <article key={highlight}><span>{String(index + 1).padStart(2, '0')}</span><p>{highlight}</p></article>)}</div></section>
    </main>
  )
}
