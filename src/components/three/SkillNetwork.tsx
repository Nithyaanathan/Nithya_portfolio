import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ColorSet } from '@/lib/colors'
import { damp } from '@/lib/colors'
import { skillClusters, type SkillNode } from '@/data/skills'

interface SkillNetworkProps {
  colors: ColorSet
  reduced: boolean
  onHover: (node: SkillNode | null, clusterName: string) => void
}

type PointerRef = { current: { x: number; y: number; active: boolean } }

const CLUSTER_RADIUS = 3.15
const NODE_RADIUS = 1.02

function clusterColor(c: ColorSet, id: string): THREE.Color {
  switch (id) {
    case 'programming':
      return new THREE.Color(...c.accentRGB)
    case 'data':
      return new THREE.Color(...c.cyanRGB)
    case 'aiml':
      return new THREE.Color(...c.violetRGB)
    case 'tools':
      return new THREE.Color(...c.accent2RGB)
    default:
      return new THREE.Color(
        (c.cyanRGB[0] + c.violetRGB[0]) / 2,
        (c.cyanRGB[1] + c.violetRGB[1]) / 2,
        (c.cyanRGB[2] + c.violetRGB[2]) / 2,
      )
  }
}

interface NodeDef {
  id: string
  pos: THREE.Vector3
  isCluster: boolean
  clusterName: string
  skill: SkillNode | null
  color: THREE.Color
  baseScale: number
}

interface SceneProps {
  colors: ColorSet
  reduced: boolean
  onHover: (node: SkillNode | null, clusterName: string) => void
  pointerRef: PointerRef
}

