import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ColorSet } from '@/lib/colors'

interface BeaconProps {
  colors: ColorSet
  position: [number, number, number]
  radius?: number
  reduced: boolean
}

export function Beacon({ colors, position, radius = 1.6, reduced }: BeaconProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const ringGeo = useMemo(() => new THREE.TorusGeometry(radius, 0.008, 6, 64), [radius])
  const ringGeo2 = useMemo(() => new THREE.TorusGeometry(radius * 1.45, 0.005, 6, 64), [radius])

  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(...colors.accentRGB),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colors],
  )

  const dotsGeo = useMemo(() => {
    const count = 24
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const r = radius + 0.35
      arr[i * 3] = Math.cos(a) * r
      arr[i * 3 + 1] = Math.sin(a) * r * 0.35
      arr[i * 3 + 2] = Math.sin(a * 2) * 0.5
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [radius])

  const dotsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(...colors.cyanRGB),
        size: 0.06,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [colors],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1
      ringRef.current.rotation.x = 0.5 + Math.sin(t * 0.15) * 0.1
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = reduced ? 0 : t * 0.06
    }
    ringMat.opacity = 0.2 + Math.abs(Math.sin(t * 0.6)) * 0.15
  })

  return (
    <group position={position} ref={groupRef}>
      <mesh geometry={ringGeo} material={ringMat} ref={ringRef} />
      <mesh geometry={ringGeo2} material={ringMat} />
      <points geometry={dotsGeo} material={dotsMat} />
    </group>
  )
}