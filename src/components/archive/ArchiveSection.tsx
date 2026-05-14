'use client'

import { useEffect, useState } from 'react'
import Reveal from '@/components/ui/Reveal'

// ─── Gallery config — any entry can be 'image' or 'video' (mp4/webm/gif) ───
type GalleryItem = { type: 'image' | 'video'; src: string }

const GALLERY_ITEMS: GalleryItem[] = [
  { type: 'video', src: '/archive/archive_1.webm' },
  { type: 'video', src: '/archive/archive_2.webm' },
  { type: 'video', src: '/archive/archive_3.webm' },
  { type: 'video', src: '/archive/archive_4.webm' },
  { type: 'video', src: '/archive/archive_5.webm' },
]

function ArrowUpRight() {
  return (
    <svg className="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      style={{
        transition: 'transform 0.35s var(--ease)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function ArchiveSection() {
  const [expanded, setExpanded] = useState(false)

  // Auto-expand when the URL hash points at this section
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#archive') setExpanded(true)
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  return (
    <section className="section" id="archive">
      {/* ── Slim teaser banner — always visible ─────────────────── */}
      <Reveal>
        <button
          type="button"
          className="archive-teaser"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-controls="archive-panel"
        >
          <span className="label-pill">
            <span className="ldot" style={{ background: 'var(--purple)' }} />
            Archive
          </span>
          <span className="archive-teaser-copy">
            Previously: <span className="serif">portfolio v1</span>
            <span className="t3-inline"> · click to {expanded ? 'collapse' : 'expand'}</span>
          </span>
          <span className="archive-teaser-chevron" aria-hidden>
            <ChevronDown open={expanded} />
          </span>
        </button>
      </Reveal>

      {/* ── Expandable body — animated via grid-template-rows ───── */}
      <div
        id="archive-panel"
        className={`archive-panel ${expanded ? 'is-open' : ''}`}
        aria-hidden={!expanded}
      >
        <div className="archive-panel-inner">
          <div className="archive-wrap">

            {/* ── Left: copy + stats ────────────────────────────────── */}
            <div className="archive-copy">
              <h3>
                Previously: <span className="serif">portfolio v1.</span>
              </h3>

              <p>
                An earlier version explored a more playful, pixel-inspired interface with a
                personal chatbot (&ldquo;Daniel-Bot&rdquo;). v2 keeps the conversational idea
                — but moves toward a cleaner, more cinematic system.
              </p>

              <div className="archive-stats">
                <div className="as">
                  <div className="l">Live since</div>
                  <div className="v">2024 — 2026</div>
                </div>
                <div className="as">
                  <div className="l">Theme</div>
                  <div className="v">Pixel · playful</div>
                </div>
                <div className="as">
                  <div className="l">Built with</div>
                  <div className="v">Next.js</div>
                </div>
                <div className="as">
                  <div className="l">Status</div>
                  <div className="v" style={{ color: 'var(--green)' }}>Archived</div>
                </div>
              </div>

              <a className="btn btn-ghost" href="#">
                Visit v1 site
                <ArrowUpRight />
              </a>
            </div>

            {/* ── Right: scattered media gallery ─────────────────────── */}
            <div className="archive-gallery">
              {GALLERY_ITEMS.map((item, i) => {
                const n = i + 1
                return (
                  <div key={n} className={`gallery-card gc-${n}`}>
                    <span className="gallery-num">0{n}</span>
                    {item.type === 'video' ? (
                      <video
                        src={item.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.src}
                        alt={`Portfolio v1 — screen ${n}`}
                        loading="lazy"
                      />
                    )}
                  </div>
                )
              })}
              <span className="gallery-hint">PREVIOUSLY V1</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
