'use client'

import { useEffect, useRef, useState } from 'react'
import { createOceanScene } from './createOceanScene'

export default function HeroScene3D() {
  const container = useRef<HTMLDivElement>(null)
  const controller = useRef<ReturnType<typeof createOceanScene> | null>(null)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const pausedRef = useRef(false)
  const visible = useRef(false)

  useEffect(() => {
    const stage = container.current
    if (!stage) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => controller.current?.setRunning(visible.current && !document.hidden && !pausedRef.current)
    const onPreference = () => {
      pausedRef.current = preference.matches
      setPaused(preference.matches)
      sync()
    }
    try {
      controller.current = createOceanScene(stage)
    } catch {
      setFailed(true)
      return
    }
    onPreference()
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting
      sync()
    })
    observer.observe(stage)
    preference.addEventListener('change', onPreference)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', onPreference)
      document.removeEventListener('visibilitychange', sync)
      controller.current?.dispose()
      controller.current = null
    }
  }, [])

  function toggleMotion() {
    const next = !paused
    pausedRef.current = next
    setPaused(next)
    controller.current?.setRunning(visible.current && !document.hidden && !next)
  }

  return (
    <div className="ocean-scene">
      <div ref={container} className="ocean-stage" role="img" aria-label="A boat carrying Daniel's favicon on its flag, floating on a cyan and violet ocean grid." />
      {failed ? (
        <p className="ocean-fallback">Navigating changing tides.</p>
      ) : (
        <button className="ocean-motion" type="button" onClick={toggleMotion} aria-label={paused ? 'Play motion' : 'Pause motion'} title={paused ? 'Play motion' : 'Pause motion'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            {paused ? (
              <path d="M8 5v14l11-7z" />
            ) : (
              <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>
            )}
          </svg>
        </button>
      )}
    </div>
  )
}
