'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// ─── Curve definition — a torus-knot path, used as the ribbon's centerline ───
class TorusKnotCurve extends THREE.Curve<THREE.Vector3> {
  p: number
  q: number
  R: number
  r: number

  constructor(p = 2, q = 3, R = 0.85, r = 0.35) {
    super()
    this.p = p
    this.q = q
    this.R = R
    this.r = r
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const u = t * Math.PI * 2
    const cu = Math.cos(u)
    const su = Math.sin(u)
    const qu = this.q * u
    const cqu = Math.cos(qu)
    const squ = Math.sin(qu)

    const x = (this.R + this.r * cqu) * Math.cos(this.p * u)
    const y = (this.R + this.r * cqu) * Math.sin(this.p * u)
    const z = this.r * squ
    // suppress unused-var lints
    void cu
    void su
    return target.set(x, y, z)
  }
}

// ─── Build a flat ribbon swept along the curve ───────────────────────────────
function buildRibbon() {
  const curve = new TorusKnotCurve(2, 3, 0.85, 0.35)
  const segments = 500
  const width = 0.18

  const frames = curve.computeFrenetFrames(segments, true)
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []

  // Site palette — turq → violet → bill-warm
  const cA = new THREE.Color('#5fe5d3')
  const cB = new THREE.Color('#8b5cf6')
  const cC = new THREE.Color('#ff7a8a')

  const tmp = new THREE.Vector3()
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const p = curve.getPoint(t, tmp).clone()
    // Use binormal as the strip-width direction (perpendicular to tangent)
    const b = frames.binormals[i % segments]

    const left  = p.clone().addScaledVector(b, -width / 2)
    const right = p.clone().addScaledVector(b,  width / 2)
    positions.push(left.x, left.y, left.z, right.x, right.y, right.z)

    // Palindromic gradient — start and end match
    let color: THREE.Color
    if (t < 0.25)      color = new THREE.Color().lerpColors(cA, cB, t * 4)
    else if (t < 0.5)  color = new THREE.Color().lerpColors(cB, cC, (t - 0.25) * 4)
    else if (t < 0.75) color = new THREE.Color().lerpColors(cC, cB, (t - 0.5) * 4)
    else               color = new THREE.Color().lerpColors(cB, cA, (t - 0.75) * 4)
    colors.push(color.r, color.g, color.b, color.r, color.g, color.b)
  }

  // Two triangles per segment connecting left/right edges of adjacent samples
  for (let i = 0; i < segments; i++) {
    const a = i * 2          // current left
    const b = a + 1          // current right
    const c = a + 2          // next left
    const d = a + 3          // next right
    indices.push(a, b, c)
    indices.push(b, d, c)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.setIndex(indices)
  return geo
}

// ─── The mesh ────────────────────────────────────────────────────────────────
function MobiusStrip() {
  const coreRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(buildRibbon, [])

  useFrame((state, delta) => {
    if (!coreRef.current || !haloRef.current) return
    const t = state.clock.elapsedTime

    // Continuous rotation on ALL three axes at incommensurable speeds →
    // genuine 3D tumble that constantly cycles through every orientation.
    // The light sine modulation gives the rates a breathing feel so it
    // doesn't look like a metronome.
    coreRef.current.rotation.x += delta * (0.38 + Math.sin(t * 0.23) * 0.15)
    coreRef.current.rotation.y += delta * (0.27 + Math.cos(t * 0.31) * 0.12)
    coreRef.current.rotation.z += delta * (0.21 + Math.sin(t * 0.17) * 0.10)

    haloRef.current.rotation.copy(coreRef.current.rotation)
  })

  return (
    <group>
      <mesh ref={haloRef} geometry={geometry} scale={1.06}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={coreRef} geometry={geometry}>
        <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ─── Wrapper ─────────────────────────────────────────────────────────────────
export default function MobiusOrb() {
  return (
    <div className="mobius-orb-wrap">
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <MobiusStrip />
      </Canvas>
    </div>
  )
}
