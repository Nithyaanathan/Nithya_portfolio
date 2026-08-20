import { useEffect, useRef } from 'react'
import type { ColorSet } from '@/lib/colors'

interface Starfield2DProps {
  colors: ColorSet
  reduced: boolean
}

export function Starfield2D({ colors, reduced }: Starfield2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
    }))

    const ring = { angle: 0 }
    const pointer = { x: 0, y: 0 }

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / w) * 2 - 1
      pointer.y = -((e.clientY / h) * 2 - 1)
    }

    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer)

    const hex = (rgb: [number, number, number], alpha: number) =>
      `rgba(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)}, ${alpha})`

    const draw = (time: number) => {
      const t = time / 1000
      ctx.clearRect(0, 0, w, h)

      // stars
      for (const s of stars) {
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase))
        const x = s.x * w
        const y = (s.y * h + t * 2 * s.speed) % (h + 10) - 5
        ctx.globalAlpha = tw * 0.8
        ctx.fillStyle = hex(colors.textRGB, 1)
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // scroll fade for the core
      const scroll = window.scrollY
      const coreFade = Math.max(0, 1 - scroll / (h * 0.85))
      if (coreFade > 0.02) {
        const cx = w * 0.5 + pointer.x * 14
        const cy = h * 0.44 + pointer.y * 10
        const R = Math.min(w, h) * 0.14 * (1 + Math.sin(t * 1.4) * 0.02)

        // rings
        ring.angle += reduced ? 0 : t * 0.0007
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(reduced ? 0.4 : ring.angle)
        ctx.strokeStyle = hex(colors.accentRGB, 0.5 * coreFade)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(0, 0, R * 1.65, R * 0.5, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.rotate(-0.9)
        ctx.strokeStyle = hex(colors.accent2RGB, 0.4 * coreFade)
        ctx.beginPath()
        ctx.ellipse(0, 0, R * 2.05, R * 0.42, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // core glow
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6)
        grad.addColorStop(0, hex(colors.accentRGB, 0.32 * coreFade))
        grad.addColorStop(0.5, hex(colors.accent2RGB, 0.1 * coreFade))
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2)
        ctx.fill()

        // core
        const coreGrad = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, R * 0.1, cx, cy, R)
        coreGrad.addColorStop(0, hex(colors.textRGB, 0.95 * coreFade))
        coreGrad.addColorStop(0.35, hex(colors.accentRGB, 0.85 * coreFade))
        coreGrad.addColorStop(1, hex(colors.accent2RGB, 0.1 * coreFade))
        ctx.fillStyle = coreGrad
        ctx.beginPath()
        ctx.arc(cx, cy, R, 0, Math.PI * 2)
        ctx.fill()

        // wireframe feel: surface dots
        ctx.fillStyle = hex(colors.cyanRGB, 0.9 * coreFade)
        for (let i = 0; i < 26; i++) {
          const a = t * 0.3 + (i / 26) * Math.PI * 2
          const rad = R * 1.02
          ctx.globalAlpha = (0.7 + 0.3 * Math.sin(t * 2 + i)) * coreFade
          ctx.beginPath()
          ctx.arc(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.5, 1.4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      // drifting neural motes
      for (let i = 0; i < 60; i++) {
        const y = ((i * 137.5) % 100) / 100
        const yPos = ((y * h + t * 6) % (h + 20)) - 10
        const xPos = ((i * 89.7) % 100) / 100 * w
        const a = 0.15 + 0.2 * Math.sin(t * 1.2 + i)
        ctx.globalAlpha = a
        ctx.fillStyle = hex(colors.cyanRGB, 1)
        ctx.beginPath()
        ctx.arc(xPos, yPos, 1, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [colors, reduced])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
}