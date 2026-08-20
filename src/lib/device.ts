import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

export function useIsTouch(): boolean {
  const [touch, setTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
  })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const handler = () => setTouch(mq.matches || 'ontouchstart' in window)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return touch
}

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const attrs: WebGLContextAttributes = { failIfMajorPerformanceCaveat: false }
    const gl =
      canvas.getContext('webgl2', attrs) ||
      canvas.getContext('webgl', attrs) ||
      canvas.getContext('experimental-webgl', attrs)
    return !!gl
  } catch {
    return false
  }
}

export function useWebGL(): boolean {
  const [ok] = useState<boolean>(() => isWebGLAvailable())
  return ok
}

/** Quality tier for dynamic performance scaling. */
export function useQualityTier(): 'high' | 'medium' | 'low' {
  const [tier] = useState<'high' | 'medium' | 'low'>(() => {
    if (typeof window === 'undefined') return 'medium'
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory
    const cores = (navigator as unknown as { hardwareConcurrency?: number }).hardwareConcurrency
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const lowPower = (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType
    if (lowPower === 'slow-2g' || lowPower === '2g' || memory === 2 || (cores && cores <= 4)) return 'low'
    if (coarse || memory === 4 || (cores && cores <= 8)) return 'medium'
    return 'high'
  })
  return tier
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsTouchDevice(): boolean {
  return useMediaQuery('(hover: none), (pointer: coarse)')
}