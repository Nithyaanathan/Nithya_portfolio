import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ColorSet } from '@/lib/colors'
import { damp, clamp, smoothstep } from '@/lib/colors'
import { getScrollSnapshot } from '@/lib/scroll'
import { pointerState } from '@/lib/pointer'
import { WAYPOINTS } from '@/three/waypoints'
import { StarField } from './StarField'
import { NeuralConstellation } from './NeuralConstellation'
import { AICore } from './AICore'
import { Beacon } from './Beacon'

type Quality = 'high' | 'medium' | 'low'

interface SceneProps {
  colors: ColorSet
  quality: Quality
  reduced: boolean
  /** if WebGL is unavailable the parent renders a 2D fallback instead */
}

function CameraRig({ colors, reduced }: { colors: ColorSet; reduced: boolean }) {
  const { camera } = useThree()

  const pointer = useRef({ x: 0, y: 0 })
  useFrame((_, dt) => {
    const snap = getScrollSnapshot()
    const t = clamp(snap.index + (snap.sections[snap.index]?.progress ?? 0.5) - 0.5, 0, WAYPOINTS.length - 1)
    const base = Math.min(Math.floor(t), WAYPOINTS.length - 2)
    const frac = smoothstep(0, 1, t - base)
    const w0 = WAYPOINTS[base]
    const w1 = WAYPOINTS[base + 1]

    const tx = w0.pos[0] + (w1.pos[0] - w0.pos[0]) * frac
    const ty = w0.pos[1] + (w1.pos[1] - w0.pos[1]) * frac
    const tz = w0.pos[2] + (w1.pos[2] - w0.pos[2]) * frac
    const lx = w0.look[0] + (w1.look[0] - w0.look[0]) * frac
    const ly = w0.look[1] + (w1.look[1] - w0.look[1]) * frac
    const lz = w0.look[2] + (w1.look[2] - w0.look[2]) * frac

    const px = pointerState.active ? pointerState.nx : 0
    const py = pointerState.active ? pointerState.ny : 0
    pointer.current.x = damp(pointer.current.x, px, 3, dt)
    pointer.current.y = damp(pointer.current.y, py, 3, dt)

    const parallax = reduced ? 0 : 0.55
    const cx = tx + pointer.current.x * parallax
    const cy = ty + pointer.current.y * parallax
    const cz = tz

    if (reduced) {
      camera.position.set(cx, cy, cz)
    } else {
      camera.position.x = damp(camera.position.x, cx, 2.4, dt)
      camera.position.y = damp(camera.position.y, cy, 2.4, dt)
      camera.position.z = damp(camera.position.z, cz, 2.4, dt)
    }
    camera.lookAt(lx, ly, lz)
  })
  void colors
  return null
}

/** Hero core sits in the right-hand column (≈72% of screen width at 16:9) and drifts back to centre for the rest of the journey. */
const HERO_CORE_X = 3.2

function HeroCore({ colors, reduced, scale, intensity }: { colors: ColorSet; reduced: boolean; scale: number; intensity: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const target = getScrollSnapshot().index === 0 ? HERO_CORE_X : 0
    g.position.x = damp(g.position.x, target, 2.5, dt)
  })
  return (
    <group ref={ref}>
      <AICore colors={colors} reduced={reduced} scale={scale} intensity={intensity} />
    </group>
  )
}

export function GlobalScene({ colors, quality, reduced }: SceneProps) {
  const starCount = quality === 'high' ? 2400 : quality === 'medium' ? 1300 : 550
  const nodeCount = quality === 'high' ? 210 : quality === 'medium' ? 150 : 80
  const dpr = quality === 'high' ? 1.75 : quality === 'medium' ? 1.25 : 1

  const coreIntensity = useMemo(() => (colors.accent === '#38bdf8' ? 1 : 0.75), [colors])

  return (
    <Canvas
      className="!absolute inset-0"
      gl={{
        antialias: quality !== 'low',
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      dpr={dpr}
      camera={{ position: WAYPOINTS[0].pos, fov: 52, near: 0.1, far: 320 }}
      style={{ background: 'transparent' }}
    >
      <CameraRig colors={colors} reduced={reduced} />
      <StarField colors={colors} count={starCount} reduced={reduced} />
      <NeuralConstellation colors={colors} nodeCount={nodeCount} reduced={reduced} />
      <HeroCore colors={colors} reduced={reduced} scale={coreIntensity} intensity={coreIntensity} />
      <Beacon colors={colors} position={[0, 0, -20]} reduced={reduced} radius={1.7} />
      <Beacon colors={colors} position={[0, 0, -40]} reduced={reduced} radius={2.0} />
      <Beacon colors={colors} position={[0, 0, -60]} reduced={reduced} radius={2.2} />
      <Beacon colors={colors} position={[0, 0, -80]} reduced={reduced} radius={1.8} />
      <Beacon colors={colors} position={[0, 0, -100]} reduced={reduced} radius={1.9} />
      <Beacon colors={colors} position={[0, 0, -120]} reduced={reduced} radius={1.6} />
      <AICore
        colors={colors}
        position={[0, 0, -140]}
        scale={0.55 * coreIntensity}
        reduced={reduced}
        intensity={0.55 * coreIntensity}
      />
    </Canvas>
  )
}

export type { Quality }