export interface SectionEntry {
  id: string
  start: number
  end: number
  progress: number
}

export interface ScrollSnapshot {
  /** 0..1 across the whole page */
  global: number
  /** index of the active section */
  index: number
  sections: SectionEntry[]
  /** velocity of the last scroll frame */
  velocity: number
}

const snapshot: ScrollSnapshot = {
  global: 0,
  index: 0,
  sections: [],
  velocity: 0,
}

type Listener = (s: ScrollSnapshot) => void

const listeners = new Set<Listener>()
let lastY = 0
let lastT = performance.now()

const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'certifications',
  'contact',
]

function computeSections(): SectionEntry[] {
  if (typeof document === 'undefined') return []
  const body = document.body
  const docEl = document.documentElement
  const scrollHeight = Math.max(body.scrollHeight, docEl.scrollHeight, body.offsetHeight)
  const winH = window.innerHeight || docEl.clientHeight

  const sections: SectionEntry[] = []
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const height = Math.max(el.offsetHeight || winH, winH * 0.75)
    sections.push({
      id,
      start: top,
      end: Math.min(top + height, scrollHeight),
      progress: clamp01((window.scrollY + winH / 2 - top) / height),
    })
  }
  return sections
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

export function refreshScrollState() {
  if (typeof window === 'undefined') return
  const body = document.body
  const docEl = document.documentElement
  const scrollHeight = Math.max(body.scrollHeight, docEl.scrollHeight, body.offsetHeight)
  const winH = window.innerHeight || docEl.clientHeight
  const maxScroll = Math.max(0, scrollHeight - winH)
  const y = window.scrollY
  const now = performance.now()
  const dt = Math.max(1, now - lastT)
  const velocity = (y - lastY) / dt
  lastY = y
  lastT = now

  snapshot.global = maxScroll > 0 ? clamp01(y / maxScroll) : 0
  snapshot.velocity = velocity
  snapshot.sections = computeSections()

  let bestIndex = 0
  let bestScore = Infinity
  const winHCenter = winH / 2
  for (let i = 0; i < snapshot.sections.length; i++) {
    const s = snapshot.sections[i]
    const center = (s.start + s.end) / 2
    const dist = Math.abs(y + winHCenter - center)
    if (dist < bestScore) {
      bestScore = dist
      bestIndex = i
    }
  }
  snapshot.index = bestIndex

  listeners.forEach((l) => l(snapshot))
}

export function onScrollState(cb: Listener): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function getScrollSnapshot(): ScrollSnapshot {
  return snapshot
}

/** Smooth-scroll to a section id using Lenis if available, else native. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | number, o?: object) => void } }).__lenis
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.6 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}