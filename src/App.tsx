import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { ThemeProvider, useTheme } from '@/lib/theme'
import { getColorSet } from '@/lib/colors'
import { initPointerTracking } from '@/lib/pointer'
import { refreshScrollState } from '@/lib/scroll'
import { usePrefersReducedMotion, useWebGL, useQualityTier } from '@/lib/device'

import { Loader } from '@/components/loading/Loader'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Hud } from '@/components/layout/Hud'
import { CustomCursor } from '@/components/cursor/CustomCursor'
import { GlobalScene } from '@/components/three/Scene'
import { Starfield2D } from '@/components/three/Starfield2D'
import { Hero } from '@/components/hero/Hero'
import { About } from '@/components/about/About'
import { Skills } from '@/components/skills/Skills'
import { Projects } from '@/components/projects/Projects'
import { Experience } from '@/components/experience/Experience'
import { Education } from '@/components/education/Education'
import { Certifications } from '@/components/certifications/Certifications'
import { Signals } from '@/components/signals/Signals'
import { Resume } from '@/components/resume/Resume'
import { Contact } from '@/components/contact/Contact'

function Background() {
  const { theme } = useTheme()
  const colors = getColorSet(theme)
  const reduced = usePrefersReducedMotion()
  const webgl = useWebGL()
  const quality = useQualityTier()

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 0%, transparent 40%, color-mix(in srgb, var(--bg-deep) 55%, transparent) 100%)' }} />
      {webgl ? (
        <GlobalScene colors={colors} quality={quality} reduced={reduced} />
      ) : (
        <Starfield2D colors={colors} reduced={reduced} />
      )}
    </div>
  )
}

function AppInner() {
  const [loading, setLoading] = useState(true)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    initPointerTracking()
  }, [])

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
    const onScroll = () => refreshScrollState()
    lenis.on('scroll', onScroll)
    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [reduced])

  useEffect(() => {
    const onScroll = () => refreshScrollState()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', refreshScrollState, { passive: true })
    refreshScrollState()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', refreshScrollState)
    }
  }, [])

  return (
    <div className="relative">
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Background />
      <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, var(--bg-deep) 135%)',
            opacity: 0.6,
          }}
        />
      </div>

      <Hud />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <Signals />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <CustomCursor />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}