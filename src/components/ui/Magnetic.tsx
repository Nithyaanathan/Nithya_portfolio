import { useRef, type ReactNode, type CSSProperties } from 'react'
import { useIsTouchDevice, usePrefersReducedMotion } from '@/lib/device'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
  style?: CSSProperties
}

export function Magnetic({ children, strength = 0.3, className, style }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const touch = useIsTouchDevice()
  const reduced = usePrefersReducedMotion()

  const onMove = (e: React.MouseEvent) => {
    if (touch || reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)', willChange: 'transform', ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  )
}