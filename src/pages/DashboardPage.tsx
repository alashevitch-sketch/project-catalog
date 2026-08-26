import { lazy, Suspense, useMemo } from 'react'
import { motion } from 'motion/react'
import { Activity, CheckCircle2, Layers3, TrendingUp } from 'lucide-react'
import { projects, snapshot } from '../data/projects'
import { formatSyncDate, getPortfolioMetrics } from '../lib/metrics'
import type { ProjectStatus } from '../types/project'
import { ProjectCard } from '../components/ProjectCard'
import { useSearchParams } from 'react-router-dom'

const DashboardCharts = lazy(() => import('../components/DashboardCharts'))
type Filter = 'all' | ProjectStatus

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedFilter = searchParams.get('status')
  const filter: Filter = requestedFilter === 'active' || requestedFilter === 'completed' ? requestedFilter : 'all'
  const metrics = getPortfolioMetrics(projects)
  const filteredProjects = useMemo(() => filter === 'all' ? projects : projects.filter((project) => project.status === filter), [filter])
  const kpis = [
    { label: 'Всего проектов', value: String(metrics.total).padStart(2, '0'), note: 'единый публичный контур', icon: Layers3 },
    { label: 'Активная работа', value: String(metrics.active).padStart(2, '0'), note: 'требует внимания сейчас', icon: Activity },
    { label: 'Завершено', value: String(metrics.completed).padStart(2, '0'), note: 'результаты подтверждены', icon: CheckCircle2 },
    { label: 'Средняя готовность', value: `${metrics.averageProgress}%`, note: `${metrics.onTrack}/${metrics.total} без критических сигналов`, icon: TrendingUp },
  ]

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="hero" id="top">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>Публичный контур проектов · 2026</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .07 }}>
          Проекты как система.<br /><span>Статус виден сразу.</span>
        </motion.h1>
        <div className="hero-bottom">
          <p>Единый каталог архитектурных и цифровых проектов: прогресс, сигналы, решения и следующая точка движения.</p>
          <div><span>DATA SNAPSHOT</span><strong>{formatSyncDate(snapshot.syncedAt)}</strong></div>
        </div>
      </section>

      <section className="metrics" aria-label="Ключевые метрики">
        {kpis.map(({ label, value, note, icon: Icon }) => (
          <article className="metric" key={label}>
            <div><span>{label}</span><Icon aria-hidden="true" size={17} /></div>
            <strong>{value}</strong><p>{note}</p>
          </article>
        ))}
      </section>

      <section className="analytics-section" aria-labelledby="analytics-title">
        <div className="section-heading"><div><p className="eyebrow">Portfolio analytics</p><h2 id="analytics-title">Состояние системы</h2></div><span>Метрики рассчитаны из опубликованного snapshot</span></div>
        <Suspense fallback={<div className="charts-skeleton">Собираем визуализацию…</div>}><DashboardCharts projects={projects} /></Suspense>
      </section>

      <section className="project-section" aria-labelledby="projects-title">
        <div className="section-heading"><div><p className="eyebrow">Проектный радар</p><h2 id="projects-title">Текущий портфель</h2></div><div className="filters" role="group" aria-label="Фильтр проектов">
          {([['all', 'Все'], ['active', 'В работе'], ['completed', 'Завершено']] as const).map(([value, label]) => (
            <button key={value} type="button" className={filter === value ? 'active' : ''} aria-pressed={filter === value} onClick={() => setSearchParams(value === 'all' ? {} : { status: value }, { replace: true })}>{label}</button>
          ))}
        </div></div>
        <motion.div className="project-grid" layout>
          {filteredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
          {filteredProjects.length === 0 && <p className="empty-state">Проектов с таким статусом пока нет.</p>}
        </motion.div>
      </section>

      <section className="principles">
        <p className="eyebrow">System principles</p>
        <div><h2>Публичность без потери контроля.</h2><p>В каталог попадают только явно разрешённые поля. Локальные пути, рабочие документы, исходники и внутренние заметки остаются вне публичной сборки.</p></div>
      </section>
    </main>
  )
}
