import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { ColorSet } from '@/lib/colors'
import { damp } from '@/lib/colors'
import { projects } from '@/data/projects'
import { useIsTouchDevice } from '@/lib/device'

interface ProjectOrbsProps {
  colors: ColorSet
  reduced: boolean
  activeIndex: number
  hoveredIndex: number | null
  onHover: (index: number | null) => void
  onSelect: (index: number) => void
}

type PointerRef = { current: { x: number; y: number; active: boolean } }

const ORB_HOME = projects.map((_, i) => {
  const theta = -0.85 + i * 0.425
  return new THREE.Vector3(Math.sin(theta) * 4.6, Math.sin(i * 1.9) * 0.55, 0)
})

const ACTIVE_POS = new THREE.Vector3(0, 0.2, 1.9)

interface OrbMeshProps {
  index: number
  active: boolean
  hovered: boolean
  reduced: boolean
  intensity: number
  onSelect: (i: number) => void
  register: (m: THREE.Group | null, i: number) => void
}

function OrbMesh({ index, active, hovered, reduced, intensity, onSelect, register }: OrbMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)

  const project = projects[index]
  const color = useMemo(() => {
    const c = new THREE.Color(project.accent)
    return c
  }, [project.accent])

  const geo = useMemo(() => new THREE.SphereGeometry(1, 40, 40), [])
  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(1.22, 1), [])
  const ringGeo = useMemo(() => new THREE.TorusGeometry(1.5, 0.012, 6, 80), [])
  const ring2Geo = useMemo(() => new THREE.TorusGeometry(1.85, 0.008, 6, 80), [])

  const bodyMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.32 * intensity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, intensity],
  )
  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.16 * intensity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, intensity],
  )

  const orbitPoints = useMemo(() => {
    const count = 70
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      arr[i * 3] = Math.cos(a) * 2.05
      arr[i * 3 + 1] = Math.sin(a) * 2.05
      arr[i * 3 + 2] = 0
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])

  const pointsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color,
        size: 0.06,
        transparent: true,
        opacity: 0.7 * intensity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [color, intensity],
  )

  useFrame((state, dt) => {
    const g = groupRef.current
    if (!g) return
    const t = state.clock.elapsedTime
    const targetScale = active ? 1.45 : hovered ? 1.08 : 0.8
    g.scale.setScalar(damp(g.scale.x, targetScale, 5, dt))

    const targetX = active ? ACTIVE_POS.x : ORB_HOME[index].x
    const targetY = active ? ACTIVE_POS.y : ORB_HOME[index].y
    const targetZ = active ? ACTIVE_POS.z : ORB_HOME[index].z
    g.position.x = damp(g.position.x, targetX, 4, dt)
    g.position.y = damp(g.position.y, targetY, 4, dt)
    g.position.z = damp(g.position.z, targetZ, 4, dt)

    const spin = reduced ? 0.05 : active ? 0.35 : 0.16
    g.rotation.y += spin * dt
    g.rotation.x = active ? Math.sin(t * 0.4) * 0.08 : 0

    if (ringRef.current) ringRef.current.rotation.z = t * 0.4
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.3
    if (pointsRef.current) {
      pointsRef.current.rotation.z = t * 0.6
      pointsRef.current.rotation.x = reduced ? 0 : Math.sin(t * 0.3 + index) * 0.2
    }
  })

  const showLabel = active || hovered

  return (
    <group
      ref={(m) => register(m, index)}
      position={ORB_HOME[index]}
      scale={0.8}
      onPointerDown={(e) => {
        e.stopPropagation()
        onSelect(index)
      }}
    >
      <mesh geometry={geo} material={bodyMat} />
      <mesh geometry={wireGeo} material={wireMat} />
      <mesh geometry={ringGeo} material={wireMat} ref={ringRef} />
      <mesh geometry={ring2Geo} material={wireMat} ref={ring2Ref} />
      <points geometry={orbitPoints} material={pointsMat} ref={pointsRef} />

      {showLabel && (
        <Html
          position={[0, 2.1, 0]}
          center
          distanceFactor={9}
          style={{ pointerEvents: 'none', transition: 'opacity 0.3s' }}
          zIndexRange={[20, 0]}
        >
          <div className="flex flex-col items-center gap-1 whitespace-nowrap text-center">
            <span className="font-display text-sm font-semibold tracking-wide text-ink drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              {project.title}
            </span>
            <span className="hud-label">{project.category}</span>
            {active && <span className="hud-label text-accent">NODE ACTIVE — CLICK TO OPEN</span>}
          </div>
        </Html>
      )}
    </group>
  )
}

function OrbScene({
  colors,
  reduced,
  activeIndex,
  hoveredIndex,
  onHover,
  onSelect,
  pointerRef,
}: ProjectOrbsProps & { pointerRef: PointerRef }) {
  const groupRefs = useRef<(THREE.Group | null)[]>([])
  const { camera, size } = useThree()
  const touch = useIsTouchDevice()

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    void t
    const p = pointerRef.current
    let bestIndex: number | null = null
    let bestDist = Infinity
    const threshold = Math.max(20, Math.min(size.width, size.height) * 0.04)

    if (p.active) {
      const v = new THREE.Vector3()
      projects.forEach((_, i) => {
        const g = groupRefs.current[i]
        if (!g) return
        v.setFromMatrixPosition(g.matrixWorld)
        v.project(camera)
        if (v.z > 1 || v.z < -1) return
        const sx = (v.x * 0.5 + 0.5) * size.width
        const sy = (-v.y * 0.5 + 0.5) * size.height
        const d = Math.hypot(sx - p.x, sy - p.y)
        if (d < threshold && d < bestDist) {
          bestDist = d
          bestIndex = i
        }
      })
    }

    // only report hover changes when not touching
    if (!touch && bestIndex !== hoveredIndex) {
      onHover(bestIndex)
    }
    void dt
  })

  return (
    <group>
      {projects.map((project, i) => (
        <OrbMesh
          key={project.id}
          index={i}
          active={activeIndex === i}
          hovered={hoveredIndex === i && activeIndex !== i}
          reduced={reduced}
          intensity={colors.accent === '#38bdf8' ? 1 : 0.65}
          onSelect={onSelect}
          register={(m, idx) => {
            groupRefs.current[idx] = m
          }}
        />
      ))}
    </group>
  )
}

export function ProjectOrbs(props: ProjectOrbsProps) {
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  return (
    <div
      className="relative h-[440px] w-full touch-none select-none sm:h-[560px]"
      style={{ pointerEvents: 'auto' }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        pointerRef.current.x = e.clientX - rect.left
        pointerRef.current.y = e.clientY - rect.top
        pointerRef.current.active = true
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false
        props.onHover(null)
      }}
      onPointerDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        pointerRef.current.x = e.clientX - rect.left
        pointerRef.current.y = e.clientY - rect.top
        pointerRef.current.active = true
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={props.reduced ? 1 : [1, 1.75]}
        camera={{ position: [0, 0, 8.2], fov: 46 }}
        style={{ background: 'transparent' }}
      >
        <OrbScene
          colors={props.colors}
          reduced={props.reduced}
          activeIndex={props.activeIndex}
          hoveredIndex={props.hoveredIndex}
          onHover={props.onHover}
          onSelect={props.onSelect}
          pointerRef={pointerRef}
        />
      </Canvas>
    </div>
  )
}