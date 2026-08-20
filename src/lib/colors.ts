import type { Theme } from './theme'

export interface ColorSet {
  bg: string
  bgDeep: string
  text: string
  dim: string
  accent: string
  accent2: string
  violet: string
  cyan: string
  /** RGB tuples for three.js materials */
  accentRGB: [number, number, number]
  accent2RGB: [number, number, number]
  violetRGB: [number, number, number]
  cyanRGB: [number, number, number]
  textRGB: [number, number, number]
  dimRGB: [number, number, number]
}

const DARK: ColorSet = {
  bg: '#04070f',
  bgDeep: '#02040a',
  text: '#eef2f7',
  dim: '#94a3b8',
  accent: '#38bdf8',
  accent2: '#818cf8',
  violet: '#a78bfa',
  cyan: '#22d3ee',
  accentRGB: [0.22, 0.74, 0.97],
  accent2RGB: [0.51, 0.55, 0.97],
  violetRGB: [0.65, 0.55, 0.98],
  cyanRGB: [0.13, 0.83, 0.93],
  textRGB: [0.93, 0.95, 0.97],
  dimRGB: [0.58, 0.64, 0.72],
}

const LIGHT: ColorSet = {
  bg: '#f4f6fb',
  bgDeep: '#ffffff',
  text: '#0b1220',
  dim: '#46536b',
  accent: '#0284c7',
  accent2: '#4f46e5',
  violet: '#7c3aed',
  cyan: '#0891b2',
  accentRGB: [0.01, 0.52, 0.78],
  accent2RGB: [0.31, 0.27, 0.9],
  violetRGB: [0.49, 0.23, 0.93],
  cyanRGB: [0.03, 0.57, 0.7],
  textRGB: [0.04, 0.07, 0.13],
  dimRGB: [0.27, 0.33, 0.42],
}

export function getColorSet(theme: Theme): ColorSet {
  return theme === 'dark' ? DARK : LIGHT
}

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Ease a value towards a target with exponential smoothing (framerate independent-ish). */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}