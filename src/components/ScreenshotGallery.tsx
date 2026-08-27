import { useEffect, useRef, useState } from 'react'
import { Expand, X } from 'lucide-react'
import type { Project } from '../types/project'
import { formatProjectDate } from '../lib/metrics'

export function ScreenshotGallery({ project }: { project: Project }) {
  const [selected, setSelected] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (selected === null) return
    dialog.current?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [selected])
  if (!project.screenshots?.length) return null
  return <>
    <div className="screenshot-grid">{project.screenshots.map((shot, index) => <figure key={shot.src}>
      <button type="button" className="screenshot-open" onClick={() => setSelected(index)} aria-label={`Увеличить снимок: ${project.title}`}>
        <img src={import.meta.env.BASE_URL + shot.src} alt={shot.alt} width="1440" height="1000" loading="lazy" />
        <span><Expand size={16} aria-hidden="true" /> Увеличить снимок</span>
      </button>
      <figcaption>{shot.caption} <time dateTime={shot.capturedAt}>{formatProjectDate(shot.capturedAt)}</time></figcaption>
    </figure>)}</div>
    <dialog ref={dialog} className="screenshot-dialog" aria-label={`Снимок страницы: ${project.title}`}
      onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <button type="button" className="dialog-close" aria-label="Закрыть снимок" onClick={() => dialog.current?.close()}><X aria-hidden="true" /> Закрыть</button>
      {selected !== null && <img src={import.meta.env.BASE_URL + project.screenshots[selected].src} alt={project.screenshots[selected].alt} width="1440" height="1000" />}
    </dialog>
  </>
}
