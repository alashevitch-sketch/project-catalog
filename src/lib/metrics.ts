import type { Project, ProjectGithubSignals } from '../types/project'

export function getPortfolioMetrics(projects: Project[]) {
  const total = projects.length
  const active = projects.filter((project) => project.status === 'active').length
  const completed = projects.filter((project) => project.status === 'completed').length
  const onTrack = projects.filter((project) => project.health !== 'attention').length
  const averageProgress = total === 0
    ? 0
    : Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / total)

  return { total, active, completed, onTrack, averageProgress }
}

export function formatSyncDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  }).format(new Date(value))
}

export function formatProjectDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Moscow',
  }).format(new Date(value))
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export const ciStatusMeta: Record<ProjectGithubSignals['ciStatus'], { label: string; note: string }> = {
  success: { label: 'CI проходит', note: 'последняя сборка успешна' },
  failure: { label: 'CI требует внимания', note: 'последняя сборка завершилась ошибкой' },
  pending: { label: 'CI выполняется', note: 'сборка ещё не завершена' },
  unknown: { label: 'CI без данных', note: 'статус workflow недоступен' },
}
