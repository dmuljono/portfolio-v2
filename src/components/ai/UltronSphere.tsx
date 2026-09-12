'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const SHELL_COLORS = ['#963fff', '#624dff', '#287dff', '#24d5ef']
const RING_COLORS = ['#dc87ef', '#b77bff', '#9654ff', '#7854ff', '#516aff', '#328aff', '#29adef', '#37c5ef', '#56e3ee']
const AXES = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) }

function tintFor(object: THREE.Object3D) {
  for (let parent = object.parent; parent; parent = parent.parent) {
    if (typeof parent.userData.spinSpeed === 'number') {
      const index = Number(parent.name.match(/\d+/)?.[0] ?? 0)
      return parent.name.startsWith('Shell') ? SHELL_COLORS[index - 1] : RING_COLORS[index]
    }
  }
  return object.name.startsWith('CORE') ? '#c4a1ff' : object.name.includes('fragmented') ? '#e878c9' : '#53ceef'
}

/** The Blender hologram, sized to Dani's card and independent of the demo server. */
export default function UltronSphere({ active = true }: { active?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const [failed, setFailed] = useState(false)
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false
    let visible = false
    let loaded = false
    let elapsed = 0
    let previous = performance.now()
    let lastFrame = 0
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const layers: { object: THREE.Object3D; axis: THREE.Vector3; initial: THREE.Quaternion; speed: number }[] = []
    const pulseMaterials = new Map<THREE.MeshStandardMaterial, number>()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 60)
    camera.position.copy(new THREE.Vector3(8, 6, 13).normalize().multiplyScalar(8.1))
    camera.lookAt(0, 0, 0)
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.AgXToneMapping
    renderer.toneMappingExposure = .9
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;mix-blend-mode:screen;mask-image:radial-gradient(ellipse closest-side at center,black 68%,rgba(0,0,0,0.75) 82%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse closest-side at center,black 68%,rgba(0,0,0,0.75) 82%,transparent 100%)'
    host.appendChild(renderer.domElement)
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    const bloom = new UnrealBloomPass(new THREE.Vector2(260, 260), .28, .16, .65)
    const output = new OutputPass()
    composer.addPass(renderPass)
    composer.addPass(bloom)
    composer.addPass(output)
    const resize = new ResizeObserver(() => {
      const width = host.clientWidth || 260
      const height = host.clientHeight || 260
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      composer.setSize(width, height)
      if (loaded && visible) composer.render()
    })
    resize.observe(host)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { rootMargin: '80px' })
    intersection.observe(host)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const rotation = new THREE.Quaternion()

    new GLTFLoader().load('/models/dani-sphere.glb', gltf => {
      if (disposed) {
        gltf.scene.traverse(object => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose()
            for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose()
          }
        })
        return
      }
      const cache = new Map<string, THREE.MeshStandardMaterial>()
      gltf.scene.traverse(object => {
        if (typeof object.userData.spinSpeed === 'number') {
          const axis = object.name.startsWith('Shell') ? 'z' : object.userData.spinAxis as keyof typeof AXES
          layers.push({ object, axis: AXES[axis] || AXES.y, initial: object.quaternion.clone(), speed: object.userData.spinSpeed * .38 })
        }
        if (!(object instanceof THREE.Mesh)) return
        geometries.add(object.geometry)
        const tint = tintFor(object)
        const scale = object.name.includes('interrupted') ? .62 : object.name.startsWith('Interlayer') ? .60 : object.name.startsWith('CORE') ? .85 : 1.05
        const originals = Array.isArray(object.material) ? object.material : [object.material]
        const colored = originals.map((original: THREE.MeshStandardMaterial) => {
          materials.add(original)
          const key = `${original.uuid}:${tint}:${scale}`
          let material = cache.get(key)
          if (!material) {
            material = original.clone()
            material.emissive.set(tint)
            material.emissiveIntensity *= scale
            material.onBeforeCompile = shader => {
              shader.vertexShader = 'varying vec3 vHologramWorld; varying vec3 vCircuitLocal;\n' + shader.vertexShader
              shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', 'vCircuitLocal = transformed; vHologramWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#include <project_vertex>')
              shader.fragmentShader = 'varying vec3 vHologramWorld; varying vec3 vCircuitLocal;\n' + shader.fragmentShader
              shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\nfloat hemisphere = dot(vHologramWorld, normalize(cameraPosition));\nfloat depthBrightness = mix(0.30, 1.12, smoothstep(-2.5, 2.2, hemisphere));\nfloat circuitVariation = 0.58 + 0.42 * smoothstep(-0.55,0.75,sin(dot(vCircuitLocal,vec3(6.7,3.4,5.1))) * cos(dot(vCircuitLocal,vec3(2.1,8.3,1.7))));\ntotalEmissiveRadiance *= depthBrightness * circuitVariation;')
            }
            material.customProgramCacheKey = () => 'dani-hologram-depth-v2'
            materials.add(material)
            cache.set(key, material)
            if (original.name.startsWith('Pale gold')) pulseMaterials.set(material, material.emissiveIntensity)
          }
          return material
        })
        object.material = Array.isArray(object.material) ? colored : colored[0]
      })
      scene.add(gltf.scene)
      loaded = true
      composer.render()
    }, undefined, () => { if (!disposed) setFailed(true) })

    renderer.setAnimationLoop(now => {
      const delta = Math.min((now - previous) / 1000, .05)
      previous = now
      if (!loaded || !visible || !activeRef.current || document.hidden || reducedMotion.matches) return
      elapsed += delta
      if (now - lastFrame < 1000 / 30) return
      lastFrame = now
      for (const layer of layers) {
        rotation.setFromAxisAngle(layer.axis, elapsed * layer.speed)
        layer.object.quaternion.copy(layer.initial).multiply(rotation)
      }
      for (const [material, base] of pulseMaterials) material.emissiveIntensity = base * (1 + .075 * Math.sin(elapsed * 1.4))
      composer.render()
    })

    return () => {
      disposed = true
      intersection.disconnect()
      resize.disconnect()
      renderer.setAnimationLoop(null)
      for (const geometry of geometries) geometry.dispose()
      for (const material of materials) material.dispose()
      bloom.dispose()
      output.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div ref={hostRef} role="img" aria-label="Dani: a layered cyan, blue and violet holographic sphere" style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      {failed && <span style={{ color: 'var(--t2)', fontSize: 12 }}>3D preview unavailable</span>}
    </div>
  )
}
