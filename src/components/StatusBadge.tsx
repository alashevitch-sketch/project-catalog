import type { ProjectHealth, ProjectStatus } from '../types/project'

const statusLabels: Record<ProjectStatus, string> = {
  active: 'В работе',
  completed: 'Завершён',
  planned: 'Запланирован',
  paused: 'Пауза',
}

export function StatusBadge({ status, health }: { status: ProjectStatus; health: ProjectHealth }) {
  return <span className={`status-badge status-${health}`}><i />{statusLabels[status]}</span>
}
