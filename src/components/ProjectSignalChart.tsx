import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Project } from '../types/project'

export default function ProjectSignalChart({ project }: { project: Project }) {
  return (
    <div className="signal-chart" aria-label={`Сигналы проекта ${project.title}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={project.signals} accessibilityLayer>
          <PolarGrid stroke="rgba(244,241,233,.14)" />
          <PolarAngleAxis dataKey="label" tick={{ fill: '#a4a8a1', fontSize: 11 }} />
          <Radar dataKey="value" stroke={project.accent} fill={project.accent} fillOpacity={0.22} strokeWidth={2} />
          <Tooltip contentStyle={{ background: '#151815', border: '1px solid rgba(244,241,233,.16)', borderRadius: 2 }} formatter={(value) => [`${value}%`, 'Готовность']} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
