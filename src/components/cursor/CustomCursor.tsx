import { useEffect, useRef, useState } from 'react'
import { useIsTouchDevice } from '@/lib/device'

type CursorMode = 'default' | 'link' | 'view' | 'button'

export function CustomCursor() {
  const touch = useIsTouchDevice()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<CursorMode>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (touch) return
    document.body.classList.add('custom-cursor')

    const target = { x: -100, y: -100 }
    const dot = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      setVisible(true)
    }
    const onDown = () => {
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%) scale(0.8)`
    }
    const onUp = () => {
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%) scale(1)`
    }
    const onLeave = () => setVisible(false)

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      if (t.closest('[data-cursor="view"]')) setMode('view')
      else if (t.closest('a, button, [role="button"], [data-cursor="link"]')) setMode('link')
      else setMode('default')
    }

    let raf = 0
    const loop = () => {
      dot.x += (target.x - dot.x) * 0.5
      dot.y += (target.y - dot.y) * 0.5
      ring.x += (target.x - ring.x) * 0.16
      ring.y += (target.y - ring.y) * 0.16
      if (dotRef.current) dotRef.current.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%) scale(${mode === 'link' || mode === 'view' || mode === 'button' ? 1.8 : 1})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      document.body.classList.remove('custom-cursor')
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [touch, mode])

  if (touch) return null

  return (
    <div className={`pointer-events-none fixed inset-0 z-[200] ${visible ? '' : 'opacity-0'}`} aria-hidden>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent"
        style={{ boxShadow: '0 0 10px var(--glow)' }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-accent/60 transition-transform duration-200"
        style={{ boxShadow: '0 0 18px var(--glow)' }}
      >
        {(mode === 'view' || mode === 'link') && (
          <span className="font-mono text-[9px] font-semibold tracking-widest text-accent">
            {mode === 'view' ? 'VIEW' : 'OPEN'}
          </span>
        )}
      </div>
    </div>
  )
}