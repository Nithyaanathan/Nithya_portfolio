import { useRef, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { site } from '@/data/site'
import { useIsTouchDevice, usePrefersReducedMotion } from '@/lib/device'

const KEYWORDS = ['AI', 'DATA', 'MACHINE LEARNING', 'PYTHON', 'SOFTWARE', 'CREATIVE', 'DESIGN', 'WEB']

const positions = [
  { top: '-4%', left: '-6%' },
  { top: '6%', right: '-10%' },
  { top: '38%', left: '-12%' },
  { top: '44%', right: '-14%' },
  { bottom: '-4%', left: '10%' },
  { bottom: '8%', right: '-4%' },
  { top: '70%', left: '-8%' },
  { top: '-8%', right: '18%' },
]

export function IdentityHologram() {
  const frameRef = useRef<HTMLDivElement>(null)
  const touch = useIsTouchDevice()
  const reduced = usePrefersReducedMotion()

  const onMove = (e: MouseEvent) => {
    if (touch || reduced || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const photo = frameRef.current.querySelector('[data-layer="photo"]') as HTMLElement
    const ring = frameRef.current.querySelector('[data-layer="ring"]') as HTMLElement
    if (photo) photo.style.transform = `translate3d(${px * -14}px, ${py * -10}px, 0) scale(1.04)`
    if (ring) ring.style.transform = `translate3d(${px * 10}px, ${py * 8}px, 0)`
  }

  const onLeave = () => {
    if (!frameRef.current) return
    const photo = frameRef.current.querySelector('[data-layer="photo"]') as HTMLElement
    const ring = frameRef.current.querySelector('[data-layer="ring"]') as HTMLElement
    if (photo) photo.style.transform = 'translate3d(0,0,0) scale(1.04)'
    if (ring) ring.style.transform = 'translate3d(0,0,0)'
  }

  return (
    <div
      ref={frameRef}
      className="relative mx-auto aspect-[4/5] w-full max-w-[360px] select-none"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* backdrop glow */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[2rem] opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(60% 50% at 50% 40%, var(--glow), transparent 70%)' }}
      />

      {/* orbiting ring */}
      <div
        data-layer="ring"
        aria-hidden
        className="absolute -inset-4 rounded-[2.4rem] border border-accent/20 transition-transform duration-500"
        style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div className="absolute inset-0 animate-spin-slow rounded-[2.4rem]" style={{ background: 'repeating-linear-gradient(90deg, transparent 0 26px, var(--line) 26px 27px)' }} />
      </div>

      {/* holo frame */}
      <div className="holo-edge scanlines corner-frame relative h-full w-full overflow-hidden rounded-[2rem]">
        <div data-layer="photo" className="absolute inset-0 transition-transform duration-500" style={{ transform: 'scale(1.04)' }}>
          <img
            src={site.profileImage}
            alt="Portrait of Nithyaanathan"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-bg/20" />
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'radial-gradient(120% 90% at 50% 0%, transparent 40%, var(--bg-deep) 100%)' }} />
        </div>

        {/* scanline sweep */}
        <motion.div
          aria-hidden
          className="absolute left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--accent) 50%, transparent)', opacity: 0.12 }}
          animate={reduced ? undefined : { top: ['-20%', '120%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* data overlay */}
        <div className="pointer-events-none absolute inset-0 p-4">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[9px] tracking-[0.25em] text-accent/80">ID_ENT // NITHYAANATHAN</span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-faint">v1.0</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-display text-sm font-medium text-ink">Nithyaanathan V</p>
            <p className="font-mono text-[9px] tracking-[0.2em] text-dim">AI &amp; ML ENGINEER</p>
            <div className="mt-2 h-px w-full" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
          </div>
        </div>
      </div>

      {/* floating keywords */}
      {KEYWORDS.map((kw, i) => (
        <motion.span
          key={kw}
          className="absolute z-10 font-mono text-[10px] tracking-[0.2em] text-accent/80"
          style={{ ...(positions[i] as React.CSSProperties) }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.08 }}
        >
          <motion.span
            className="inline-block rounded-full border border-accent/25 bg-panel px-2.5 py-1 backdrop-blur-sm"
            animate={reduced ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            {kw}
          </motion.span>
        </motion.span>
      ))}
    </div>
  )
}