'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface LightboxImageProps {
  src: string
  alt: string
  caption: string
}

export default function LightboxImage({ src, alt, caption }: LightboxImageProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)

  // Portal target only exists after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const close = () => {
    setOpen(false)
    // Drop focus on the thumbnail so no lingering focus state remains
    triggerRef.current?.blur()
  }

  // Esc-to-close + body scroll lock while open
  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const lightbox = (
    <div
      className="lightbox-backdrop"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={(e) => {
          e.stopPropagation()
          close()
        }}
        aria-label="Close image"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lightbox-image" src={src} alt={alt} />
        <div className="lightbox-caption">{caption}</div>
      </div>
    </div>
  )

  return (
    <>
      {/* Thumbnail */}
      <figure
        ref={triggerRef as React.RefObject<HTMLElement>}
        className="case-study-screenshot"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Enlarge: ${alt}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>

      {/* Portal — escapes any transform parents so fixed positioning works */}
      {open && mounted && createPortal(lightbox, document.body)}
    </>
  )
}
