export type ProjectStatus = 'active' | 'completed' | 'planned' | 'paused'
export type ProjectHealth = 'on-track' | 'attention' | 'complete'
export type PhaseStatus = 'complete' | 'current' | 'next'

export interface ProjectRepository {
  owner: string
  name: string
  url: string
}

export interface ProjectGithubSignals {
  stars: number
  forks: number
  openIssues: number
  pushedAt: string
  ciStatus: 'success' | 'failure' | 'pending' | 'unknown'
}

export interface Project {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  status: ProjectStatus
  health: ProjectHealth
  progress: number
  startedAt: string
  updatedAt: string
  nextAction: string
  accent: string
  repository?: ProjectRepository
  website?: string
  github?: ProjectGithubSignals
  measurement?: { completed: number; total: number; unit: 'задач' | 'этапов'; checkedAt: string; method: string }
  screenshots?: Array<{ src: string; alt: string; caption: string; capturedAt: string }>
  stack: string[]
  highlights: string[]
  metrics: Array<{ label: string; value: string; detail: string }>
  phases: Array<{ label: string; status: PhaseStatus; note: string }>
  signals: Array<{ label: string; value: number }>
  history: Array<{ label: string; value: number; date?: string }>
}

export interface ProjectSnapshot {
  syncedAt: string
  source: string
  projects: Project[]
}
