import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CircleHelp } from 'lucide-react'

export function Hint({ label, children }: { label: string; children: string }) {
  const id = useId()
  const button = useRef<HTMLButtonElement>(null)
  const tooltip = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [position, setPosition] = useState({ left: 12, top: 12 })
  const clear = () => clearTimeout(timer.current)
  const show = () => { clear(); setOpen(true) }
  const close = () => { clear(); setOpen(false); setPinned(false) }
  const leave = () => { if (!pinned && document.activeElement !== button.current) timer.current = setTimeout(() => setOpen(false), 160) }

  useLayoutEffect(() => {
    if (!open || !button.current || !tooltip.current) return
    const rect = button.current.getBoundingClientRect()
    const box = tooltip.current.getBoundingClientRect()
    setPosition({
      left: Math.max(12, Math.min(rect.left, window.innerWidth - box.width - 12)),
      top: Math.max(12, rect.bottom + box.height + 16 > window.innerHeight ? rect.top - box.height - 8 : rect.bottom + 8),
    })
  }, [open])
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!button.current?.contains(event.target as Node) && !tooltip.current?.contains(event.target as Node)) close()
    }
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', key)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', key)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
      clear()
    }
  }, [open])
  return <span className="hint">
    <button ref={button} type="button" className="hint-button" aria-label={`Пояснение: ${label}`}
      aria-expanded={open} aria-describedby={open ? id : undefined}
      onMouseEnter={show} onMouseLeave={leave} onFocus={show}
      onBlur={close} onClick={() => { if (pinned) close(); else { show(); setPinned(true) } }}>
      <CircleHelp size={16} aria-hidden="true" />
    </button>
    {open && createPortal(<div ref={tooltip} id={id} role="tooltip" className="hint-content"
      style={position} onMouseEnter={show} onMouseLeave={leave}>{children}</div>, document.body)}
  </span>
}
