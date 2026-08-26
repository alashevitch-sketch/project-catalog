import { z } from 'zod'

const repositorySchema = z.object({
  owner: z.string().min(1),
  name: z.string().min(1),
  url: z.url(),
})

const githubSchema = z.object({
  stars: z.number().int().min(0),
  forks: z.number().int().min(0),
  openIssues: z.number().int().min(0),
  pushedAt: z.string(),
  ciStatus: z.enum(['success', 'failure', 'pending', 'unknown']),
})

export const projectSchema = z.object({
  id: z.string().regex(/^PRJ-\d{3}$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  category: z.string().min(2),
  summary: z.string().min(20),
  status: z.enum(['active', 'completed', 'planned', 'paused']),
  health: z.enum(['on-track', 'attention', 'complete']),
  progress: z.number().int().min(0).max(100),
  startedAt: z.string(),
  updatedAt: z.string(),
  nextAction: z.string().min(5),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  repository: repositorySchema.optional(),
  website: z.url().optional(),
  github: githubSchema.optional(),
  stack: z.array(z.string()).min(1),
  highlights: z.array(z.string()).min(1),
  metrics: z.array(z.object({ label: z.string(), value: z.string(), detail: z.string() })).min(2),
  phases: z.array(z.object({ label: z.string(), status: z.enum(['complete', 'current', 'next']), note: z.string() })).min(3),
  signals: z.array(z.object({ label: z.string(), value: z.number().min(0).max(100) })).min(3),
  history: z.array(z.object({ label: z.string(), value: z.number().min(0).max(100) })).min(3),
})

export const projectSnapshotSchema = z.object({
  syncedAt: z.string(),
  source: z.string(),
  projects: z.array(projectSchema).min(1),
})
