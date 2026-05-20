'use client'

import { useEffect, useState } from 'react'

interface Section {
  id: string
  label: string
}

interface CaseStudyNavProps {
  sections: Section[]
}

export default function CaseStudyNav({ sections }: CaseStudyNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')

  // Scroll-position tracker — finds the last section whose top has crossed
  // ~30% of the viewport from the top. Matches the IslandNav pattern.
  useEffect(() => {
    const ACTIVATION = window.innerHeight * 0.3

    const getSections = () =>
      sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]

    let rafId: number | null = null

    const update = () => {
      const els = getSections()
      if (!els.length) return

      // At the very bottom of the page, force the last section active
      const docHeight = document.documentElement.scrollHeight
      const scrollBottom = window.scrollY + window.innerHeight
      if (scrollBottom >= docHeight - 50) {
        setActiveId(sections[sections.length - 1].id)
        return
      }

      let current = sections[0].id
      for (const el of els) {
        if (el.getBoundingClientRect().top <= ACTIVATION) {
          current = el.id
        }
      }
      setActiveId(current)
    }

    const onScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [sections])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    setActiveId(id)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Update the URL hash without triggering a hard jump
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav className="case-study-toc" aria-label="On this page">
      <div className="case-study-toc-header">On this page</div>
      <ul className="case-study-toc-list">
        {sections.map(section => {
          const isActive = activeId === section.id
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`case-study-toc-link${isActive ? ' is-active' : ''}`}
                onClick={(e) => handleClick(e, section.id)}
              >
                <span className="case-study-toc-dot" aria-hidden />
                <span className="case-study-toc-label">{section.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
