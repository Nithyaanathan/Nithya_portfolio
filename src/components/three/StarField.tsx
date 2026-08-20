import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ColorSet } from '@/lib/colors'

interface StarFieldProps {
  colors: ColorSet
  count: number
  reduced: boolean
}

function makeSeededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return s / 4294967296
  }
}

const VERT = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.5 + 0.5 * sin(uTime * (0.8 + aPhase) + aPhase * 6.2831);
    gl_PointSize = uSize * aScale * (260.0 / -mv.z);
    vAlpha = tw;
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`

export function StarField({ colors, count, reduced }: StarFieldProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const { geometry, material } = useMemo(() => {
    const rand = makeSeededRandom(42)
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Long "tunnel" volume that spans the whole camera path
      positions[i * 3] = (rand() - 0.5) * 64
      positions[i * 3 + 1] = (rand() - 0.5) * 38
      positions[i * 3 + 2] = 14 - rand() * 158
      scales[i] = 0.4 + rand() * 1.4
      phases[i] = rand()
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 2.2 },
        uColor: { value: new THREE.Color(...colors.textRGB) },
        uOpacity: { value: 1 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry, material }
  }, [count, colors])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t
      matRef.current.uniforms.uColor.value.set(...colors.textRGB)
      matRef.current.uniforms.uOpacity.value = reduced ? 0.75 : 1
    }
  })

  return <points geometry={geometry} material={material} ref={(node) => {
    if (node) matRef.current = node.material as THREE.ShaderMaterial
  }} />
}