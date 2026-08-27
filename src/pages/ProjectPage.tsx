import { lazy, Suspense, useEffect } from 'react'
import { ArrowLeft, ArrowUpRight, CircleAlert, CircleDot, GitBranch, GitFork, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { StatusBadge } from '../components/StatusBadge'
import { ciStatusMeta, formatCompactNumber, formatProjectDate, formatSyncDate } from '../lib/metrics'
import { AnimatedNumber, MotionSection, ProgressRing } from '../components/Motion'
import { useAnimation } from '../components/animation-context'
import { Hint } from '../components/Hint'
import { ScreenshotGallery } from '../components/ScreenshotGallery'

const ProjectSignalChart = lazy(() => import('../components/ProjectSignalChart'))

export function ProjectPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const capture = params.has('capture')
  const { animated } = useAnimation()
  const project = projects.find(item => item.slug === slug)
  useEffect(() => {
    document.title = project ? `${project.title} — Проекты Евгения` : 'Проект не найден — Проекты Евгения'
    return () => { document.title = 'Евгений / Проекты' }
  }, [project])
  if (!project) return <main id="main-content" tabIndex={-1} className="not-found"><p className="eyebrow">Страница не найдена</p><h1>Такого проекта нет в публичном каталоге.</h1><Link to="/"><ArrowLeft size={17} aria-hidden="true" /> Вернуться к обзору</Link></main>
  return <main id="main-content" tabIndex={-1} className="project-page" style={{ '--project-accent': project.accent } as React.CSSProperties}>
    <MotionSection className="project-hero">
      <Link className="back-link" to="/"><ArrowLeft size={16} aria-hidden="true" /> Все проекты</Link>
      <div className="project-kicker"><span>{project.id.replace('PRJ-', 'Проект ')}</span><StatusBadge status={project.status} health={project.health} /></div>
      <h1>{project.title}</h1>
      <div className="project-intro"><p>{project.summary}</p><ProgressRing value={project.progress} /></div>
      <div className="measurement-note">
        <p>{project.measurement ? `Завершено ${project.measurement.completed} из ${project.measurement.total} ${project.measurement.unit} выбранного плана.` : 'Сведения из публичного описания.'}</p>
        <Hint label="Как рассчитано выполнение плана">{project.measurement?.method ?? 'Значение задано в публичном описании проекта.'}</Hint>
      </div>
      <div className="project-actions">
        {project.website && <a href={project.website} target="_blank" rel="noreferrer">Открыть сайт <ArrowUpRight size={16} aria-hidden="true" /></a>}
        {project.repository && <a href={project.repository.url} target="_blank" rel="noreferrer"><GitBranch size={16} aria-hidden="true" /> Исходный код</a>}
      </div>
    </MotionSection>
    <MotionSection className="project-metric-grid" aria-label="Показатели проекта">
      {project.metrics.map(metric => <article key={metric.label}><span>{metric.label}</span><strong>{/^\d+$/.test(metric.value) ? <AnimatedNumber value={Number(metric.value)} /> : metric.value}</strong><p>{metric.detail}</p></article>)}
    </MotionSection>
    {!capture && project.screenshots?.length ? <MotionSection className="screenshot-section" aria-labelledby="screenshots-title">
      <div className="section-heading"><div><p className="eyebrow">Посмотреть ближе</p><h2 id="screenshots-title">Снимки проекта</h2></div><p className="section-note">Публичное представление <Hint label="Что показано на снимках">Это снимки публичных страниц проекта, а не внутреннего рабочего приложения, чертежей или закрытых документов. Изображения фиксируют состояние на указанную дату.</Hint></p></div>
      <ScreenshotGallery project={project} />
    </MotionSection> : null}
    {project.github && <MotionSection className="github-section" aria-labelledby="github-title">
      <div className="section-heading"><div><p className="eyebrow">Открытая разработка</p><h2 id="github-title">Состояние исходного кода</h2></div><p className={`ci-status ci-${project.github.ciStatus}`}><CircleDot size={13} aria-hidden="true" />{ciStatusMeta[project.github.ciStatus].label}<Hint label="Проверка сборки">Результат последней завершённой автоматической проверки. Текущий запуск не учитывается, чтобы не показывать бесконечное ожидание. Данные зафиксированы при обновлении сайта.</Hint></p></div>
      <div className="github-grid">
        <article><Star size={18} aria-hidden="true" /><span>Отметки интереса <Hint label="Отметки интереса">Сколько пользователей GitHub добавили исходный код проекта в избранное. Это не число посетителей сайта.</Hint></span><strong>{formatCompactNumber(project.github.stars)}</strong><p>сохранения в избранное</p></article>
        <article><GitFork size={18} aria-hidden="true" /><span>Копии проекта <Hint label="Копии проекта">Количество независимых ответвлений исходного кода на GitHub. Обычные скачивания здесь не учитываются.</Hint></span><strong>{formatCompactNumber(project.github.forks)}</strong><p>независимые ответвления</p></article>
        <article><CircleAlert size={18} aria-hidden="true" /><span>Открытые вопросы <Hint label="Открытые вопросы">Сумма открытых задач и предложений изменений в исходном коде. Это не полный список работ по проекту.</Hint></span><strong>{formatCompactNumber(project.github.openIssues)}</strong><p>задачи и предложения изменений</p></article>
        <article><GitBranch size={18} aria-hidden="true" /><span>Последнее изменение</span><strong className="date-value"><time dateTime={project.github.pushedAt}>{formatProjectDate(project.github.pushedAt)}</time></strong><p>{ciStatusMeta[project.github.ciStatus].note}</p></article>
      </div>
    </MotionSection>}
    <MotionSection className="detail-grid" aria-label="Направления и дальнейшие действия">
      <article className="detail-panel signal-panel"><div className="panel-heading"><span>01</span><div><h2>Направления работ</h2><p>Завершённые пункты в каждой группе <Hint label="Направления работ">Каждая ось показывает долю завершённых пунктов одной группы. Нулевое значение означает отсутствие полностью закрытых пунктов, а не отсутствие проделанной работы.</Hint></p></div></div><Suspense fallback={<div className="chart-loading">Загрузка…</div>}><ProjectSignalChart project={project} /></Suspense></article>
      <article className="detail-panel next-panel"><div className="panel-heading"><span>02</span><div><h2>Следующий шаг</h2><p>Ближайшее действие по проекту</p></div></div><blockquote>{project.nextAction}</blockquote><div className="stack-list">{project.stack.map(item => <span key={item}>{item}</span>)}</div></article>
    </MotionSection>
    <MotionSection className="timeline-section" aria-labelledby="phases-title">
      <div className="section-heading"><div><p className="eyebrow">От плана к результату</p><h2 id="phases-title">Этапы и контрольные точки</h2></div><span>План проверен <time dateTime={project.measurement?.checkedAt ?? project.updatedAt}>{formatProjectDate(project.updatedAt)}</time></span></div>
      <ol className="timeline">{project.phases.map((phase, index) => <motion.li className={phase.status} key={phase.label}
        initial={animated ? { opacity: 0, x: -12 } : false} whileInView={{ opacity: 1, x: 0 }} animate={animated ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: animated ? 0.4 : 0, delay: animated ? index * 0.05 : 0 }}>
        <span>{String(index + 1).padStart(2, '0')}</span><div><h3>{phase.label}</h3><p>{phase.note}</p></div><i>{phase.status === 'complete' ? 'Завершено' : phase.status === 'current' ? 'В работе' : 'Предстоит'}</i>
      </motion.li>)}</ol>
    </MotionSection>
    <MotionSection className="highlights-section"><p className="eyebrow">Что уже сделано</p><div>{project.highlights.map((highlight, index) => <motion.article key={highlight} whileHover={animated ? { y: -4 } : undefined}><span>{String(index + 1).padStart(2, '0')}</span><p>{highlight}</p></motion.article>)}</div><p className="source-note">Источник показателей: разрешённая выгрузка плана от {formatSyncDate(project.measurement?.checkedAt ?? project.updatedAt)}.</p></MotionSection>
  </main>
}
