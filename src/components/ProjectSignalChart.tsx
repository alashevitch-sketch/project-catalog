import { useRef } from 'react'
import { useInView } from 'motion/react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Project } from '../types/project'
import { useAnimation } from './animation-context'

export default function ProjectSignalChart({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.2 })
  const { animated } = useAnimation()
  return <div ref={ref}>
    <div className="signal-chart" role="region" aria-label={`Направления работ: ${project.title}`}>
      {visible || !animated ? <ResponsiveContainer width="100%" height="100%"><RadarChart data={project.signals} outerRadius="52%" accessibilityLayer>
        <PolarGrid stroke="rgba(244,241,233,.18)" /><PolarAngleAxis dataKey="label" tick={{ fill: '#b9bdb6', fontSize: 10 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Завершено" dataKey="value" stroke={project.accent} fill={project.accent} fillOpacity={0.22} strokeWidth={2} isAnimationActive={animated} animationDuration={1200} animationEasing="ease-out" />
        <Tooltip contentStyle={{ background: '#151815', border: '1px solid #52594e', borderRadius: 4 }} formatter={value => [`${value}%`, 'Завершено']} />
      </RadarChart></ResponsiveContainer> : null}
    </div>
    <details className="chart-table"><summary>Показать значения</summary><table><caption>Завершённые пункты по направлениям</caption><tbody>{project.signals.map(signal => <tr key={signal.label}><th scope="row">{signal.label}</th><td>{signal.value}%</td></tr>)}</tbody></table></details>
  </div>
}
