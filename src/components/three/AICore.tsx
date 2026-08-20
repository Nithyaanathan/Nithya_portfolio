import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ColorSet } from '@/lib/colors'
import { pointerState, getPointerOffset } from '@/lib/pointer'
import { damp } from '@/lib/colors'

interface AICoreProps {
  colors: ColorSet
  position?: [number, number, number]
  scale?: number
  reduced: boolean
  intensity?: number
}

export function AICore({ colors, position = [0, 0, 0], scale = 1, reduced, intensity = 1 }: AICoreProps) {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const orbitRef = useRef<THREE.Points>(null)

  const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(1.55, 1), [])
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 32, 32), [])
  const ringGeo = useMemo(() => new THREE.TorusGeometry(2.3, 0.012, 8, 96), [])
  const ringGeo2 = useMemo(() => new THREE.TorusGeometry(2.85, 0.008, 8, 96), [])

  const surfacePoints = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.57, 1)
    const pos = geo.attributes.position
    const arr = new Float32Array(pos.count * 3)
    arr.set(pos.array as Float32Array)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])

  const orbitPoints = useMemo(() => {
    const count = 90
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      arr[i * 3] = Math.cos(a) * 3.3
      arr[i * 3 + 1] = Math.sin(a) * 3.3
      arr[i * 3 + 2] = 0
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])

  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(...colors.accentRGB),
        wireframe: true,
        transparent: true,
        opacity: 0.16 * intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colors, intensity],
  )

  const coreMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(...colors.accentRGB),
        transparent: true,
        opacity: 0.22 * intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colors, intensity],
  )

  const pointMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(...colors.cyanRGB),
        size: 0.05,
        transparent: true,
        opacity: 0.9 * intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [colors, intensity],
  )

  const orbitMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(...colors.accent2RGB),
        size: 0.05,
        transparent: true,
        opacity: 0.7 * intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [colors, intensity],
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const g = groupRef.current
    if (!g) return

    const px = pointerState.active ? pointerState.nx : 0
    const py = pointerState.active ? pointerState.ny : 0
    const targetX = reduced ? 0 : px * 0.35
    const targetY = reduced ? 0 : py * 0.28

    g.rotation.x = damp(g.rotation.x, targetY, 2.5, dt)
    g.rotation.y = damp(g.rotation.y, targetX, 2.5, dt) + (reduced ? 0 : t * 0.05)
    g.rotation.z = reduced ? 0 : Math.sin(t * 0.2) * 0.05

    if (innerRef.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.045
      innerRef.current.scale.setScalar(pulse)
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.16
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.12
      ring2Ref.current.rotation.x = 0.55
    }
    if (pointsRef.current) pointsRef.current.rotation.y = -t * 0.12
    if (orbitRef.current) {
      orbitRef.current.rotation.z = t * 0.35
      orbitRef.current.rotation.x = reduced ? 0 : Math.sin(t * 0.3) * 0.12
    }

    if (!reduced) {
      const off = getPointerOffset(0.18)
      g.position.x = position[0] + off.x
      g.position.y = position[1] + off.y
    } else {
      g.position.x = position[0]
      g.position.y = position[1]
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh geometry={sphereGeo} material={coreMat} ref={innerRef} />
      <mesh geometry={icoGeo} material={wireMat} />
      <points geometry={surfacePoints} material={pointMat} ref={pointsRef} />
      <mesh geometry={ringGeo} material={wireMat} ref={ring1Ref} />
      <mesh geometry={ringGeo2} material={wireMat} ref={ring2Ref} />
      <points geometry={orbitPoints} material={orbitMat} ref={orbitRef} />
    </group>
  )
}