function SkillScene({ colors, reduced, onHover, pointerRef }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])
  const edgeGeoRef = useRef<THREE.BufferGeometry>(null)
  const hovered = useRef<string | null>(null)
  const lastEmit = useRef<string>('')
  const { camera, size } = useThree()

  const { nodes, edges, geometry, baseEdgeColors } = useMemo(() => {
    const clusters = skillClusters.map((c, i) => {
      const a = (i / skillClusters.length) * Math.PI * 2 - Math.PI / 2
      return {
        ...c,
        pos: new THREE.Vector3(Math.cos(a) * CLUSTER_RADIUS, Math.sin(a) * CLUSTER_RADIUS, 0),
      }
    })

    const defs: NodeDef[] = []
    clusters.forEach((cl) => {
      const cc = clusterColor(colors, cl.id)
      defs.push({ id: `c-${cl.id}`, pos: cl.pos, isCluster: true, clusterName: cl.name, skill: null, color: cc, baseScale: 0.17 })
      cl.nodes.forEach((n, ni) => {
        const na = (ni / cl.nodes.length) * Math.PI * 2
        const pos = cl.pos.clone().add(new THREE.Vector3(Math.cos(na), Math.sin(na), 0).multiplyScalar(NODE_RADIUS))
        defs.push({
          id: `n-${cl.id}-${ni}`,
          pos,
          isCluster: false,
          clusterName: cl.name,
          skill: n,
          color: new THREE.Color(...colors.dimRGB),
          baseScale: 0.1,
        })
      })
    })

    const edgeList: [number, number][] = []
    clusters.forEach((cl, ci) => {
      const clusterIndex = defs.findIndex((d) => d.id === `c-${cl.id}`)
      cl.nodes.forEach((_, ni) => {
        const nodeIndex = defs.findIndex((d) => d.id === `n-${cl.id}-${ni}`)
        edgeList.push([clusterIndex, nodeIndex])
      })
      if (ci > 0) {
        const prev = defs.findIndex((d) => d.id === `c-${clusters[ci - 1].id}`)
        edgeList.push([clusterIndex, prev])
      }
    })

    const positions = new Float32Array(edgeList.length * 6)
    const colorsArr = new Float32Array(edgeList.length * 6)
    edgeList.forEach(([a, b], i) => {
      positions[i * 6] = defs[a].pos.x
      positions[i * 6 + 1] = defs[a].pos.y
      positions[i * 6 + 2] = defs[a].pos.z
      positions[i * 6 + 3] = defs[b].pos.x
      positions[i * 6 + 4] = defs[b].pos.y
      positions[i * 6 + 5] = defs[b].pos.z
      const col = new THREE.Color(...colors.dimRGB)
      for (let k = 0; k < 6; k++) colorsArr[i * 6 + k] = k % 3 === 0 ? col.r : k % 3 === 1 ? col.g : col.b
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3))

    return { nodes: defs, edges: edgeList, geometry, baseEdgeColors: colorsArr.slice() }
  }, [colors])

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const p = pointerRef.current

    if (groupRef.current) {
      const rotY = reduced ? 0 : p.x * 0.18 + Math.sin(t * 0.12) * 0.08
      groupRef.current.rotation.y = damp(groupRef.current.rotation.y, rotY, 2.5, dt)
      groupRef.current.position.y = reduced ? 0 : Math.sin(t * 0.5) * 0.08
    }

    // hover detection via screen-space projection
    let bestId: string | null = null
    let bestDist = Infinity
    const threshold = Math.max(16, Math.min(size.width, size.height) * 0.032)
    if (p.active) {
      const v = new THREE.Vector3()
      for (let i = 0; i < nodes.length; i++) {
        const mesh = meshRefs.current[i]
        if (!mesh) continue
        const node = nodes[i]
        mesh.getWorldPosition(v)
        v.project(camera)
        if (v.z > 1 || v.z < -1) continue
        const sx = (v.x * 0.5 + 0.5) * size.width
        const sy = (-v.y * 0.5 + 0.5) * size.height
        const d = Math.hypot(sx - p.x, sy - p.y)
        if (d < threshold && d < bestDist) {
          bestDist = d
          bestId = node.id
        }
      }
    }

    hovered.current = bestId

    // emit hover change
    if (bestId && bestId !== lastEmit.current) {
      lastEmit.current = bestId
      const node = nodes.find((n) => n.id === bestId)
      if (node) onHover(node.skill, node.clusterName)
    } else if (!bestId && lastEmit.current) {
      lastEmit.current = ''
      onHover(null, '')
    }

    // node scale animation
    nodes.forEach((node, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      const target = node.id === bestId ? node.baseScale * 2.0 : node.baseScale
      const s = damp(mesh.scale.x, target, 9, dt)
      mesh.scale.setScalar(s)
      mesh.position.y = node.pos.y + (reduced ? 0 : Math.sin(t * 0.8 + i * 0.7) * 0.045)
    })

    // edge highlight
    const geo = edgeGeoRef.current
    if (geo && bestId) {
      const attr = geo.getAttribute('color') as THREE.BufferAttribute
      const arr = attr.array as Float32Array
      const bright = bestId.startsWith('c-')
        ? clusterColor(colors, bestId.slice(2))
        : new THREE.Color(...colors.accentRGB)
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i]
        const hit = nodes[a].id === bestId || nodes[b].id === bestId
        if (hit) {
          const idx = i * 6
          for (let k = 0; k < 6; k++) arr[idx + k] = k % 3 === 0 ? bright.r : k % 3 === 1 ? bright.g : bright.b
        } else {
          const base = i * 6
          for (let k = 0; k < 6; k++) arr[base + k] = baseEdgeColors[base + k]
        }
      }
      attr.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      <lineSegments
        ref={(n) => {
          if (n) edgeGeoRef.current = n.geometry
        }}
        geometry={geometry}
        material={edgeMaterial}
      />
      {nodes.map((node, i) => (
        <SkillNodeMesh
          key={node.id}
          index={i}
          node={node}
          register={(m) => {
            meshRefs.current[i] = m
          }}
        />
      ))}
    </group>
  )
}

function SkillNodeMesh({ node, index, register }: { node: NodeDef; index: number; register: (m: THREE.Mesh | null) => void }) {
  const geo = useMemo(() => new THREE.SphereGeometry(1, 16, 16), [])
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: node.isCluster ? 0.95 : 0.82,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [node.id],
  )
  void index
  return <mesh ref={register} geometry={geo} material={mat} position={node.pos} scale={node.baseScale} />
}

export function SkillNetwork({ colors, reduced, onHover }: SkillNetworkProps) {
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  return (
    <div
      className="h-[420px] w-full touch-none select-none sm:h-[520px]"
      style={{ pointerEvents: 'auto' }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        pointerRef.current.x = e.clientX - rect.left
        pointerRef.current.y = e.clientY - rect.top
        pointerRef.current.active = true
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false
        onHover(null, '')
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
        dpr={reduced ? 1 : [1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 48 }}
        style={{ background: 'transparent' }}
      >
        <SkillScene colors={colors} reduced={reduced} onHover={onHover} pointerRef={pointerRef} />
      </Canvas>
    </div>
  )
}