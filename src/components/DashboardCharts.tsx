import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Project } from '../types/project'

const tooltipStyle = { background: '#151815', border: '1px solid rgba(244,241,233,.16)', borderRadius: 2, color: '#f4f1e9' }

export default function DashboardCharts({ projects }: { projects: Project[] }) {
  const statusData = [
    { name: 'Завершено', value: projects.filter((project) => project.status === 'completed').length, color: '#c6ff3d' },
    { name: 'В работе', value: projects.filter((project) => project.status === 'active').length, color: '#ff7a59' },
    { name: 'Другое', value: projects.filter((project) => !['completed', 'active'].includes(project.status)).length, color: '#7f9cff' },
  ].filter((entry) => entry.value > 0)
  const trajectory = Array.from({ length: Math.max(...projects.map((project) => project.history.length)) }, (_, index) => ({
    label: `Шаг ${index + 1}`,
    value: Math.round(projects.reduce((sum, project) => sum + (project.history[index]?.value ?? project.progress), 0) / projects.length),
  }))

  return (
    <div className="charts-grid">
      <article className="chart-panel chart-wide">
        <div className="chart-title"><div><span>01</span><h3>Готовность проектов</h3></div><p>Текущий подтвержденный прогресс</p></div>
        <div className="chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projects} layout="vertical" margin={{ left: 4, right: 18 }} accessibilityLayer>
              <CartesianGrid stroke="rgba(244,241,233,.08)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#858a83', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="id" type="category" tick={{ fill: '#f4f1e9', fontSize: 11 }} axisLine={false} tickLine={false} width={62} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(244,241,233,.04)' }} formatter={(value) => [`${value}%`, 'Готовность']} />
              <Bar dataKey="progress" radius={[0, 2, 2, 0]}>
                {projects.map((project) => <Cell key={project.id} fill={project.accent} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="chart-panel">
        <div className="chart-title"><div><span>02</span><h3>Статусы</h3></div><p>Распределение портфеля</p></div>
        <div className="chart-area pie-area">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={3} stroke="none">
                {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-center"><strong>{projects.length}</strong><span>проекта</span></div>
        </div>
        <div className="chart-legend">{statusData.map((entry) => <span key={entry.name}><i style={{ background: entry.color }} />{entry.name} · {entry.value}</span>)}</div>
      </article>
      <article className="chart-panel chart-full">
        <div className="chart-title"><div><span>03</span><h3>Траектория портфеля</h3></div><p>Средний накопленный прогресс по контрольным точкам</p></div>
        <div className="chart-area trajectory-area">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trajectory} margin={{ top: 10, right: 18, left: -18, bottom: 0 }} accessibilityLayer>
              <CartesianGrid stroke="rgba(244,241,233,.08)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#858a83', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#858a83', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Среднее']} />
              <Line type="monotone" dataKey="value" stroke="#c6ff3d" strokeWidth={3} dot={{ r: 4, fill: '#0b0d0c', stroke: '#c6ff3d', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  )
}
