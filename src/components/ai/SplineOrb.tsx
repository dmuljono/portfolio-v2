'use client'

import { useEffect, useRef } from 'react'

export default function SplineOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let app: {
      dispose: () => void
      setBackgroundColor?: (c: string) => void
    } | null = null
    let cancelled = false

    import('@splinetool/runtime')
      .then(({ Application }) => {
        if (cancelled || !canvasRef.current) return
        app = new Application(canvasRef.current)
        return (app as unknown as { load: (url: string) => Promise<void> }).load(
          'https://prod.spline.design/PePChtwwmpPXQEFh/scene.splinecode',
        )
      })
      .then(() => {
        // Make the scene background transparent so our card shows through
        app?.setBackgroundColor?.('transparent')
      })
      .catch((err) => {
        console.error('[Spline] Failed to load:', err)
      })

    return () => {
      cancelled = true
      app?.dispose()
    }
  }, [])

  return (
    <div className="spline-orb-wrap">
      <canvas ref={canvasRef} />
      {/* Cover the "Built with Spline" watermark in the bottom-right */}
      <div className="spline-mask" />
    </div>
  )
}
