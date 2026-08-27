import { useId } from 'react'
import type { CSSProperties } from 'react'
import type { Project } from '../types/project'

const covers: Record<string, { label: string; description: string; kind: string }> = {
  'PRJ-001': { label: 'Архитектура пространства', description: 'Условная планировочная композиция кафе: зал, столы и служебная часть. Не рабочий чертёж и не фактическая планировка.', kind: 'cafe' },
  'PRJ-002': { label: 'Карта проектной памяти', description: 'Схема связей между проектом, планом, решениями, рабочими сессиями и результатами.', kind: 'memory' },
  'PRJ-003': { label: 'Устройство каталога', description: 'Схема каталога: карточки проектов, показатели и последовательность проверки и публикации.', kind: 'catalog' },
  'PRJ-004': { label: 'Пространство для событий', description: 'Условная композиция праздничных комнат и игрового пространства. Не рабочий чертёж и не фактическая планировка.', kind: 'rooms' },
}

function Table({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><circle r="17" /><path d="M-10-24h20M-10 24h20M-24-10v20M24-10v20" /></g>
}

function CafeDrawing() {
  return <>
    <g className="cover-faint"><path d="M125 77V361M630 77V361M102 100H674M102 332H674M125 361H630M143 352l-18 18M648 352l-18 18" /><path strokeDasharray="5 7" d="M111 207H652M382 78V348" /><circle cx="125" cy="82" r="12" /><circle cx="630" cy="82" r="12" /></g>
    <g className="cover-structure"><path d="M150 112H610V320H424M367 320H150V112" /><path d="M158 120H602V312H424M367 312H158V120M458 120V244M458 278V312" /><path d="M367 320v-55a55 55 0 0 1 55 55M458 244h34a34 34 0 0 1-34 34" /><path d="M190 112h80M302 112h80M150 151v90M610 152v90" strokeWidth="5" /></g>
    <g className="cover-accent"><Table x={225} y={173} /><Table x={330} y={173} /><Table x={225} y={265} /><Table x={330} y={265} /><path d="M477 139h106v39H477zM485 146h29v24h-29zM545 149h26M545 163h26M477 291h106v-81h-35v47h-71z" /></g>
    <g className="cover-faint"><path d="M182 341v-13M277 341v-13M486 341v-13M581 341v-13M182 342h95M486 342h95" /><path d="M666 259V161m-7 12 7-12 7 12M660 259h12" /><circle cx="665" cy="300" r="22" /><path d="M665 277v46m-23-23h46" /></g>
    <g className="cover-label"><text x="275" y="224" textAnchor="middle">ЗАЛ</text><text x="532" y="198" textAnchor="middle">СЕРВИС</text><text x="381" y="384" textAnchor="middle">ПРОСТРАНСТВО · СВЕТ · СВЯЗИ</text></g>
  </>
}

function RoomsDrawing() {
  return <>
    <g className="cover-faint"><path d="M116 86H680M116 361H680M136 66V383M664 66V383" /><path strokeDasharray="4 7" d="M116 223H680M328 72V372" /><circle cx="136" cy="86" r="11" /><circle cx="664" cy="86" r="11" /></g>
    <g className="cover-structure"><path d="M155 106H642V343H419M378 343H155V106" strokeWidth="3" /><path d="M163 114H634V335H419M378 335H163V114M325 114V171M325 205V246M325 280V335M163 222H325M326 205h-34a34 34 0 0 1 34-34M326 280h-34a34 34 0 0 1 34-34M378 343v-40a40 40 0 0 1 40 40" /></g>
    <g className="cover-accent"><rect x="192" y="142" width="95" height="39" rx="19" /><rect x="192" y="263" width="95" height="39" rx="19" /><path d="M205 134v-10m23 10v-10m23 10v-10m23 10v-10M205 189v10m23-10v10m23-10v10m23-10v10M205 255v-10m23 10v-10m23 10v-10m23 10v-10M205 310v10m23-10v10m23-10v10m23-10v10" /><circle cx="497" cy="203" r="65" /><circle cx="497" cy="203" r="46" strokeDasharray="3 7" /><path d="m488 178 28 25-28 25z" /><rect x="578" y="135" width="32" height="54" rx="8" /><rect x="578" y="213" width="32" height="54" rx="8" /></g>
    <path className="cover-accent cover-route" strokeDasharray="5 8" d="M398 325V289Q398 264 423 264H483" />
    <g className="cover-label"><text x="240" y="211" textAnchor="middle">СОБЫТИЯ</text><text x="497" y="305" textAnchor="middle">ИГРА И ДВИЖЕНИЕ</text><text x="400" y="385" textAnchor="middle">КОМНАТЫ · МАРШРУТЫ · СОБЫТИЯ</text></g>
  </>
}

function MemoryDrawing() {
  return <>
    <g className="cover-faint"><circle cx="400" cy="226" r="141" strokeDasharray="3 9" /><circle cx="400" cy="226" r="93" /><path d="M142 226H658M400 75V372" strokeDasharray="5 8" /></g>
    <g className="cover-accent cover-route"><path d="M320 203 228 152M480 203l93-51M320 250l-92 52M480 250l93 52M400 170V128M400 282v48" /><circle cx="320" cy="203" r="4" /><circle cx="480" cy="250" r="4" /></g>
    <g className="cover-structure"><rect x="326" y="176" width="148" height="98" rx="8" /><path d="M337 168h145v98M345 160h145v98" /><rect x="125" y="108" width="134" height="72" rx="5" /><rect x="541" y="108" width="134" height="72" rx="5" /><rect x="125" y="274" width="134" height="72" rx="5" /><rect x="541" y="274" width="134" height="72" rx="5" /><path d="M145 128h30m-30 8h18M561 128h30m-30 8h18M145 294h30m-30 8h18M561 294h30m-30 8h18" /></g>
    <g className="cover-label"><text x="400" y="216" textAnchor="middle" className="cover-title">ПРОЕКТ</text><text x="400" y="244" textAnchor="middle">единый контекст</text><text x="192" y="161" textAnchor="middle">ПЛАН</text><text x="608" y="161" textAnchor="middle">РЕШЕНИЯ</text><text x="192" y="327" textAnchor="middle">СЕССИИ</text><text x="608" y="327" textAnchor="middle">РЕЗУЛЬТАТЫ</text><text x="400" y="106" textAnchor="middle">СВЯЗИ</text><text x="400" y="355" textAnchor="middle">ИСТОРИЯ</text></g>
    <g className="cover-accent"><circle cx="400" cy="128" r="5" /><circle cx="400" cy="330" r="5" /></g>
  </>
}

function CatalogDrawing() {
  return <>
    <g className="cover-faint"><path d="M114 83H668M114 366H668M124 75V378M508 75V378" /><path d="M143 103h365v249H143z" /></g>
    <g className="cover-structure"><rect x="130" y="90" width="365" height="249" rx="6" /><path d="M130 119h365" /><circle cx="146" cy="105" r="2" /><circle cx="156" cy="105" r="2" /><circle cx="166" cy="105" r="2" /><path d="M359 104h112M151 144h114M151 156h77" /><rect x="150" y="188" width="153" height="60" rx="3" /><rect x="319" y="188" width="153" height="60" rx="3" /><rect x="150" y="261" width="153" height="60" rx="3" /><rect x="319" y="261" width="153" height="60" rx="3" /></g>
    <g className="cover-accent"><circle cx="440" cy="152" r="19" /><path d="M440 133a19 19 0 0 1 19 19" strokeWidth="5" /><path d="M314 165v-16m15 16v-30m15 30v-22m15 22v-38M164 229h118M333 229h118M164 302h118M333 302h118" /><path className="cover-route" d="M495 216h38V135h32M533 216h32M533 216v87h32" strokeDasharray="4 7" /></g>
    <g className="cover-structure"><rect x="565" y="111" width="126" height="48" rx="5" /><rect x="565" y="192" width="126" height="48" rx="5" /><rect x="565" y="279" width="126" height="48" rx="5" /></g>
    <g className="cover-label"><text x="166" y="214">01</text><text x="335" y="214">02</text><text x="166" y="287">03</text><text x="335" y="287">04</text><text x="628" y="141" textAnchor="middle">ДАННЫЕ</text><text x="628" y="222" textAnchor="middle">ПРОВЕРКА</text><text x="628" y="309" textAnchor="middle">ПУБЛИКАЦИЯ</text><text x="310" y="381" textAnchor="middle">ПРОЕКТЫ · ПОКАЗАТЕЛИ · ИСТОРИЯ</text></g>
  </>
}

function GenericDrawing() {
  return <g className="cover-structure"><rect x="250" y="130" width="300" height="190" rx="8" /><path d="M280 170h180M280 204h240M280 238h160M280 272h205" /></g>
}

export function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  const id = useId().replace(/:/g, '')
  const cover = covers[project.id] ?? { label: 'Схема проекта', description: 'Условная схема состава проекта.', kind: 'generic' }
  const architectural = cover.kind === 'cafe' || cover.kind === 'rooms'
  return <div className={`project-cover ${large ? 'cover-large' : ''}`} style={{ '--cover-accent': project.accent } as CSSProperties}>
    <svg viewBox="0 0 800 450" width="800" height="450" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{cover.label}: {project.title}</title><desc id={`${id}-desc`}>{cover.description}</desc>
      <defs><pattern id={`${id}-grid`} width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="currentColor" strokeWidth=".5" /></pattern></defs>
      <rect className="cover-grid" width="800" height="450" fill={`url(#${id}-grid)`} />
      <g className="cover-registration"><path d="M28 54V28h26M746 28h26v26M28 396v26h26M746 422h26v-26" /></g>
      <g className="cover-label cover-sheet"><text x="54" y="48">{project.id.replace('PRJ-', 'ЛИСТ ')}</text><text x="746" y="48" textAnchor="end">{architectural ? 'ПРОСТРАНСТВО' : 'СИСТЕМА'}</text></g>
      <g className="cover-drawing">
        {cover.kind === 'cafe' ? <CafeDrawing /> : cover.kind === 'rooms' ? <RoomsDrawing /> : cover.kind === 'memory' ? <MemoryDrawing /> : cover.kind === 'catalog' ? <CatalogDrawing /> : <GenericDrawing />}
      </g>
      <g className="cover-label cover-sheet"><text x="54" y="421">{architectural ? 'УСЛОВНАЯ КОМПОЗИЦИЯ' : 'СХЕМА УСТРОЙСТВА'}</text><text x="746" y="421" textAnchor="end">{architectural ? 'БЕЗ МАСШТАБА' : 'СВЯЗИ И ПРОЦЕССЫ'}</text></g>
    </svg>
    <div className="cover-caption"><span>{cover.label}</span><span>{architectural ? 'Не рабочий чертёж' : 'Векторная схема'}</span></div>
  </div>
}
