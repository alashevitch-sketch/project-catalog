import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useInView } from 'motion/react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Project } from '../types/project'
import { getPortfolioHistory } from '../lib/metrics'
import { useAnimation } from './animation-context'
import { Hint } from './Hint'

const tooltipStyle = { background: '#151815', border: '1px solid #52594e', borderRadius: 4, color: '#f4f1e9' }
const tick = { fill: '#a4a8a1', fontSize: 11 }
function Frame({ title, number, note, hint, full = false, children }: { title: string; number: string; note: string; hint: string; full?: boolean; children: (animate: boolean) => ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.15 })
  const { animated } = useAnimation()
  return <article ref={ref} className={`chart-panel ${full ? 'chart-full' : ''}`}>
    <div className="chart-title"><div><span>{number}</span><h3>{title}</h3><Hint label={title}>{hint}</Hint></div><p>{note}</p></div>
    <div key={visible ? 'visible' : 'waiting'}>{children(animated && visible)}</div>
  </article>
}

export default function DashboardCharts({ projects }: { projects: Project[] }) {
  const statusData = [
    { name: 'Завершено', value: projects.filter(project => project.status === 'completed').length, color: '#c6ff3d' },
    { name: 'В работе', value: projects.filter(project => project.status === 'active').length, color: '#ff7a59' },
    { name: 'Приостановлено', value: projects.filter(project => project.status === 'paused').length, color: '#7f9cff' },
    { name: 'Запланировано', value: projects.filter(project => project.status === 'planned').length, color: '#e2b5ff' },
  ].filter(entry => entry.value > 0)
  const trajectory = getPortfolioHistory(projects)
  const chartProjects = projects.map(project => ({ ...project, shortId: project.id.replace('PRJ-', '№\u00a0') }))
  return <div className="charts-grid">
    <Frame title="Выполнение планов" number="01" note="Завершённые пункты" hint="У каждого проекта выбран собственный план. Считаются только полностью завершённые пункты, без оценки незавершённой работы.">
      {animated => <><div className="chart-area"><ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartProjects} layout="vertical" margin={{ left: 4, right: 22 }} accessibilityLayer aria-label="Доля выполненных пунктов по проектам">
          <CartesianGrid stroke="rgba(244,241,233,.08)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={tick} axisLine={false} tickLine={false} />
          <YAxis dataKey="shortId" type="category" tick={{ ...tick, fill: '#f4f1e9' }} axisLine={false} tickLine={false} width={62} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(244,241,233,.04)' }} formatter={value => [`${value}%`, 'Выполнено']} />
          <Bar dataKey="progress" name="Выполнено" radius={[0, 3, 3, 0]} isAnimationActive={animated} animationDuration={1100} animationEasing="ease-out">{chartProjects.map(project => <Cell key={project.id} fill={project.accent} />)}</Bar>
        </BarChart>
      </ResponsiveContainer></div><details className="chart-table"><summary>Показать значения</summary><table><caption>Выполнение выбранных планов</caption><tbody>{projects.map(project => <tr key={project.id}><th scope="row">{project.title}</th><td>{project.progress}%</td></tr>)}</tbody></table></details></>}
    </Frame>
    <Frame title="Состояние проектов" number="02" note="Распределение по статусам" hint="Распределение проектов по состоянию на дату выгрузки. Это количество проектов, а не затраченное время.">
      {animated => <><div className="chart-area pie-area"><ResponsiveContainer width="100%" height="100%"><PieChart accessibilityLayer aria-label="Распределение проектов по состоянию">
        <Pie data={statusData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={3} stroke="none" isAnimationActive={animated} animationDuration={1200} animationEasing="ease-out">{statusData.map(entry => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} />
      </PieChart></ResponsiveContainer><div className="pie-center"><strong>{projects.length}</strong><span>всего</span></div></div>
      <div className="chart-legend">{statusData.map(entry => <span key={entry.name}><i aria-hidden="true" style={{ background: entry.color }} />{entry.name} · {entry.value}</span>)}</div></>}
    </Frame>
    <Frame title="История измерений" number="03" note="По фактическим датам" full hint="История записывается при выгрузке планов. За одну дату сохраняется последнее измерение. Старые значения не восстанавливаются предположениями.">
      {animated => <><div className="chart-area trajectory-area"><ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory} margin={{ top: 12, right: 28, left: -12, bottom: 0 }} accessibilityLayer aria-label="Изменение среднего выполнения планов по датам">
        <CartesianGrid stroke="rgba(244,241,233,.08)" vertical={false} /><XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={tick} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={value => [`${value}%`, 'Среднее выполнение']} />
        <Line type="linear" dataKey="value" name="Среднее выполнение" stroke="#c6ff3d" strokeWidth={3} dot={{ r: 5, fill: '#0b0d0c', stroke: '#c6ff3d', strokeWidth: 2 }} activeDot={{ r: 7 }} isAnimationActive={animated} animationDuration={1400} animationEasing="ease-out" />
      </LineChart></ResponsiveContainer></div><p className="history-note">{trajectory.length < 2 ? 'Сохранено первое измерение. Линия изменений появится после следующей даты выгрузки.' : 'Показаны сохранённые измерения; промежуточные значения не добавляются.'}</p></>}
    </Frame>
  </div>
}
