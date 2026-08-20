export const EASE = [0.65, 0, 0.35, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: EASE },
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 1, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  }),
}

export const stagger = {
  hidden: {},
  visible: (staggerMs = 0.08) => ({
    transition: { staggerChildren: staggerMs },
  }),
}

export const lineReveal = {
  hidden: { opacity: 0, y: '110%' },
  visible: (i = 0) => ({
    opacity: 1,
    y: '0%',
    transition: { duration: 0.85, delay: i * 0.1, ease: EASE },
  }),
}