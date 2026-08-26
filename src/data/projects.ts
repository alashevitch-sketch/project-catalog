import manifest from './project-manifest.json'
import generated from './generated-projects.json'
import { projectSnapshotSchema } from './schema'
import type { ProjectSnapshot } from '../types/project'

const candidate = generated.projects.length > 0 ? generated : manifest

export const snapshot = projectSnapshotSchema.parse(candidate) as ProjectSnapshot
export const projects = snapshot.projects
