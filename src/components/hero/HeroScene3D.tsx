'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Pre-allocated colours — never created inside the render loop
const BASE_COLOR = new THREE.Color('#5fe5d3')
const LIT_COLOR  = new THREE.Color('#ffffff')
const TMP_COLOR  = new THREE.Color()

function LowPolySphere() {
  const groupRef = useRef<THREE.Group>(null)
  const targetY  = useRef(0)
  const currentY = useRef(0)

  // ── Scroll → rotation target ──────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      targetY.current = max > 0 ? (window.scrollY / max) * Math.PI * 3 : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Geometries ────────────────────────────────────────────────────────────
  const baseGeo = useMemo(() => new THREE.IcosahedronGeometry(1.3, 2), [])

  const fillGeo = useMemo(() => {
    const geo = baseGeo.toNonIndexed()
    geo.computeVertexNormals()
    return geo
  }, [baseGeo])

  // Edge geometry with a per-vertex colour attribute
  const edgesGeo = useMemo(() => {
    const geo   = new THREE.EdgesGeometry(baseGeo, 1)
    const count = geo.attributes.position.count
    const cols  = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      cols[i * 3]     = BASE_COLOR.r
      cols[i * 3 + 1] = BASE_COLOR.g
      cols[i * 3 + 2] = BASE_COLOR.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
    return geo
  }, [baseGeo])

  const cageGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.85, 1)),
    [],
  )

  // ── Edge midpoints + per-edge brightness ──────────────────────────────────
  const { midpoints, brightness } = useMemo(() => {
    const pos = edgesGeo.attributes.position as THREE.BufferAttribute
    const n   = pos.count / 2          // one midpoint per edge
    const mid = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      mid[i * 3]     = (pos.getX(i * 2) + pos.getX(i * 2 + 1)) * 0.5
      mid[i * 3 + 1] = (pos.getY(i * 2) + pos.getY(i * 2 + 1)) * 0.5
      mid[i * 3 + 2] = (pos.getZ(i * 2) + pos.getZ(i * 2 + 1)) * 0.5
    }
    return { midpoints: mid, brightness: new Float32Array(n) }
  }, [edgesGeo])

  // ── Scan state ────────────────────────────────────────────────────────────
  const scan = useRef({
    active:   false,
    nx: 1, ny: 0, nz: 0,   // plane normal (local space)
    pos:     -1.5,           // current signed distance along normal
    speed:    2.2,
    timer:    0,
    cooldown: 1.6,
  })

  const startScan = () => {
    const s     = scan.current
    const angle = Math.random() * Math.PI
    s.nx        = Math.cos(angle)
    s.ny        = Math.sin(angle)
    s.nz        = (Math.random() - 0.5) * 0.4
    const len   = Math.sqrt(s.nx ** 2 + s.ny ** 2 + s.nz ** 2)
    s.nx /= len; s.ny /= len; s.nz /= len
    s.pos      = -1.5
    s.speed    = 1.8 + Math.random() * 1.6
    s.cooldown = 1.0 + Math.random() * 2.2
    s.active   = true
    s.timer    = 0
  }

  // ── Per-frame: scroll lerp + scan sweep + colour fade ────────────────────
  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Scroll-driven rotation
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, delta * 3)
    groupRef.current.rotation.y = currentY.current
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.1

    const s      = scan.current
    const colors = edgesGeo.attributes.color as THREE.BufferAttribute
    const n      = midpoints.length / 3

    // Advance scan or count down cooldown
    if (s.active) {
      s.pos += delta * s.speed
      for (let i = 0; i < n; i++) {
        const dot =
          midpoints[i * 3]     * s.nx +
          midpoints[i * 3 + 1] * s.ny +
          midpoints[i * 3 + 2] * s.nz
        if (Math.abs(dot - s.pos) < 0.2) brightness[i] = 1.0
      }
      if (s.pos > 1.6) s.active = false
    } else {
      s.timer += delta
      if (s.timer >= s.cooldown) startScan()
    }

    // Fade brightness and write vertex colours
    for (let i = 0; i < n; i++) {
      brightness[i] = Math.max(0, brightness[i] - delta * 2.0)
      TMP_COLOR.copy(BASE_COLOR).lerp(LIT_COLOR, brightness[i])
      colors.setXYZ(i * 2,     TMP_COLOR.r, TMP_COLOR.g, TMP_COLOR.b)
      colors.setXYZ(i * 2 + 1, TMP_COLOR.r, TMP_COLOR.g, TMP_COLOR.b)
    }
    colors.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <mesh geometry={fillGeo}>
        <meshStandardMaterial color="#0c1f30" roughness={0.6} metalness={0.25} />
      </mesh>

      {/* vertexColors reads the per-vertex colour attribute we update each frame */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial vertexColors />
      </lineSegments>

      <lineSegments geometry={cageGeo}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </lineSegments>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[-4, 3.5, 3]}  color="#5fe5d3" intensity={24} />
      <pointLight position={[ 4, -2,   2]}  color="#bf5af2" intensity={16} />
      <pointLight position={[ 0,  2,   5]}  color="#ffffff" intensity={4}  />
      <LowPolySphere />
    </>
  )
}

export default function HeroScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ scene }) => { scene.background = null }}
    >
      <Scene />
    </Canvas>
  )
}
