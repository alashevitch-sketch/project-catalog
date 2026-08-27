import { z } from 'zod'

const repositorySchema = z.object({
  owner: z.string().min(1),
  name: z.string().min(1),
  url: z.url(),
}).strict()

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
  measurement: z.object({ completed: z.number().int().nonnegative(), total: z.number().int().positive(), unit: z.enum(['задач', 'этапов']), checkedAt: z.iso.datetime(), method: z.string() }).strict().optional(),
  screenshots: z.array(z.object({ src: z.string().regex(/^screenshots\/[a-z0-9-]+\.png$/), alt: z.string().min(5), caption: z.string().min(5), capturedAt: z.iso.date() }).strict()).optional(),
  stack: z.array(z.string()).min(1),
  highlights: z.array(z.string()).min(1),
  metrics: z.array(z.object({ label: z.string(), value: z.string(), detail: z.string() })).min(2),
  phases: z.array(z.object({ label: z.string(), status: z.enum(['complete', 'current', 'next']), note: z.string() })).min(3),
  signals: z.array(z.object({ label: z.string(), value: z.number().min(0).max(100) })).min(3),
  history: z.array(z.object({ label: z.string(), value: z.number().min(0).max(100), date: z.iso.date().optional() })).min(1),
}).strict()

export const projectSnapshotSchema = z.object({
  syncedAt: z.string(),
  source: z.string(),
  projects: z.array(projectSchema).min(1),
}).strict()
