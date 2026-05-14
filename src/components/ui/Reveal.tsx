'use client'

import { useEffect, useRef } from 'react'

interface RevealProps {
  children: React.ReactNode
  delay?: 1 | 2 | 3 | 4 | 5
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export default function Reveal({ children, delay, className = '', as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            obs.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    // @ts-expect-error — dynamic tag with ref is fine here
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-delay={delay}
    >
      {children}
    </Tag>
  )
}
