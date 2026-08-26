import { ArrowUpRight, CircleDot, GitFork, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { Project } from '../types/project'
import { ciStatusMeta, formatCompactNumber } from '../lib/metrics'
import { StatusBadge } from './StatusBadge'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      className="project-card"
      style={{ '--project-accent': project.accent } as React.CSSProperties}
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.18) }}
      whileHover={{ y: -7 }}
    >
      <Link to={`/project/${project.slug}`} aria-label={`Открыть проект ${project.title}`}>
        <div className="card-head"><span>{project.id}</span><ArrowUpRight aria-hidden="true" size={20} /></div>
        <div className="card-status"><StatusBadge status={project.status} health={project.health} /></div>
        <p>{project.category}</p>
        <h3>{project.title}</h3>
        {project.github && <div className="card-github" aria-label="Сигналы GitHub">
          <span className={`ci-dot ci-${project.github.ciStatus}`} title={ciStatusMeta[project.github.ciStatus].note}><CircleDot aria-hidden="true" size={12} /> {ciStatusMeta[project.github.ciStatus].label}</span>
          <span title="Stars"><Star aria-hidden="true" size={12} /> {formatCompactNumber(project.github.stars)}</span>
          <span title="Forks"><GitFork aria-hidden="true" size={12} /> {formatCompactNumber(project.github.forks)}</span>
        </div>}
        <div className="progress-meta"><span>Готовность</span><strong>{project.progress}%</strong></div>
        <div className="progress" role="progressbar" aria-label={`Готовность ${project.progress}%`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={project.progress}>
          <motion.span initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ delay: 0.22 + index * 0.05, duration: 0.7 }} />
        </div>
      </Link>
    </motion.article>
  )
}
