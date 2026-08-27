import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Activity, CheckCircle2, Layers3, TrendingUp } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { projects, snapshot } from '../data/projects'
import { formatSyncDate, getPortfolioMetrics } from '../lib/metrics'
import { ProjectCard } from '../components/ProjectCard'
import { AnimatedNumber, MotionSection } from '../components/Motion'
import { useAnimation } from '../components/animation-context'
import { Hint } from '../components/Hint'

const DashboardCharts = lazy(() => import('../components/DashboardCharts'))

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedFilter = searchParams.get('status')
  const filter = ['active', 'completed', 'paused', 'planned'].includes(requestedFilter ?? '') ? requestedFilter : 'all'
  const { animated } = useAnimation()
  const metrics = getPortfolioMetrics(projects)
  const filtered = filter === 'all' ? projects : projects.filter(project => project.status === filter)
  const kpis = [
    { label: 'Всего проектов', value: metrics.total, note: 'разрешены к публикации', icon: Layers3, hint: 'Количество проектов, для которых подготовлено отдельное публичное описание. Приватные проекты автоматически сюда не добавляются.' },
    { label: 'В работе', value: metrics.active, note: 'продолжаются сейчас', icon: Activity, hint: 'Проекты с действующими задачами. Состояние берётся из основной заметки проекта при безопасной выгрузке.' },
    { label: 'Завершено', value: metrics.completed, note: 'отмечены завершёнными', icon: CheckCircle2, hint: 'Проекты, отмеченные завершёнными в системе управления. Выпуск сайта и физическое завершение строительства — разные события.' },
    { label: 'Выполнение планов', value: metrics.averageProgress, note: 'среднее по всем проектам', icon: TrendingUp, suffix: '%', hint: 'Среднее арифметическое долей выполненных пунктов выбранных планов. Каждый проект имеет одинаковый вес. Это не процент строительной готовности.' },
  ]
  function changeFilter(value: string) {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      if (value === 'all') next.delete('status'); else next.set('status', value)
      return next
    }, { replace: true })
  }
  return <main id="main-content" tabIndex={-1}>
    <MotionSection className="hero" id="top">
      <p className="eyebrow">Архитектура · цифровые проекты · проверенные результаты</p>
      <h1>Проекты как система.<br /><span>Статус виден сразу.</span></h1>
      <div className="hero-bottom">
        <p>Четыре проекта, единая картина. Что завершено, над чем идёт работа и какой шаг нужен дальше.</p>
        <div><span>ОБНОВЛЕНИЕ ДАННЫХ <Hint label="Обновление данных">Сведения об исходном коде обновляются при сборке сайта и по расписанию. Локальные планы — после безопасной выгрузки с компьютера. Это не непрерывное наблюдение за рабочими файлами.</Hint></span><strong>{formatSyncDate(snapshot.syncedAt)}</strong></div>
      </div>
    </MotionSection>
    <MotionSection className="metrics" aria-label="Ключевые показатели">
      {kpis.map(({ label, value, note, icon: Icon, suffix, hint }) => <article className="metric" key={label}>
        <div><span>{label} <Hint label={label}>{hint}</Hint></span><Icon size={17} aria-hidden="true" /></div>
        <strong><AnimatedNumber value={value} suffix={suffix} padded={!suffix} /></strong><p>{note}</p>
      </article>)}
    </MotionSection>
    <MotionSection className="analytics-section" aria-labelledby="analytics-title">
      <div className="section-heading"><div><p className="eyebrow">Показатели и динамика</p><h2 id="analytics-title">Состояние системы</h2></div><p className="section-note">Только зафиксированные измерения. <Hint label="Источники показателей">Проценты рассчитываются из завершённых задач или контрольных точек выбранных планов. Разные проекты имеют разный объём работ; сравнение показывает выполнение планов, а не сложность проектов.</Hint></p></div>
      <Suspense fallback={<div className="charts-skeleton">Загрузка графиков…</div>}><DashboardCharts projects={projects} /></Suspense>
    </MotionSection>
    <MotionSection className="project-section" aria-labelledby="projects-title">
      <div className="section-heading"><div><p className="eyebrow">От общего к деталям</p><h2 id="projects-title">Все проекты</h2></div>
        <div className="filters" role="group" aria-label="Фильтр проектов">
          {([['all', 'Все'], ['active', 'В работе'], ['completed', 'Завершено'], ['planned', 'Запланировано'], ['paused', 'Приостановлено']] as const)
            .filter(([value]) => ['all', 'active', 'completed'].includes(value) || projects.some(project => project.status === value))
            .map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} className={filter === value ? 'active' : ''} onClick={() => changeFilter(value)}>{label}</button>)}
        </div>
      </div>
      <p className="filter-summary" role="status">Показано: {filtered.length} из {projects.length}</p>
      <motion.div className="project-grid" layout={animated}><AnimatePresence initial={false}>
        {filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </AnimatePresence>{filtered.length === 0 && <p className="empty-state">Проектов с таким состоянием пока нет. Выберите «Все».</p>}</motion.div>
    </MotionSection>
    <MotionSection className="principles">
      <p className="eyebrow">Открыто только нужное</p>
      <div><h2>Публичность без потери контроля.</h2><p>Сайт получает разрешённые описания и числовые показатели. Рабочие документы, личные заметки и расположение файлов остаются в закрытой системе. Снимки показывают только публичные страницы.</p></div>
    </MotionSection>
  </main>
}
