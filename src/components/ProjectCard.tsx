import { ArrowUpRight, CircleDot } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { Project } from '../types/project'
import { ciStatusMeta } from '../lib/metrics'
import { StatusBadge } from './StatusBadge'
import { useAnimation } from './animation-context'
import { ProjectCover } from './ProjectCover'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { animated } = useAnimation()
  return <motion.article className="project-card" style={{ '--project-accent': project.accent } as React.CSSProperties}
    layout={animated} initial={animated ? { opacity: 0, y: 18 } : false}
    animate={{ opacity: 1, y: 0 }} exit={animated ? { opacity: 0, scale: 0.96 } : undefined}
    transition={{ duration: animated ? 0.35 : 0, delay: Math.min(index * 0.06, 0.18) }}
    whileHover={animated ? { y: -6 } : undefined}>
    <Link to={`/project/${project.slug}`}>
      <ProjectCover project={project} />
      <div className="card-content">
        <div className="card-head"><span>{project.id.replace('PRJ-', 'Проект ')}</span><ArrowUpRight aria-hidden="true" size={20} /></div>
        <div className="card-status"><StatusBadge status={project.status} health={project.health} /></div>
        <p>{project.category}</p><h3>{project.title}</h3>
        {project.github && <div className="card-github"><span className={`ci-${project.github.ciStatus}`}><CircleDot aria-hidden="true" size={12} />{ciStatusMeta[project.github.ciStatus].label}</span></div>}
        <div className="progress-meta"><span>Выполнение плана</span><strong>{project.progress}%</strong></div>
        <div className="progress" role="progressbar" aria-label="Выполнение плана" aria-valuemin={0} aria-valuemax={100} aria-valuenow={project.progress}>
          <motion.span style={{ transformOrigin: 'left' }} initial={animated ? { scaleX: 0 } : false}
            whileInView={{ scaleX: project.progress / 100 }} animate={animated ? undefined : { scaleX: project.progress / 100 }}
            viewport={{ once: true }} transition={{ duration: animated ? 0.9 : 0 }} />
        </div>
        {project.measurement && <p className="card-measurement">{project.measurement.completed} из {project.measurement.total} {project.measurement.unit} завершено</p>}
      </div>
    </Link>
  </motion.article>
}
