import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/device'

interface LoaderProps {
  onComplete: () => void
}

const STAGES = [
  { text: 'INITIALIZING…', dur: 900 },
  { text: 'NEURAL SYSTEM ONLINE', dur: 900 },
  { text: 'NITHYAANATHAN // AI & ML ENGINEER', dur: 1200 },
]

export function Loader({ onComplete }: LoaderProps) {
  const reduced = usePrefersReducedMotion()
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const particles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: `${(i % 8) * 0.12}s`,
        size: 1 + ((i * 7) % 3),
      })),
    [],
  )

  useEffect(() => {
    if (reduced) {
      setProgress(100)
      const t = setTimeout(() => setDone(true), 250)
      return () => clearTimeout(t)
    }
    const stageTimers: number[] = []
    const total = STAGES.reduce((a, s) => a + s.dur, 0)
    let acc = 0
    STAGES.forEach((s, i) => {
      stageTimers.push(
        window.setTimeout(() => {
          setStage(i)
        }, acc),
      )
      acc += s.dur
    })
    stageTimers.push(window.setTimeout(() => setDone(true), total + 400))

    const start = performance.now()
    const tick = () => {
      const p = Math.min(100, ((performance.now() - start) / total) * 100)
      setProgress(p)
      if (p < 100) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => stageTimers.forEach(clearTimeout)
  }, [reduced])

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 550)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-deep"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          aria-label="Loading portfolio"
        >
          <div className="pointer-events-none absolute inset-0">
            {particles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-accent/70"
                style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.4], scale: [0, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: parseFloat(p.delay) }}
              />
            ))}
          </div>

          <div className="relative flex h-40 w-40 items-center justify-center">
            <motion.div
              className="absolute h-28 w-28 rounded-full border border-accent/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute h-28 w-28 rounded-full border border-dashed border-accent-2/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="h-10 w-10 rounded-full"
              style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', boxShadow: 'var(--shadow-glow)' }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="mt-10 flex h-6 items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={stage}
                className="font-mono text-xs tracking-[0.35em] text-ink"
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {STAGES[stage].text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-6 h-px w-56 overflow-hidden bg-line">
            <motion.div
              className="h-full bg-accent"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <button
            type="button"
            onClick={() => setDone(true)}
            className="mt-8 font-mono text-[10px] tracking-[0.3em] text-faint transition-colors hover:text-accent"
          >
            SKIP INTRO →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}