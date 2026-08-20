import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ColorSet } from '@/lib/colors'

interface NeuralConstellationProps {
  colors: ColorSet
  nodeCount: number
  reduced: boolean
}

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return s / 4294967296
  }
}

export function NeuralConstellation({ colors, nodeCount, reduced }: NeuralConstellationProps) {
  const groupRef = useRef<THREE.Group>(null)
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null)

  const { nodesGeo, linesGeo } = useMemo(() => {
    const rand = seeded(1337)
    const nodes: THREE.Vector3[] = []
    for (let i = 0; i < nodeCount; i++) {
      const x = (rand() - 0.5) * 52
      const y = (rand() - 0.5) * 30
      const z = 12 - rand() * 150
      nodes.push(new THREE.Vector3(x, y, z))
    }

    const nodePositions = new Float32Array(nodes.length * 3)
    nodes.forEach((n, i) => {
      nodePositions[i * 3] = n.x
      nodePositions[i * 3 + 1] = n.y
      nodePositions[i * 3 + 2] = n.z
    })
    const nodesGeo = new THREE.BufferGeometry()
    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))

    // connect close neighbours, capped per node
    const edges = new Set<string>()
    const connsPerNode = new Array(nodes.length).fill(0)
    const threshold = 7.2
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (connsPerNode[i] >= 3 || connsPerNode[j] >= 3) continue
        const d = nodes[i].distanceTo(nodes[j])
        if (d < threshold) {
          const key = `${i}-${j}`
          if (!edges.has(key)) {
            edges.add(key)
            connsPerNode[i]++
            connsPerNode[j]++
          }
        }
      }
    }

    const linePositions = new Float32Array(edges.size * 6)
    let k = 0
    edges.forEach((key) => {
      const [a, b] = key.split('-').map(Number)
      linePositions[k * 6] = nodes[a].x
      linePositions[k * 6 + 1] = nodes[a].y
      linePositions[k * 6 + 2] = nodes[a].z
      linePositions[k * 6 + 3] = nodes[b].x
      linePositions[k * 6 + 4] = nodes[b].y
      linePositions[k * 6 + 5] = nodes[b].z
      k++
    })

    const linesGeo = new THREE.BufferGeometry()
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return { nodesGeo, linesGeo }
  }, [nodeCount])

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(...colors.accentRGB),
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [colors],
  )

  const nodeMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(...colors.dimRGB),
        size: 0.07,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [colors],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = reduced ? 0 : Math.sin(t * 0.05) * 0.12
      groupRef.current.rotation.z = reduced ? 0 : Math.cos(t * 0.04) * 0.06
    }
    if (lineMatRef.current) {
      lineMatRef.current.opacity = 0.1 + Math.abs(Math.sin(t * 0.3)) * 0.1
      lineMatRef.current.color.set(...colors.accentRGB)
    }
    if (nodeMaterial) {
      nodeMaterial.color.set(...colors.dimRGB)
    }
  })

  return (
    <group ref={groupRef}>
      <points geometry={nodesGeo} material={nodeMaterial} />
      <lineSegments
        geometry={linesGeo}
        material={lineMaterial}
        ref={(node) => {
          if (node) lineMatRef.current = node.material as THREE.LineBasicMaterial
        }}
      />
    </group>
  )
}