import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { animate, motion, MotionConfig, useInView, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { PreferenceContext, useAnimation } from './animation-context'

function formatCounter(value: number, suffix: string, padded: boolean) {
  return `${padded ? String(value).padStart(2, '0') : new Intl.NumberFormat('ru-RU').format(value)}${suffix}`
}

export function AnimationProvider({ children }: { children: ReactNode }) {
  const systemReduced = Boolean(useReducedMotion())
  const location = useLocation()
  const capture = new URLSearchParams(location.search).has('capture')
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem('catalog-motion-paused') === 'true' } catch { return false }
  })
  const animated = !paused && !systemReduced && !capture
  function toggle() {
    setPaused(previous => {
      try { localStorage.setItem('catalog-motion-paused', String(!previous)) } catch { /* Настройка работает и без хранилища. */ }
      return !previous
    })
  }
  return <PreferenceContext.Provider value={{ animated, paused, systemReduced, toggle }}>
    <MotionConfig reducedMotion={animated ? 'never' : 'always'}>{children}</MotionConfig>
  </PreferenceContext.Provider>
}

export function MotionSection({ children, ...props }: HTMLMotionProps<'section'>) {
  const { animated } = useAnimation()
  return <motion.section {...props} data-motion-section
    initial={animated ? { opacity: 0, y: 28 } : false}
    animate={animated ? undefined : { opacity: 1, y: 0 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: animated ? 0.6 : 0, ease: [0.2, 0.7, 0.2, 1] }}>
    {children}
  </motion.section>
}

export function AnimatedNumber({ value, suffix = '', padded = false }: { value: number; suffix?: string; padded?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true })
  const { animated } = useAnimation()
  const finalText = formatCounter(value, suffix, padded)
  useEffect(() => {
    if (!ref.current) return
    if (!animated || !visible) { ref.current.textContent = finalText; return }
    const controls = animate(0, value, {
      duration: 0.9, ease: 'easeOut',
      onUpdate: number => { if (ref.current) ref.current.textContent = formatCounter(Math.round(number), suffix, padded) },
    })
    return () => controls.stop()
  }, [value, suffix, padded, visible, animated, finalText])
  return <span><span className="sr-only">{finalText}</span><span ref={ref} aria-hidden="true">{finalText}</span></span>
}

export function ProgressRing({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true })
  const { animated } = useAnimation()
  return <div ref={ref} className="progress-ring" role="progressbar" aria-label="Выполнение выбранного плана" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" strokeWidth="6" />
      <motion.circle cx="60" cy="60" r="52" fill="none" stroke="var(--project-accent)" strokeWidth="6" strokeLinecap="round"
        pathLength="1" strokeDasharray="1" transform="rotate(-90 60 60)"
        initial={false} animate={{ strokeDashoffset: !animated || visible ? 1 - value / 100 : 1 }}
        transition={{ duration: animated ? 1.1 : 0, ease: 'easeOut' }} />
    </svg>
    <strong><AnimatedNumber value={value} suffix="%" /></strong><span>плана выполнено</span>
  </div>
}
