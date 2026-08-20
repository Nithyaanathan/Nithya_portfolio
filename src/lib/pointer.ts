export interface PointerState {
  x: number
  y: number
  /** normalized -1..1 */
  nx: number
  ny: number
  active: boolean
}

export const pointerState: PointerState = { x: 0, y: 0, nx: 0, ny: 0, active: false }

let initialized = false

export function initPointerTracking() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  window.addEventListener('pointermove', (e) => {
    pointerState.x = e.clientX
    pointerState.y = e.clientY
    pointerState.nx = (e.clientX / window.innerWidth) * 2 - 1
    pointerState.ny = -((e.clientY / window.innerHeight) * 2 - 1)
    pointerState.active = true
  })
  window.addEventListener('pointerleave', () => {
    pointerState.active = false
  })
}

/** Shared camera shake / offset for parallax — never exposes raw pointer. */
export function getPointerOffset(amount: number) {
  return {
    x: pointerState.nx * amount,
    y: pointerState.ny * amount,
  }
}