import { type ReactNode, type MouseEvent, useRef, useState } from 'react'
import { useIsTouchDevice, usePrefersReducedMotion } from '@/lib/device'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  glare?: boolean
}

export function TiltCard({ children, className, maxTilt = 8, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const touch = useIsTouchDevice()
  const reduced = usePrefersReducedMotion()

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el || touch || reduced) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * maxTilt
    const ry = (px - 0.5) * maxTilt
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`
    setGlarePos({ x: px * 100, y: py * 100 })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)'
    setGlarePos({ x: 50, y: 50 })
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)', transformStyle: 'preserve-3d', willChange: 'transform' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at ${glarePos.x}% ${glarePos.y}%, rgba(148,197,255,0.14), transparent 55%)`,
          }}
        />
      )}
    </div>
  )
}